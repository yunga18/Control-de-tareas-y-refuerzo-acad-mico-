# Yunga School

App estática de refuerzo para sexto de EGB, orientada a preparar el aprendizaje de séptimo con clases, práctica y evidencias variadas.

## Funciones

- 41 módulos iniciales: Matemática, Lengua y Literatura, Ciencias Naturales, Estudios Sociales, Inglés, Educación Cultural y Artística, Educación Física y habilidades para la vida.
- 123 preguntas propias con explicaciones; diagnóstico por área o global, con una pregunta por tema y guardado del intento en curso.
- Juegos de parejas y puzzles de secuencias, operables sin arrastrar y sin cronómetro.
- Explicaciones, ejemplos, actividades prácticas y guías de clases de 35–45 minutos.
- Exposiciones y evidencias de juegos presenciales, proyectos, arte y movimiento, valoradas por un docente con cuatro criterios de rúbrica.
- Hasta 20 perfiles separados, clases y tareas editables, informe imprimible e historial.
- Cuentas estudiantiles: tareas desde casa, entregas con texto/enlace/archivos privados, devoluciones, correcciones y resultados de pruebas/juegos compartidos.
- Valoración docente para marcar temas consolidados, reabrir el refuerzo o volver a la regla automática, con justificación.
- Exportación e importación de copias JSON; las importaciones añaden perfiles sin sustituir existentes.
- Práctica estudiantil sin conexión tras la primera carga mediante service worker. El acceso y guardado docente requieren conexión y un proyecto Supabase configurado. No usa inteligencia artificial en ejecución.

## Publicar con GitHub Pages

1. Abre **Settings → Pages** en este repositorio.
2. En **Build and deployment**, elige **Deploy from a branch**.
3. Selecciona **main** y **/(root)**, y guarda.
4. Espera a que GitHub confirme el despliegue. La dirección prevista es:
   `https://yunga18.github.io/Control-de-tareas-y-refuerzo-acad-mico-/`

No requiere compilación. Para probar localmente ejecuta `python -m http.server 8080` dentro de la carpeta y abre `http://localhost:8080`.

## Datos y límites

La práctica estudiantil se guarda en localStorage en el navegador del dispositivo. Se conserva la clave antigua `aula-semilla-v1` para no borrar el progreso existente. El espacio docente, cuando se activa, utiliza autenticación por correo y contraseña y un documento privado en Supabase compartido entre un máximo de dos docentes autorizados. La cuenta inicial es `yungabryam32@gmail.com`. Con la ampliación `supabase/classroom.sql`, los estudiantes con cuenta asociada comparten sus resultados completados y entregas; el docente los recibe al actualizar «Trabajo en casa». La práctica sin cuenta continúa siendo local y puede exportarse para revisión e importación docente. Las evidencias locales/importadas no acreditan por sí solas una valoración docente verificada. Los registros no se guardan en GitHub. Usar alias es posible. Exporta copias periódicas y antes de borrar los datos del navegador. El historial conserva los últimos 1000 registros por perfil. Las actividades admiten hasta 500 tareas por perfil. Las copias admitidas tienen hasta 5 MB.

La app no graba ni analiza voz, cámara o video. Permite adjuntar fotos, PDF, audio y videos pequeños ya creados para revisión humana. Las exposiciones y prácticas pueden ser observadas por el docente. No hay puntuación automática de actuaciones reales. Los juegos digitales comprueban relaciones y secuencias, no sustituyen la evidencia corporal, artística u oral.

**Consolidado** es una regla orientativa interna: última prueba conceptual del tema ≥ 75 % y última evidencia observada con los cuatro criterios ≥ 3 (autonomía). El docente también puede marcar o reabrir el dominio manualmente con una justificación. Los juegos y el diagnóstico no otorgan ese estado. El resultado no acredita promoción oficial. Una respuesta por tema en el diagnóstico es una muestra breve, no una prueba estandarizada. La prueba de cada tema contiene tres preguntas; admite repetirlas y familiarizarse con ellas, por lo que siempre se contrasta con aplicación observada.

## Relación curricular

Los códigos se usan como referencias del subnivel de Básica Media (quinto, sexto y séptimo). Algunas referencias apuntan a bloques; no todas son una DCD individual ni exclusivamente de sexto. Este banco inicial no contiene todas las DCD ni sustituye la planificación institucional, los indicadores oficiales o las adaptaciones individuales. La secuencia de historia y la profundidad de las operaciones se ajustan con la escuela.

Fuentes de referencia:
- https://educacion.gob.ec/curriculo-priorizado/
- https://educacion.gob.ec/wp-content/uploads/downloads/2025/08/Curriculo-Priorizado-EGB-Media.pdf
- https://recursos.educacion.gob.ec/red/textossexto/
- https://educacion.gob.ec/curriculo-media/

El contenido explicativo, preguntas y actividades son una elaboración propia. Revisa `curriculum.js` para ampliar o corregir módulos. Cada módulo tiene área, título, referencias, explicación, ejemplo, actividad, secuencia y tres preguntas con explicación. La respuesta correcta se almacena con índice 0, y la interfaz mezcla el orden al presentar las opciones.

## Archivos

- `index.html`: estructura accesible y navegación.
- `styles.css`: diseño adaptable a celular, escritorio e impresión.
- `curriculum.js`: banco inicial de contenidos y actividades.
- `app.js`: perfiles, ruta, evaluaciones, juegos, rúbricas y copias.
- `teacher-auth.js`: acceso por correo y contraseña, comprobación de rol en el servidor y guardado docente con control de versiones.
- `auth-config.js`: URL y clave pública del proyecto conectado.
- `classroom.js`: acceso estudiantil, entregas, revisión, archivos privados y valoración del dominio.
- `supabase/setup.sql`: autorización y almacenamiento privado docente.
- `supabase/classroom.sql`: ampliación de cuentas estudiantiles, entregas y permisos de Storage.
- `TRABAJO-EN-CASA.md`: activación, cuentas, asignación, revisión y límites gratuitos.
- `DOCENTES.md`: pasos para activar el servicio y añadir al segundo docente.
- `sw.js`, `manifest.webmanifest`, `icon.svg`: modo offline e instalación compatible.

Para una actualización, incrementa el nombre de caché en `sw.js`. Si añades archivos esenciales, inclúyelos en `ASSETS`.


## Activar docentes

Consulta [DOCENTES.md](./DOCENTES.md). **El acceso permanece cerrado hasta completar la configuración.** Escribir un correo en la web no da permiso. La lista de autorizaciones está en un esquema privado y solo el administrador del proyecto puede modificarla. Las funciones del servidor verifican la identidad confirmada de Supabase; usuarios no autorizados no pueden leer ni guardar el espacio. No se guardan tokens en localStorage ni se incluyen registros privados en el service worker. Las guías y preguntas son contenido estático público: el control protege los registros docentes, no oculta los archivos del repositorio.

El guardado usa una revisión del documento: si dos profesores editan a la vez, el servidor rechaza la versión antigua y la interfaz pide exportar una copia y volver a entrar. No combina cambios automáticamente. Comprueba «Guardado en nube» antes de cerrar. La sesión vive en memoria y se renueva mientras la pestaña está abierta; recargar requiere iniciar sesión de nuevo.

## Activar trabajo en casa

Consulta [TRABAJO-EN-CASA.md](./TRABAJO-EN-CASA.md). El código está preparado, pero debes ejecutar la ampliación SQL en el proyecto Supabase para habilitar estas funciones. Usa el plan Free: la versión no requiere suscripciones ni APIs de pago. El servicio tiene cuotas y puede pausar por inactividad; no hay una garantía de gratuidad perpetua. Los adjuntos son privados, de hasta 5 MB, con límites de cantidad para cuidar el almacenamiento. Descarga y retira archivos antiguos cuando sea necesario.
