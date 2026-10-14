# Yunga School · Mi aventura de aprender

Un espacio de práctica para **una estudiante de sexto de EGB**, con juegos integrados en GitHub Pages. La portada tiene Inicio, Matemáticas, Bioexploradores y Mi progreso. Conserva los colores azul, rojo y blanco.

## Juegos

- **Isla MCM:** juego original, con 12 misiones y cuatro pasos para encontrar múltiplos, comunes y el menor positivo. No usa cronómetro.
- **Misión Fracciones:** juego original, con 10 planetas para sumar con el MCM, transformar fracciones equivalentes, combinar piezas y simplificar.
- **Taller de fracciones:** 16 retos nuevos, cuatro por operación: suma, resta, multiplicación y división. Incluye elección de reglas, conexión de números, representación con piezas y simplificación. El resultado se guarda al completar los cuatro pasos.
- **Bioexploradores:** versión ampliada original con 11 juegos y 12 insignias. Células animal y vegetal; partes y enfoque del microscopio; bacterias, protoctistas, hongos y virus; vertebrados e invertebrados; memoria de grupos animales; crecimiento de una planta; componentes de ecosistemas; productores, consumidores y descomponedores; cadenas alimentarias; ecosistemas del Ecuador y adaptaciones.

Los juegos viven en `juegos/`, se abren dentro de la misma web y tienen un enlace para volver a Yunga School. No se incrustan sitios externos ni se depende del inicio de sesión de ChatGPT. Los proyectos originales de Sites no se han modificado.

## Uso y datos

Abre https://yunga18.github.io/Control-de-tareas-y-refuerzo-acad-mico-/ . Puedes cambiar el alias de la estudiante desde el botón de perfil. No hay registro, selector de estudiantes ni configuración de base de datos en esta versión.

El progreso se guarda **en el navegador del dispositivo**, con estas claves: `islaMcmProgressV1`, `fractionMissionV1`, `yungaOperationsV1`, `bioexploradores-v1` y `yunga-school-focus-v1`. La portada lee el avance de los cuatro juegos. Se conservan los mejores resultados; repetir no reduce las estrellas. Las actividades en curso no se conservan al abandonar o recargar su página.

En **Mi progreso** puedes guardar y restaurar una copia JSON, o borrar las pruebas de un juego o de todos. El borrado pide confirmación y conserva el alias. El progreso no se sincroniza entre dispositivos. Las copias de la plataforma docente anterior tienen otro formato y no se importan aquí. El progreso de los juegos en los dominios originales de Sites pertenece a esos otros navegadores/orígenes y no se traslada automáticamente.

El service worker guarda la portada y todos los archivos de los juegos después de una primera carga completa con Internet. A continuación se puede practicar sin conexión en navegadores compatibles. La aplicación es estática, no utiliza APIs de pago, análisis automático de exposiciones ni IA en ejecución. Las estrellas indican práctica, no una calificación ni una promoción oficial.

## Desarrollo y publicación

No requiere compilación. Ejecuta `python -m http.server 8080` en esta carpeta para revisar la web localmente. Publica la rama `main`, carpeta raíz, con GitHub Pages. Al actualizar archivos del caché, cambia su versión y comprueba la lista `ASSETS` de `sw.js`.

Archivos principales: `index.html`, `styles.css`, `app.js`, `sw.js`, `manifest.webmanifest`, `assets/` y `juegos/`. `juegos/operaciones/data.js` define las misiones y el cálculo racional de las respuestas.

Los archivos antiguos de autenticación, currículo, documentación docente y SQL se mantienen como referencia de la plataforma anterior. No se cargan desde la nueva interfaz, no se ejecutan y no son necesarios para practicar. Esta actualización no borra registros de la antigua base de datos ni la antigua clave local `aula-semilla-v1`.
