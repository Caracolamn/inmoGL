# Aplicar la regla «solo venta»

Este parche sustituye y anula por completo cualquier parche anterior que
pretendiera incorporar alquileres.

## Qué cambia

- Declara que InmoGL publica únicamente inmuebles en venta.
- Excluye sin excepciones los alquileres de inventario, comparaciones, fichas,
  precios, medios y carteles.
- Mantiene `buscando_Alquiler_Lerma.html` como página informativa sin anuncios.
- Conserva intacto el inventario actual: 27 ventas.

## Aplicación en la copia local

1. Descomprimir este ZIP.
2. Copiar `README.md`, `INMOGL_BUILD.json` y la carpeta `docs` a la raíz del
   repositorio local `inmoGL`.
3. Aceptar la sustitución de los archivos existentes y conservar la estructura
   de carpetas.
4. Comprobar en GitHub Desktop que aparecen cinco archivos modificados y un
   archivo nuevo.
5. Usar como resumen del commit:
   `Fijar alcance de publicación exclusivamente en venta`
6. Hacer el commit en `main` y pulsar `Push origin`.

Este parche no modifica HTML, CSS, JavaScript, fichas, imágenes ni precios de
la web publicada.
