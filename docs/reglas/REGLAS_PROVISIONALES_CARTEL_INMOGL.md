# Reglas provisionales aprobadas — cartel InmoGL

Estas reglas están aprobadas para la prueba real del inmueble `107727313`. Su integración definitiva en GitHub y en la automatización se realizará después de validar visualmente el resultado en Scribus.

- **Maestro visual inmutable** — Cada cartel se genera desde una copia de la última plantilla `.sla` aprobada.
- **Campos autorizados** — Solo reciben datos `TIPO_INMUEBLE`, `DIRECCION`, `LOCALIDAD`, `RESUMEN_INMUEBLE`, `HABITACIONES`, `BANOS`, `M2_CONSTRUIDOS`, `PRECIO`, `FOTO_01` y `FOTO_02`.
- **Diseño protegido** — El generador no cambia posiciones, dimensiones, rotaciones, tipografías, tamaños, estilos, capas, bloqueos, maestro ni estructura.
- **Bloqueos conservados** — Los dos candados pueden permanecer activos: protegen la edición manual y no impiden que el generador escriba los datos en el `.sla`.
- **Fotografías** — En producción se usarán las dos primeras fotografías disponibles en su orden original, sin deformación ni bandas y con recorte proporcional centrado para llenar cada marco. Esta prueba ligera usa las dos fotos suministradas (`foto-001` y `foto-006`).
- **Resumen breve** — Resumen factual y redactado; priorizar lo esencial y omitir lo secundario antes de permitir desbordamiento.
- **Tipografía estable** — No se reduce automáticamente el tamaño de letra para hacer caber texto.
- **Web separada** — Esta prueba no modifica `JS/inmo_detail.js` ni la presentación de la ficha web.
- **Validación previa** — La automatización completa, el PDF y el envío por correo se consolidarán después de aprobar esta prueba visual.
