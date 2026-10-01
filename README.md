# Aula Semilla

App estática de refuerzo para sexto de EGB, orientada a preparar el aprendizaje de séptimo con clases, práctica y evidencias variadas.

## Funciones

- 41 módulos iniciales: Matemática, Lengua y Literatura, Ciencias Naturales, Estudios Sociales, Inglés, Educación Cultural y Artística, Educación Física y habilidades para la vida.
- 123 preguntas propias con explicaciones; diagnóstico por área o global, con una pregunta por tema y guardado del intento en curso.
- Juegos de parejas y puzzles de secuencias, operables sin arrastrar y sin cronómetro.
- Explicaciones, ejemplos, actividades prácticas y guías de clases de 35–45 minutos.
- Exposiciones y evidencias de juegos presenciales, proyectos, arte y movimiento, valoradas por un docente con cuatro criterios de rúbrica.
- Hasta 20 perfiles separados, clases y tareas editables, informe imprimible e historial.
- Exportación e importación de copias JSON; las importaciones añaden perfiles sin sustituir existentes.
- Uso sin conexión tras la primera carga mediante service worker. No usa servicios de pago, bibliotecas externas ni inteligencia artificial en ejecución.

## Publicar con GitHub Pages

1. Abre **Settings → Pages** en este repositorio.
2. En **Build and deployment**, elige **Deploy from a branch**.
3. Selecciona **main** y **/(root)**, y guarda.
4. Espera a que GitHub confirme el despliegue. La dirección prevista es:
   `https://yunga18.github.io/Control-de-tareas-y-refuerzo-acad-mico-/`

No requiere compilación. Para probar localmente ejecuta `python -m http.server 8080` dentro de la carpeta y abre `http://localhost:8080`.

## Datos y límites

Los datos se guardan en localStorage en el navegador del dispositivo. No se guardan en GitHub y no hay sincronización entre equipos, cuentas ni contraseña docente. Usar alias es posible. Exporta copias periódicas y antes de borrar los datos del navegador. El historial conserva los últimos 1000 registros por perfil. Las actividades admiten hasta 500 tareas por perfil. Las copias admitidas tienen hasta 5 MB.

No se graba voz, cámara o video; las exposiciones y prácticas son observadas por el docente. No hay puntuación automática de actuaciones reales. Los juegos digitales comprueban relaciones y secuencias, no sustituyen la evidencia corporal, artística u oral.

**Consolidado** es una regla orientativa interna: última prueba conceptual del tema ≥ 75 % y última evidencia observada con los cuatro criterios ≥ 3 (autonomía). Los juegos y el diagnóstico no otorgan ese estado. El resultado no acredita promoción oficial. Una respuesta por tema en el diagnóstico es una muestra breve, no una prueba estandarizada. La prueba de cada tema contiene tres preguntas; admite repetirlas y familiarizarse con ellas, por lo que siempre se contrasta con aplicación observada.

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
- `sw.js`, `manifest.webmanifest`, `icon.svg`: modo offline e instalación compatible.

Para una actualización, incrementa el nombre de caché en `sw.js`. Si añades archivos esenciales, inclúyelos en `ASSETS`.
