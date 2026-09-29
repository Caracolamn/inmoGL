# Regla Open Graph para compartir InmoGL

## Alcance permanente

- `og-inmoGL.png` se conserva en la raíz del repositorio como imagen corporativa común para compartir enlaces.
- Las páginas estables deben mantener sus metadatos Open Graph y Twitter Card dentro de `<head>`.
- La descripción corporativa no debe mencionar alquileres:
  `InmoGL, inmobiliaria en Lerma: venta y tasación de viviendas, locales y terrenos en Lerma y la comarca del Arlanza. Más de 20 años de experiencia.`
- `google6fc92c3e5cc08d2b.html` queda excluido porque es un archivo técnico de verificación.

## Fichas variables de inmuebles

Cada ejecución de `ACTUALIZA LA WEB` debe insertar los metadatos al generar cada nueva ficha `inmuebles/<ID>.html`:

- `og:title`: título concreto del inmueble.
- `og:type`: `website`.
- `og:site_name`: `InmoGL`.
- `og:description`: descripción corporativa aprobada.
- `og:url`: URL absoluta de la ficha generada.
- `og:image` y `og:image:secure_url`: `https://www.inmogl.com/og-inmoGL.png?v=20260929`.
- Dimensiones declaradas de la imagen: `1200 × 630`, formato `image/png`.
- Twitter Card equivalente con `summary_large_image`.

La inserción debe realizarse en el HTML estático generado. No se delegará en JavaScript, porque los sistemas de vista previa deben encontrar estos datos en el HTML inicial.

Cuando un inmueble desaparezca de la cartera, se elimina su ficha completa siguiendo el flujo habitual. Sus metadatos desaparecen con ella y no requieren una limpieza independiente.

Esta regla no añade alquileres al inventario y queda subordinada a la regla canónica «solo venta».
