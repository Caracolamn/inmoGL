# INMOGL · RAMA DE PRUEBAS Y PREVISUALIZACIÓN

## Objetivo
Ensayar cambios de la web en un navegador, con URL de pruebas estable y temporal, antes de publicar en `www.inmogl.com`, sin modificar ni sustituir producción durante la revisión.

## Ramas
- `main`: fuente de producción. NO cambiar sin aprobación expresa.
- `pruebas`: copia de `main` para cambios de ensayo. Mantener sincronizada con producción al iniciar un nuevo ciclo, sin sobrescribir cambios de prueba no aprobados.

## Estado
- Rama `pruebas` creada el 2026-11-08 desde `main`.
- El enlace navegable de previsualización NO está configurado todavía. Una rama GitHub, por sí sola, no produce un sitio GitHub Pages independiente.

## Propuesta de despliegue
Utilizar un sitio GitHub Pages de pruebas separado del sitio publicado (por ejemplo, repositorio auxiliar `inmoGL-preview` dentro de la misma cuenta). Requiere habilitar ese repositorio y configurar el despliegue desde `pruebas`. No activar publicaciones de `pruebas` sobre el sitio Pages de `main`.

Requisitos técnicos de la copia de pruebas:
1. Nunca llevar el `CNAME` de producción a la raíz de publicación de la previsualización; `www.inmogl.com` pertenece exclusivamente a producción.
2. Añadir `noindex, nofollow` a todos los HTML de pruebas, no publicar sitemap de pruebas y verificar que los robots puedan leer la etiqueta `noindex`; un `Disallow` de `robots.txt` puede impedirlo. Ninguna de estas medidas constituye control de acceso.
3. Revisar y ajustar `canonical`, Open Graph, enlaces absolutos, rutas relativas, navegación y rutas de multimedia para que la prueba no redirija accidentalmente a producción.
4. Revisar el alcance del `service worker` (`sw.js`) y del manifest PWA, para impedir conflictos de caché, instalación o alcance con producción. Preferir no registrar el service worker en la vista de pruebas.
5. Validar cargas de fotos, planos, vídeos, fichas, vista móvil y escritorio; respetar límite de 1 GB del sitio Pages publicado.
6. Solo con aprobación expresa: integrar cambios aprobados en `main` y comprobar publicación.
7. Después de aprobar, retirar el despliegue de pruebas, incluida la URL. Pueden persistir copias en cachés externas, por lo que nunca tratar la URL como privada.

## Seguridad
Un enlace de GitHub Pages no es una contraseña: cualquier persona que lo conozca puede abrirlo mientras esté publicado. Repositorio público implica, además, código visible desde GitHub. No almacenar secretos ni pruebas con información privada.

## Regla de prioridad
Antes de reconfigurar GitHub Pages, tocar DNS, modificar `CNAME`, configurar Actions con permisos de escritura o crear una publicación de pruebas, confirmar que el método no interfiere con producción. Nunca presentar una URL como activa sin comprobarla.
