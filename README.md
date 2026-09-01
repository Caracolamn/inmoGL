# InmoGL 4.0

Sitio web estático de InmoGL Soluciones Inmobiliarias Lerma, preparado para
publicación mediante GitHub Pages y el dominio `www.inmogl.com`.

## Contenido publicado

- Portada, páginas corporativas y páginas de categorías.
- Cartera exclusivamente en venta: 27 fichas internas de inmuebles
  (20 viviendas, 2 locales/naves y 5 terrenos).
- La página de alquiler es únicamente informativa y de contacto; no publica
  anuncios, precios ni disponibilidad de alquileres.
- Fotografías, planos y vídeos organizados en `images/inmuebles/`.
- JavaScript de navegación, galerías y fichas.
- Inventario de inmuebles en `INMOGL_INVENTARIO_INMUEBLES.json`.
- Plantilla canónica y generador provisional de carteles en
  `automation/carteles/`.
- Reglas, arquitectura e histórico en `docs/`.

## Estado

La web y sus medios han sido incorporados y validados localmente antes de la
publicación. El archivo `CNAME` conserva el dominio de GitHub Pages.

## Automatizaciones pendientes

- Construir y activar la sincronización real de la cartera de venta con
  Idealista mediante los workflows de GitHub.
- Completar la exportación automática del cartel a PDF y su envío por correo.
- Cerrar permisos de Matterport/planos y las reglas SEO pendientes.

Estas automatizaciones pendientes no impiden el funcionamiento de la versión
estática publicada.
