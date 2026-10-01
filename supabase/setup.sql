-- Ejecutar como administrador en SQL Editor de un proyecto Supabase nuevo.
-- La autorización se consulta en el servidor; el navegador no administra docentes.
begin;
create schema if not exists yunga_private;
revoke all on schema yunga_private from public, anon, authenticated;
create table if not exists yunga_private.teachers (
  email text primary key check (email = lower(trim(email)))
);
create or replace function yunga_private.limit_teachers()
returns trigger language plpgsql set search_path = '' as $$
begin
  perform pg_advisory_xact_lock(19260301);
  if (select count(*) from yunga_private.teachers) >= 2 then
    raise exception 'Solo se permiten dos docentes';
  end if;
  return new;
end $$;
drop trigger if exists max_two_teachers on yunga_private.teachers;
create trigger max_two_teachers before insert on yunga_private.teachers
for each row execute function yunga_private.limit_teachers();
-- Idempotente: no vuelve a insertar un correo existente.
insert into yunga_private.teachers(email)
select 'yungabryam32@gmail.com'
where not exists (select 1 from yunga_private.teachers where email='yungabryam32@gmail.com');

create or replace function public.yunga_is_teacher()
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (
    select 1 from auth.users u
    join yunga_private.teachers t on t.email=lower(u.email)
    where u.id=auth.uid() and u.email_confirmed_at is not null
  );
$$;
revoke all on function public.yunga_is_teacher() from public, anon;
grant execute on function public.yunga_is_teacher() to authenticated;

create table if not exists public.yunga_workspace (
  id integer primary key check (id=1),
  payload jsonb,
  revision integer not null default 0,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);
insert into public.yunga_workspace(id) values(1) on conflict do nothing;
alter table public.yunga_workspace enable row level security;
revoke all on public.yunga_workspace from public, anon, authenticated;
-- Solo las funciones pueden leer o modificar la fila; se revocan accesos REST directos.
create or replace function public.yunga_load_workspace()
returns jsonb language plpgsql security definer set search_path = '' as $$
begin
  if not public.yunga_is_teacher() then
    raise insufficient_privilege using message='Acceso docente denegado';
  end if;
  return (select jsonb_build_object('payload',payload,'revision',revision)
    from public.yunga_workspace where id=1);
end $$;
create or replace function public.yunga_save_workspace(p_payload jsonb,p_revision integer)
returns integer language plpgsql security definer set search_path = '' as $$
declare next_revision integer;
begin
  if not public.yunga_is_teacher() then
    raise insufficient_privilege using message='Acceso docente denegado';
  end if;
  if p_payload is null or octet_length(p_payload::text)>5242880
     or p_payload->>'version' is distinct from '1'
     or jsonb_typeof(p_payload->'students') is distinct from 'array' then
    raise exception 'Formato de datos no válido';
  end if;
  if jsonb_array_length(p_payload->'students') not between 1 and 20 then
    raise exception 'Número de estudiantes no válido';
  end if;
  update public.yunga_workspace set payload=p_payload,revision=revision+1,
    updated_at=now(),updated_by=auth.uid()
    where id=1 and revision=p_revision returning revision into next_revision;
  if not found then
    raise sqlstate '40001' using message='El espacio fue actualizado por otro docente';
  end if;
  return next_revision;
end $$;
revoke all on function public.yunga_load_workspace() from public, anon;
revoke all on function public.yunga_save_workspace(jsonb,integer) from public, anon;
grant execute on function public.yunga_load_workspace() to authenticated;
grant execute on function public.yunga_save_workspace(jsonb,integer) to authenticated;
commit;

-- Cuando tengas el correo del segundo profesor, ejecuta SOLO como administrador:
-- insert into yunga_private.teachers(email) values ('correo-del-profesor@ejemplo.com');
-- Para revocar acceso: delete from yunga_private.teachers where email='correo@ejemplo.com';
