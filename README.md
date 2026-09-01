# InmoGL — candidata de prepublicación sin medios

Sitio web estático de InmoGL Soluciones Inmobiliarias Lerma.

## Estado

Esta carpeta es una **candidata de prepublicación**. Contiene la nueva web, sus
27 fichas internas, el JavaScript revisado y la plantilla/generador provisional
de carteles Scribus. No contiene la carpeta pesada de medios inmobiliarios y no
debe fusionarse todavía con `main`.

## Añadir los medios en Windows

1. Descomprimir este ZIP en una carpeta nueva.
2. Descomprimir el paquete completo de más de 400 MB en otra carpeta.
3. Copiar únicamente el contenido de `images/inmuebles/` del paquete completo.
4. Pegarlo en `images/inmuebles/` de esta candidata.
5. Conservar el resto de archivos de esta candidata cuando Windows pregunte.

No hay que sustituir la candidata completa por el ZIP antiguo ni copiar todavía
el resultado sobre el repositorio local de GitHub Desktop.

## Componentes

- Web estática y fichas internas: raíz, `JS/`, `styles/` e `inmuebles/`.
- Inventario: `INMOGL_INVENTARIO_INMUEBLES.json`.
- Estado de compilación: `INMOGL_BUILD.json`.
- Carteles: `automation/carteles/`.
- Arquitectura, reglas e informes: `docs/`.
- Dominio de GitHub Pages conservado: `CNAME` con `www.inmogl.com`.

## Pendiente antes de publicar

- Añadir y validar todos los medios.
- Ejecutar una prueba visual local completa.
- Construir la sincronización real de Idealista y los workflows de GitHub.
- Completar la exportación PDF y el envío de carteles por correo.
- Cerrar permisos de Matterport/planos y reglas SEO.
