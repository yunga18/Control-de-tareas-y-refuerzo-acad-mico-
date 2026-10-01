-- Ampliación gratuita de Yunga School. Ejecutar después de setup.sql como administrador.
-- No borra perfiles ni tareas. Accesos de estudiantes por cuentas Auth confirmadas.
begin;
create table if not exists yunga_private.class_students (
  student_id text primary key check(student_id ~ '^[a-zA-Z0-9-]{1,100}$'),
  email text not null unique check(email=lower(trim(email)))
);
create table if not exists yunga_private.class_events (
  student_id text not null references yunga_private.class_students on delete cascade,
  event_id text not null,
  payload jsonb not null,
  received_at timestamptz not null default clock_timestamp(),
  primary key(student_id,event_id)
);
create table if not exists yunga_private.class_submissions (
  id uuid primary key default gen_random_uuid(),
  student_id text not null references yunga_private.class_students on delete cascade,
  task_id text not null,
  answer text not null default '',
  link text not null default '',
  files jsonb not null default '[]',
  state text not null default 'enviado' check(state in ('enviado','correccion','revisado')),
  feedback text not null default '',
  revision integer not null default 1,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  unique(student_id,task_id)
);
create table if not exists yunga_private.class_mastery (
  student_id text not null references yunga_private.class_students on delete cascade,
  lesson text not null,
  consolidated boolean not null,
  reason text not null,
  reviewed_at timestamptz not null default now(),
  primary key(student_id,lesson)
);
alter table yunga_private.teachers enable row level security;
alter table yunga_private.class_students enable row level security;
alter table yunga_private.class_events enable row level security;
alter table yunga_private.class_submissions enable row level security;
alter table yunga_private.class_mastery enable row level security;
revoke all on all tables in schema yunga_private from public,anon,authenticated;

create or replace function yunga_private.my_student()
returns text language sql stable security definer set search_path='' as $$
 select s.student_id from yunga_private.class_students s join auth.users u
 on lower(u.email)=s.email where u.id=auth.uid() and u.email_confirmed_at is not null;
$$;
create or replace function yunga_private.profile(p_id text)
returns jsonb language sql stable security definer set search_path='' as $$
 select s from public.yunga_workspace w,
 lateral jsonb_array_elements(coalesce(w.payload->'students','[]'::jsonb)) s
 where w.id=1 and s->>'id'=p_id limit 1;
$$;
create or replace function yunga_private.has_task(p_student text,p_task text)
returns boolean language sql stable security definer set search_path='' as $$
 select exists(select 1 from jsonb_array_elements(coalesce(yunga_private.profile(p_student)->'tasks','[]'::jsonb)) t where t->>'id'=p_task);
$$;
create or replace function yunga_private.bundle(p_id text)
returns jsonb language sql stable security definer set search_path='' as $$
 select jsonb_build_object(
  'profile',yunga_private.profile(p_id),
  'email',(select email from yunga_private.class_students where student_id=p_id),
  'events',coalesce((select jsonb_agg(payload order by received_at,event_id) from yunga_private.class_events where student_id=p_id),'[]'::jsonb),
  'submissions',coalesce((select jsonb_agg(to_jsonb(s) order by submitted_at desc) from yunga_private.class_submissions s where student_id=p_id),'[]'::jsonb),
  'mastery',coalesce((select jsonb_agg(to_jsonb(m)) from yunga_private.class_mastery m where student_id=p_id),'[]'::jsonb)
 );
$$;
create or replace function public.yunga_class_teacher(p_student text)
returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if not public.yunga_is_teacher() then raise insufficient_privilege;end if;
 return yunga_private.bundle(p_student);
end $$;
create or replace function public.yunga_class_enroll(p_student text,p_email text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.yunga_is_teacher() then raise insufficient_privilege;end if;
 if yunga_private.profile(p_student) is null then raise exception 'Guarda el perfil antes de habilitarlo';end if;
 if p_email is null or length(p_email)>254 or p_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then raise exception 'Correo no válido';end if;
 if exists(select 1 from yunga_private.teachers where email=lower(trim(p_email))) then raise exception 'Usa una cuenta estudiantil diferente de la docente';end if;
 insert into yunga_private.class_students(student_id,email) values(p_student,lower(trim(p_email)))
 on conflict(student_id) do update set email=excluded.email;
end $$;
create or replace function public.yunga_class_home()
returns jsonb language plpgsql security definer set search_path='' as $$
declare sid text;
begin
 sid:=yunga_private.my_student();
 if sid is null or yunga_private.profile(sid) is null then raise insufficient_privilege using message='Cuenta sin perfil estudiantil asignado';end if;
 return yunga_private.bundle(sid);
end $$;
create or replace function public.yunga_class_sync(p_events jsonb)
returns void language plpgsql security definer set search_path='' as $$
declare sid text;e jsonb;n integer;
begin
 sid:=yunga_private.my_student();if sid is null then raise insufficient_privilege;end if;
 if jsonb_typeof(p_events) is distinct from 'array' or jsonb_array_length(p_events)>100 then raise exception 'Eventos no válidos';end if;
 perform pg_advisory_xact_lock(hashtext(sid));
 for e in select * from jsonb_array_elements(p_events) loop
  if e->>'id' is null or e->>'id' !~ '^[a-zA-Z0-9-]{1,100}$' or e->>'lesson' is null or e->>'lesson' !~ '^[a-z]+-[0-9]+$'
   or coalesce(e->>'type','') not in ('diag','knowledge','match','puzzle')
   or jsonb_typeof(e->'score') is distinct from 'number' then raise exception 'Resultado no válido';end if;
  n:=(e->>'score')::integer;if n<0 or n>100 then raise exception 'Nota no válida';end if;
  insert into yunga_private.class_events(student_id,event_id,payload)
  values(sid,e->>'id',jsonb_build_object('id',e->>'id','lesson',e->>'lesson','type',e->>'type','score',n,'date',clock_timestamp(),'detail',left(coalesce(e->>'detail',''),5000),'source','student'))
  on conflict do nothing;
 end loop;
 delete from yunga_private.class_events where student_id=sid and event_id in
 (select event_id from yunga_private.class_events where student_id=sid order by received_at desc,event_id desc offset 1000);
end $$;
create or replace function public.yunga_class_submit(p_task text,p_answer text,p_link text,p_files jsonb)
returns void language plpgsql security definer set search_path='' as $$
declare sid text;f jsonb;count_files integer;clean_files jsonb:='[]'::jsonb;
begin
 sid:=yunga_private.my_student();if sid is null or not yunga_private.has_task(sid,p_task) then raise insufficient_privilege;end if;
 if p_answer is null or length(p_answer)>10000 or p_link is null or length(p_link)>2000 or (p_link<>'' and p_link !~ '^https?://') then raise exception 'Respuesta o enlace no válido';end if;
 if jsonb_typeof(p_files) is distinct from 'array' then raise exception 'Adjuntos no válidos';end if;
 count_files:=jsonb_array_length(p_files);if count_files>3 or (trim(p_answer)='' and trim(p_link)='' and count_files=0) then raise exception 'Añade una respuesta, un enlace o un archivo';end if;
 for f in select * from jsonb_array_elements(p_files) loop
  if f->>'path' is null or f->>'path' not like sid||'/'||p_task||'/%' or not exists
    (select 1 from storage.objects where bucket_id='yunga-entregas' and name=f->>'path')
    or jsonb_typeof(f->'name') is distinct from 'string' or length(f->>'name') not between 1 and 180 then raise exception 'Archivo no válido';end if;
  clean_files:=clean_files||jsonb_build_array(jsonb_build_object('path',f->>'path','name',f->>'name'));
 end loop;
 perform pg_advisory_xact_lock(hashtext(sid||p_task));
 if exists(select 1 from yunga_private.class_submissions where student_id=sid and task_id=p_task and state='revisado') then raise exception 'Tu docente debe pedir una corrección antes de reenviar';end if;
 insert into yunga_private.class_submissions(student_id,task_id,answer,link,files)
 values(sid,p_task,p_answer,p_link,clean_files)
 on conflict(student_id,task_id) do update set answer=excluded.answer,link=excluded.link,files=excluded.files,state='enviado',revision=yunga_private.class_submissions.revision+1,submitted_at=now(),reviewed_at=null;
end $$;
create or replace function public.yunga_class_review(p_id uuid,p_revision integer,p_state text,p_feedback text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.yunga_is_teacher() then raise insufficient_privilege;end if;
 if p_state not in ('correccion','revisado') or p_feedback is null or trim(p_feedback)='' or length(p_feedback)>5000 then raise exception 'Escribe una devolución';end if;
 update yunga_private.class_submissions set state=p_state,feedback=p_feedback,reviewed_at=now(),revision=revision+1 where id=p_id and revision=p_revision;
 if not found then raise sqlstate '40001' using message='La entrega cambió; actualiza antes de revisarla';end if;
end $$;
create or replace function public.yunga_class_mastery(p_student text,p_lesson text,p_state boolean,p_reason text)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.yunga_is_teacher() then raise insufficient_privilege;end if;
 if p_lesson is null or p_lesson !~ '^[a-z]+-[0-9]+$' then raise exception 'Tema no válido';end if;
 if p_state is null then delete from yunga_private.class_mastery where student_id=p_student and lesson=p_lesson;return;end if;
 if p_reason is null or trim(p_reason)='' or length(p_reason)>3000 then raise exception 'Explica el motivo de tu valoración';end if;
 insert into yunga_private.class_mastery(student_id,lesson,consolidated,reason)
 values(p_student,p_lesson,p_state,p_reason)
 on conflict(student_id,lesson) do update set consolidated=excluded.consolidated,reason=excluded.reason,reviewed_at=now();
end $$;
create or replace function public.yunga_class_clear_files(p_id uuid)
returns void language plpgsql security definer set search_path='' as $$
begin
 if not public.yunga_is_teacher() then raise insufficient_privilege;end if;
 update yunga_private.class_submissions set files='[]'::jsonb,revision=revision+1 where id=p_id;
end $$;

-- Storage privado, máximo 5 MB por archivo; no se publican entregas en GitHub.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values('yunga-entregas','yunga-entregas',false,5242880,array['image/jpeg','image/png','image/webp','application/pdf','audio/mpeg','audio/mp4','audio/ogg','video/mp4','video/webm'])
on conflict(id) do update set public=false,file_size_limit=excluded.file_size_limit,allowed_mime_types=excluded.allowed_mime_types;
create or replace function public.yunga_file_read_allowed(p_name text)
returns boolean language sql stable security definer set search_path='' as $$
 select public.yunga_is_teacher() or (yunga_private.my_student() is not null and split_part(p_name,'/',1)=yunga_private.my_student());
$$;
create or replace function public.yunga_file_write_allowed(p_name text)
returns boolean language sql stable security definer set search_path='' as $$
 select yunga_private.my_student() is not null and split_part(p_name,'/',1)=yunga_private.my_student()
 and yunga_private.has_task(yunga_private.my_student(),split_part(p_name,'/',2))
 and (select count(*) from storage.objects where bucket_id='yunga-entregas' and split_part(name,'/',1)=yunga_private.my_student())<8
 and (select count(*) from storage.objects where bucket_id='yunga-entregas')<160;
$$;
create or replace function public.yunga_file_delete_allowed(p_name text)
returns boolean language sql stable security definer set search_path='' as $$
 select public.yunga_is_teacher() or (split_part(p_name,'/',1)=yunga_private.my_student() and not exists
 (select 1 from yunga_private.class_submissions s,jsonb_array_elements(s.files) f where f->>'path'=p_name));
$$;
drop policy if exists yunga_class_files_read on storage.objects;
create policy yunga_class_files_read on storage.objects for select to authenticated
using(bucket_id='yunga-entregas' and public.yunga_file_read_allowed(name));
drop policy if exists yunga_class_files_insert on storage.objects;
create policy yunga_class_files_insert on storage.objects for insert to authenticated
with check(bucket_id='yunga-entregas' and public.yunga_file_write_allowed(name));
drop policy if exists yunga_class_files_delete on storage.objects;
create policy yunga_class_files_delete on storage.objects for delete to authenticated
using(bucket_id='yunga-entregas' and public.yunga_file_delete_allowed(name));
-- No UPDATE: los estudiantes no pueden sobrescribir archivos ya entregados.
revoke all on all functions in schema yunga_private from public,anon,authenticated;
revoke all on function public.yunga_class_teacher(text),public.yunga_class_enroll(text,text),public.yunga_class_home(),public.yunga_class_sync(jsonb),public.yunga_class_submit(text,text,text,jsonb),public.yunga_class_review(uuid,integer,text,text),public.yunga_class_mastery(text,text,boolean,text),public.yunga_class_clear_files(uuid),public.yunga_file_read_allowed(text),public.yunga_file_write_allowed(text),public.yunga_file_delete_allowed(text) from public,anon;
grant execute on function public.yunga_class_teacher(text),public.yunga_class_enroll(text,text),public.yunga_class_home(),public.yunga_class_sync(jsonb),public.yunga_class_submit(text,text,text,jsonb),public.yunga_class_review(uuid,integer,text,text),public.yunga_class_mastery(text,text,boolean,text),public.yunga_class_clear_files(uuid),public.yunga_file_read_allowed(text),public.yunga_file_write_allowed(text),public.yunga_file_delete_allowed(text) to authenticated;
-- Gestión de pruebas: solo docentes, revisión optimista y borrado por perfil.
create or replace function public.yunga_class_cleanup_preview(p_student text,p_revision integer)
returns jsonb language plpgsql security definer set search_path='' as $$
begin
 if not public.yunga_is_teacher() then raise insufficient_privilege;end if;
 if not exists(select 1 from public.yunga_workspace where id=1 and revision=p_revision) then raise sqlstate '40001' using message='Otro docente actualizó el espacio; vuelve a entrar antes de borrar';end if;
 if yunga_private.profile(p_student) is null then raise exception 'El perfil ya no existe';end if;
 return jsonb_build_object('files',coalesce((select jsonb_agg(name) from storage.objects where bucket_id='yunga-entregas' and split_part(name,'/',1)=p_student),'[]'::jsonb));
end $$;
create or replace function public.yunga_class_cleanup(p_student text,p_revision integer,p_mode text)
returns jsonb language plpgsql security definer set search_path='' as $$
declare w public.yunga_workspace;list jsonb;s jsonb;active_id text;
begin
 if not public.yunga_is_teacher() then raise insufficient_privilege;end if;
 if p_mode is null or p_mode not in ('reset','delete') then raise exception 'Acción no válida';end if;
 select * into w from public.yunga_workspace where id=1 for update;
 if w.revision is distinct from p_revision then raise sqlstate '40001' using message='Otro docente actualizó el espacio; vuelve a entrar antes de borrar';end if;
 if yunga_private.profile(p_student) is null then raise exception 'El perfil ya no existe';end if;
 if exists(select 1 from storage.objects where bucket_id='yunga-entregas' and split_part(name,'/',1)=p_student) then raise exception 'No se borraron todos los archivos; reintenta antes de eliminar los registros';end if;
 if p_mode='delete' then
  select coalesce(jsonb_agg(x order by n),'[]'::jsonb) into list from jsonb_array_elements(w.payload->'students') with ordinality a(x,n) where x->>'id'<>p_student;
  if jsonb_array_length(list)=0 then list:=jsonb_build_array(jsonb_build_object('id',gen_random_uuid()::text,'name','Mi estudiante','logs','[]'::jsonb,'tasks','[]'::jsonb,'quiz',null));end if;
  delete from yunga_private.class_students where student_id=p_student;
 else
  select jsonb_agg(case when x->>'id'=p_student then x||jsonb_build_object('logs','[]'::jsonb,'tasks','[]'::jsonb,'quiz',null) else x end order by n) into list from jsonb_array_elements(w.payload->'students') with ordinality a(x,n);
  delete from yunga_private.class_events where student_id=p_student;
  delete from yunga_private.class_submissions where student_id=p_student;
  delete from yunga_private.class_mastery where student_id=p_student;
 end if;
 active_id:=w.payload->>'active';
 if not exists(select 1 from jsonb_array_elements(list) x where x->>'id'=active_id) then active_id:=list->0->>'id';end if;
 update public.yunga_workspace set payload=w.payload||jsonb_build_object('students',list,'active',active_id),revision=revision+1,updated_at=now(),updated_by=auth.uid() where id=1;
 return (select jsonb_build_object('payload',payload,'revision',revision) from public.yunga_workspace where id=1);
end $$;
revoke all on function public.yunga_class_cleanup_preview(text,integer),public.yunga_class_cleanup(text,integer,text) from public,anon;
grant execute on function public.yunga_class_cleanup_preview(text,integer),public.yunga_class_cleanup(text,integer,text) to authenticated;

commit;
