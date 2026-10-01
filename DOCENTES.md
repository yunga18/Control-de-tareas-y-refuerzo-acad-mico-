# Activar el acceso docente de Yunga School

El cambio visual funciona en GitHub Pages. El inicio de sesión necesita un proyecto Supabase: **todavía no está conectado**. El panel permanece cerrado mientras las dos propiedades de `auth-config.js` estén vacías.

## 1. Crear y preparar el proyecto

1. Entra a https://supabase.com/dashboard y crea un proyecto de tu propiedad. Guarda su contraseña de base de datos en privado: no la necesitas compartir ni poner en GitHub.
2. Abre **SQL Editor**, pega el contenido completo de [supabase/setup.sql](./supabase/setup.sql) y ejecútalo.
3. El script permite inicialmente **yungabryam32@gmail.com**. La lista admite como máximo dos profesores y no se puede modificar desde la web pública.
4. En **Authentication → Users**, crea la cuenta de ese correo con **Add user → Create new user**, confirma el correo con la opción de creación correspondiente y usa una contraseña aleatoria que conservarás en privado. La app usará códigos, no esa contraseña. No uses «Invite» si no quieres enviar una invitación en este paso. La aplicación no crea usuarios por sí sola (`create_user: false`).

## 2. Configurar los códigos de correo

1. En **Authentication → Email Templates**, cambia la plantilla **Magic Link** para incluir el código `{{ .Token }}`. Ejemplo de cuerpo:

```html
<h2>Acceso docente a Yunga School</h2>
<p>Tu código temporal es: <strong>{{ .Token }}</strong></p>
<p>Si no solicitaste el código, ignora este mensaje.</p>
```

2. Configura el envío de correo. El servicio de prueba de Supabase restringe destinatarios a miembros del equipo del proyecto; para otros destinatarios necesitas un SMTP configurado en **Authentication → SMTP Settings**. No pongas credenciales SMTP en el repositorio.
3. Si tú eres miembro del equipo con `yungabryam32@gmail.com`, comprueba si el servicio de prueba admite tu dirección. Para el segundo docente, configura SMTP o incorpóralo al equipo según tu organización y los límites del servicio.
4. Usa como **Site URL**: `https://yunga18.github.io/Control-de-tareas-y-refuerzo-acad-mico-/`. El flujo por código no depende de redirecciones del correo.

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
2. Escribe `yungabryam32@gmail.com`, solicita el código y escríbelo cuando llegue.
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
- La sesión no se recuerda al recargar. No guarda tokens ni datos docentes en localStorage. En una computadora compartida, cierra sesión y elimina las copias descargadas cuando corresponda.
- El contenido educativo y las guías siguen siendo públicos en el repositorio. La protección se aplica al espacio de registros docentes y a su escritura en el servidor.
- El esquema y la interfaz se pueden verificar localmente; los correos y permisos del proyecto real deben comprobarse después de configurarlo.

Referencias oficiales: https://supabase.com/docs/guides/auth/auth-email-passwordless · https://supabase.com/docs/guides/auth/auth-smtp · https://supabase.com/docs/guides/database/postgres/row-level-security
