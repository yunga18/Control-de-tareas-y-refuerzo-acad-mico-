# Activar el acceso docente de Yunga School

La web está configurada para el proyecto Supabase `xfrfzrzwovuienairgmd`. Los docentes entran con correo y contraseña. El acceso requiere que el SQL de autorización esté instalado y la cuenta esté creada y confirmada. Estos pasos sirven para verificar la configuración o preparar otro proyecto.

## 1. Crear y preparar el proyecto

1. Entra a https://supabase.com/dashboard y crea un proyecto de tu propiedad. Guarda su contraseña de base de datos en privado: no la necesitas compartir ni poner en GitHub.
2. Abre **SQL Editor**, pega el contenido completo de [supabase/setup.sql](./supabase/setup.sql) y ejecútalo.
3. El script permite inicialmente **yungabryam32@gmail.com**. La lista admite como máximo dos profesores y no se puede modificar desde la web pública.
4. En **Authentication → Users**, crea la cuenta de ese correo con **Add user → Create new user**, confirma el correo con la opción de creación correspondiente y usa una contraseña aleatoria que conservarás en privado. La app usará ese correo y contraseña para iniciar sesión. No uses «Invite» si no quieres enviar una invitación en este paso. La aplicación no ofrece registro público de usuarios.

## 2. Comprobar la cuenta

En **Authentication → Users** debe aparecer tu correo confirmado. Usa una contraseña segura y guárdala en privado. La app accede por correo y contraseña: no requiere editar plantillas ni configurar SMTP para iniciar sesión con cuentas ya creadas y confirmadas. No crees las cuentas desde una invitación por correo si no has configurado su envío.

Si olvidas la contraseña, el administrador puede restablecerla en el panel/API de administración de Supabase. No habilitamos un formulario público de registro ni recuperación por correo en esta versión. Nunca pongas contraseñas o claves de administración en GitHub.

## 3. Conectar la web

Busca la **Project URL** y una clave **publishable** del proyecto (o la clave pública **anon** heredada). Edita `auth-config.js`:

```js
window.YUNGA_AUTH_CONFIG = Object.freeze({
  supabaseUrl: 'https://TU-PROYECTO.supabase.co',
  publishableKey: 'sb_publishable_...'
});
```

Estos dos valores son públicos por diseño; los permisos se comprueban en las funciones del servidor. **Nunca incluyas `service_role`, `sb_secret`, tokens de administración, contraseñas ni credenciales SMTP.** Incrementa la versión del caché en `sw.js` cuando cambies la configuración y guarda el cambio en main.

## 4. Entrar y comprobar

1. Abre la app → **Panel docente**.
2. Escribe `yungabryam32@gmail.com` y la contraseña que definiste al crear esa cuenta. Pulsa **Entrar como docente**.
3. El servidor comprueba el correo confirmado y la autorización antes de cargar los registros. Si no hay servicio/configuración/permiso, el acceso falla cerrado.
4. Crea un estudiante con alias, registra una tarea o rúbrica y espera **Guardado en nube**. Cierra sesión y entra otra vez para confirmar la persistencia.
5. Prueba con una cuenta autenticada no autorizada: no debe poder leer ni guardar el espacio.

Los estudiantes abren el enlace normal sin cuenta y practican en su navegador. Sus resultados no se sincronizan automáticamente: pueden exportar una copia JSON para que el docente la revise e importe desde **Datos y fuentes** en su sesión. La importación añade perfiles como copias. Las rúbricas recibidas se deben revisar con el estudiante; un archivo no demuestra que haya realizado una actividad.

## 5. Añadir al segundo profesor

Cuando conozcas su correo, crea su cuenta en Authentication y ejecuta como administrador:

```sql
insert into yunga_private.teachers(email) values ('correo-del-profesor@ejemplo.com');
```

Usa el correo real, en minúsculas. La base impide un tercer docente. Ambos profesores comparten el mismo espacio. Para revocar una autorización:

```sql
delete from yunga_private.teachers where email='correo-del-profesor@ejemplo.com';
```

La revocación bloquea las siguientes consultas/guardados al servidor. Una pestaña que ya descargó datos puede conservar su copia en memoria hasta cerrarla; el administrador puede además revocar sesiones desde Supabase.

## Límites y copias

- Guarda como máximo 20 perfiles y exporta copias periódicas.
- Si hay error de red, los cambios pendientes permanecen en esa pestaña y el estado lo indica; no se promete guardado remoto hasta su confirmación.
- Si otro docente guarda antes, no se sobrescribe su versión: exporta tu copia, vuelve a entrar e incorpora manualmente lo necesario. La importación crea perfiles nuevos, no fusiona.
- La sesión no se recuerda al recargar. La app no guarda la contraseña. No guarda tokens ni datos docentes en localStorage. En una computadora compartida, cierra sesión y elimina las copias descargadas cuando corresponda.
- El contenido educativo y las guías siguen siendo públicos en el repositorio. La protección se aplica al espacio de registros docentes y a su escritura en el servidor.
- El esquema y la interfaz se pueden verificar localmente; el inicio de sesión y permisos del proyecto real deben comprobarse después de configurarlo.

Referencias oficiales: https://supabase.com/docs/guides/auth/passwords · https://supabase.com/docs/guides/database/postgres/row-level-security
