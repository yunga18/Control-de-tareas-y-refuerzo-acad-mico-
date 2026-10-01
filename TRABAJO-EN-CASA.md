# Tareas y entregas en Yunga School

Esta ampliación funciona con la web actual de GitHub Pages y el proyecto Supabase ya conectado. No requiere contratar una suscripción. Debes mantener el proyecto en **Free** y trabajar dentro de sus límites; no habilites un plan de pago para estos pasos.

## 1. Activar una sola vez

1. Entra al panel de tu proyecto Supabase.
2. Abre **SQL Editor → New query**.
3. Abre [supabase/classroom.sql](./supabase/classroom.sql), pulsa **Raw**, copia todo su contenido y pégalo en la consulta.
4. Pulsa **Run**. Al finalizar debe indicar que la consulta se ejecutó correctamente, sin errores.
5. Vuelve a Yunga School, actualiza la página y entra al **Panel docente**.

El script añade cuentas estudiantiles, resultados, entregas, devoluciones, valoraciones de dominio y un depósito privado para archivos. No borra los perfiles o las tareas existentes. Se puede ejecutar otra vez. Requiere que ya hayas ejecutado `supabase/setup.sql`, usado para activar docentes. La clave pública de la app no permite instalar este script: debes hacerlo desde tu panel de administración. No compartas contraseñas ni claves de administración.

## 2. Preparar una cuenta para cada estudiante

1. En Supabase abre **Authentication → Users → Add user → Create new user**.
2. Usa un correo del estudiante o de su representante y una contraseña distinta de la docente. Activa la opción de confirmar la cuenta (**Auto Confirm User**, si aparece). Usa un correo diferente para cada estudiante; la app vincula un correo a un solo perfil.
3. En Yunga School entra como docente. Crea o selecciona el perfil del estudiante. Puedes ponerle un alias.
4. En **Panel docente → Trabajo en casa → Habilitar cuenta estudiantil**, escribe exactamente el correo de esa cuenta y guarda.
5. Espera **Guardado en nube**. Si cambias una asociación, la nueva cuenta tendrá acceso a las tareas, entregas e historial de ese perfil. Hazlo solo cuando quieras transferir ese acceso.

No añadas correos estudiantiles a `yunga_private.teachers`. Las cuentas de estudiantes no tienen permiso docente. Para el segundo profesor, sigue [DOCENTES.md](./DOCENTES.md).

## 3. Qué entregar al estudiante

Comparte por un medio privado:

- Su correo de acceso.
- La contraseña de su cuenta estudiantil.
- El enlace: https://yunga18.github.io/Control-de-tareas-y-refuerzo-acad-mico-/#estudiante

Dile: «Entra en Acceso estudiante con esta cuenta. Allí verás Mis tareas. Completa la actividad y pulsa Entregar mi trabajo. También puedes practicar los temas y juegos; cuando termines una prueba o juego, tu resultado se enviará al docente».

No necesita pagar, instalar una app adicional ni entrar a Supabase. Las cuentas se crean y confirman desde la administración; el acceso con contraseña no requiere contratar correo SMTP. Esta versión no ofrece recuperación pública por correo. Si se pierde una contraseña, restablécela desde la administración de Supabase.

## 4. Asignar y revisar tareas

1. Como docente, selecciona al estudiante arriba.
2. Abre **Clases y tareas → Nueva actividad**. Escribe el tema, la fecha y las indicaciones. Por ejemplo: «Dibuja dos fracciones equivalentes y explica en un audio breve por qué representan lo mismo».
3. Guarda y espera **Guardado en nube**.
4. El estudiante entra en **Acceso estudiante** o pulsa **Actualizar tareas**. Puede entregar texto, un enlace o adjuntos: fotos, PDF, audio y videos pequeños ya creados.
5. En tu **Panel docente**, pulsa **Actualizar entregas**. Abre los archivos, lee su explicación y pulsa **Revisar entrega**.
6. Escribe una devolución y elige **Revisada** o **Solicitar corrección**. Al actualizar sus tareas, el estudiante verá tu comentario. Si solicitas corrección, podrá reenviar; una entrega revisada queda cerrada hasta que solicites una corrección.

Las entregas no se califican solas. Los estados de entrega y la casilla de tarea completada son distintos: la casilla organiza tu planificación y no sustituye la revisión ni la valoración del aprendizaje.

## 5. Marcar un tema como consolidado

En **Panel docente → Trabajo en casa → Valorar dominio de un tema**, elige el tema, selecciona **Marcar consolidado** y escribe qué evidencia observaste. Por ejemplo: «Resolvió tres problemas nuevos y explicó el procedimiento sin apoyo en la exposición».

También puedes **Reabrir: necesita refuerzo** si aparecen dificultades, o **Volver a la regla automática** para retirar tu decisión manual. La valoración queda guardada en el servidor y aparece en el progreso del estudiante al actualizar su cuenta.

La regla automática pide una última prueba del tema de al menos 75 % y la última rúbrica observada con al menos nivel 3 en sus cuatro criterios. Registra exposiciones, juegos presenciales, proyectos y prácticas con **Evaluar evidencia**. Aprobar un juego o marcar una entrega revisada no consolida automáticamente el tema. Este estado orienta el refuerzo; no decide la promoción oficial a séptimo.

## Límites gratuitos y conservación

- Según la página de precios consultada el 1 de octubre de 2026, Supabase Free incluye 500 MB de base de datos, 1 GB de archivos y 5 GB de transferencia, además de otros límites. Puede pausar el proyecto tras una semana de inactividad. El plan no anuncia una fecha de caducidad de prueba, pero los proveedores pueden cambiar las condiciones; no existe una garantía de gratuidad perpetua.
- GitHub Pages admite esta web en un repositorio público con GitHub Free.
- La app admite 20 perfiles, 500 actividades por perfil y conserva los últimos 1000 resultados por perfil. Un resultado enviado en línea permanece en Supabase aunque se cierre la sesión.
- Adjuntos: hasta 3 por entrega, 5 MB por archivo y 8 archivos almacenados por estudiante; el depósito limita las nuevas subidas a 160 archivos en total. Si llegas al límite, descarga y retira adjuntos antiguos desde las entregas. Los archivos reemplazados se intentan retirar automáticamente. Puedes revisar archivos huérfanos en **Storage → yunga-entregas** desde la administración. La transferencia también consume cuota al descargar archivos.
- **Retirar adjuntos** elimina los archivos; descarga antes lo que quieras conservar. Permanecen el texto, el enlace y la devolución de la entrega. No se promete almacenamiento ilimitado.
- **Datos y fuentes → Exportar copia JSON** descarga los perfiles, tareas y registros del espacio que está abierto. **Trabajo en casa → Exportar revisión** descarga la asociación, los resultados recibidos, entregas y valoraciones del estudiante seleccionado. Estas copias no contienen los archivos adjuntos: descárgalos aparte. La copia de revisión es de consulta; no tiene restauración automática desde la app.
- Supabase Free no incluye copias de seguridad automáticas. Haz copias periódicas. Un proyecto pausado se reanuda desde tu panel; hasta entonces, las entregas y accesos en línea no funcionarán.
- La práctica sin cuenta sigue siendo local y puede funcionar sin conexión tras la primera carga. Las tareas, entregas y resultados de cuentas requieren Internet. Si falla una conexión, conserva la pestaña y reintenta: los resultados pendientes no se guardan en el servidor hasta su confirmación. Los intentos de prueba sin terminar solo viven en esa pestaña al usar una cuenta.
- Las sesiones docentes y estudiantiles viven en memoria; recargar requiere volver a entrar. No se guardan las contraseñas ni los datos privados de las cuentas en el caché offline o localStorage. Cierra sesión al usar una computadora compartida.

Fuentes oficiales: https://supabase.com/pricing · https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages · https://supabase.com/docs/guides/storage/security/access-control

## Accesos separados y borrado de pruebas

La portada ofrece **Soy estudiante** y **Soy docente**. Después de entrar, cada rol tiene su propio menú. La práctica sin cuenta está disponible aparte. Para el docente, **Administrar estudiantes** aparece en el menú y como enlace en el panel; en celular puedes deslizar el menú horizontal.

Selecciona primero el perfil que utilizaste para probar. En **Administrar estudiantes** puedes **Borrar datos de prueba**, que conserva su perfil y asociación de acceso, o **Eliminar estudiante**, que retira también el perfil y su asociación. Ambas acciones eliminan tareas, resultados, intentos, entregas, adjuntos y valoraciones de ese perfil; los demás perfiles se conservan. Confirma solo después de exportar lo que quieras guardar. No se elimina la cuenta de Authentication de Supabase. Las casillas de tareas y la eliminación de una tarea siguen gestionando la planificación.

Si ya instalaste la ampliación anterior, vuelve a ejecutar el contenido completo y actualizado de `supabase/classroom.sql` para habilitar el borrado en nube. Si no está instalado, la interfaz mostrará los pasos y no dará por borrados los registros. Borrar archivos y borrar registros son dos operaciones: ante un fallo de red o un conflicto con otro docente, algunos archivos podrían haberse retirado aunque los registros sigan presentes; reintenta y comprueba el resultado. Sin cuenta, el borrado solo afecta a los datos de práctica de este dispositivo.
