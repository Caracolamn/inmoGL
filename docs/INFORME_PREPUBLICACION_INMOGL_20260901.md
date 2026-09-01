# Informe de prepublicación — Web y automatización InmoGL

**Fecha de revisión:** 1 de septiembre de 2026  
**Paquetes comparados:** `inmoGL-main(5).zip` y `WEB_INMO_PROVISIONAL_20260829_DEPURACION(8).zip`

## Dictamen

**No subir todavía el ZIP provisional como versión definitiva.**

La interfaz web, las fichas y sus JavaScript están coherentes, pero el paquete mínimo no incluye la capa de automatización prevista para GitHub y omite deliberadamente los medios de los inmuebles. Si se publica tal cual, las fichas y los listados mostrarán enlaces rotos de fotografías y vídeos.

## Qué está correcto

- **Inventario coherente** — El manifiesto, las fichas y los listados contienen los mismos 27 inmuebles: 20 viviendas, 2 locales/naves y 5 terrenos.
- **Enlaces internos correctos** — Los inmuebles de los tres listados enlazan a sus fichas internas correspondientes.
- **JavaScript válido** — `JS/script.js` y `JS/inmo_detail.js` pasan la comprobación sintáctica.
- **Ficha interactiva implantada** — Galería automática, controles, teclado y gesto táctil, visor ampliado, comparación, planos y tratamiento de vídeo están presentes.
- **HTML estructuralmente válido** — No se detectaron identificadores duplicados, imágenes sin texto alternativo, anclas internas rotas ni recursos básicos compartidos ausentes.
- **Filtros y ordenación implantados** — La lógica de localidades, precios y prioridad de Lerma está presente en `JS/script.js`.
- **Maqueta ligera útil** — El ZIP provisional sirve para revisar estructura y código sin transportar más de 400 MB de medios.

## Bloqueos antes de publicar

- **Medios no incluidos** — Se detectaron 825 referencias locales ausentes: 798 referencias WebP y 27 referencias MP4. Son 808 rutas únicas.
- **Los listados también dependen de esos medios** — Sus miniaturas apuntan a `images/inmuebles/...`; por tanto, no solo fallan las galerías de detalle.
- **Sin sincronizador** — No existe código que consulte Idealista, actualice la cartera ni descargue fotografías, planos o vídeos.
- **Manifiesto insuficiente para descargar** — `PROVISIONAL_MANIFEST.json` contiene la URL pública del inmueble y rutas locales, pero no las URL remotas directas de los medios.
- **Sin GitHub Actions** — No existe `.github/workflows/`; los relojes acordados no están activos.
- **Sin carteles automáticos** — No existe `automation/carteles/`, ni generador Scribus, ni exportación PDF ni envío por correo dentro de estos ZIP.
- **Datos con fecha anterior** — El provisional declara una sincronización del 28 de agosto de 2026; requiere una sincronización real inmediatamente antes de publicarse.

## Reglas presentes en el código web

- **Ficha propia por inmueble** — Implantada.
- **Listado enlazado a la ficha interna** — Implantada.
- **Galería, comparación, planos, vídeo y mapa** — Implantados en la interfaz.
- **Filtros de localidad y ordenación** — Implantados.
- **Año del pie automático** — Implantado.

## Reglas aprobadas pero aún no integradas en este repositorio

- **Tres automatizaciones separadas** — Sincronización ligera a las 03:17, revisión técnica a las 03:47 y SEO a las 04:17, en zona `Europe/Madrid`.
- **Maestro Scribus inmutable** — El generador solo puede sustituir los campos variables; no puede alterar geometría, estilos, capas, bloqueos ni elementos fijos.
- **Fotos de cartel** — Usar las dos primeras fotos, llenar proporcionalmente el marco, sin deformación ni bandas y con recorte centrado.
- **Resumen del cartel** — “Resumen breve, factual y redactado; priorizar lo esencial y omitir lo secundario antes de permitir desbordamiento”.
- **Salida del cartel** — Generar `.sla` y PDF y entregar el PDF por correo, sin intervención manual intermedia.

La plantilla Scribus canónica existe en un paquete separado, pero todavía no forma parte de la estructura web/GitHub revisada.

## Decisiones o datos todavía pendientes

- **Origen técnico de la sincronización** — Confirmar si ya existe otro ZIP con el sincronizador y los workflows; si no existe, hay que construirlos.
- **Acceso a Idealista** — Definir el método autorizado y estable para obtener datos y URL de medios. El HTML actual no resuelve por sí solo esta descarga.
- **Vídeo de 37 MB** — Puede gestionarse mediante Git/Actions porque no supera 100 MB por archivo, pero debe vigilarse el límite total de GitHub Pages y evitar su historial repetido.
- **Matterport/360 y planos** — Falta cerrar permisos y política de publicación.
- **Correo de carteles** — Faltan destinatario, credenciales seguras y política de reintentos/errores.
- **Reglas SEO canónicas** — No se adjuntó el documento canónico completo de reglas; deben integrarse junto con `robots.txt`, `sitemap.xml`, etiquetas canonical y datos estructurados si así lo establece.

## Correcciones menores recomendadas

- Añadir `rel="noopener"` a 22 enlaces que abren una pestaña nueva.
- Dar a `contacto.html` una metadescripción distinta de la portada.
- Ejecutar una revisión visual completa cuando estén presentes todos los medios.

## Contradicción documental que debe corregirse

Dos documentos del provisional asignan el SEO completo a las 03:17. Deben quedar así:

- **03:17** — Sincronización ligera de cartera y medios.
- **03:47** — Comprobación técnica ligera.
- **04:17** — Revisión SEO.

También debe eliminarse de cualquier regla anterior la idea de aceptar el desbordamiento del resumen como comportamiento ordinario. La regla vigente es priorizar y omitir información secundaria para que el texto encaje.

## Nombres definitivos propuestos

No conviene aplicar todavía la palabra **definitivo** al ZIP actual. Tras integrar automatización, medios y reglas, la nomenclatura propuesta es:

| Elemento actual | Nombre de producción propuesto |
|---|---|
| Repositorio/carpeta `inmoGL-main` | `inmoGL` |
| `PROVISIONAL_MANIFEST.json` | `INMOGL_INVENTARIO_INMUEBLES.json` |
| `PROVISIONAL_BUILD.json` | `INMOGL_BUILD.json` |
| ZIP web completo | `INMOGL_WEB_PUBLICACION_YYYYMMDD.zip` |
| ZIP mínimo de actualización | `INMOGL_ACTUALIZACION_MINIMA_YYYYMMDD.zip` |
| ZIP de respaldo integral | `INMOGL_BACKUP_CANONICO_YYYYMMDD.zip` |
| Plantilla Scribus | `INMOGL_CARTEL_VIVIENDAS_A4_HORIZONTAL_CANONICA.sla` |

Los documentos `CAMBIOS_PROVISIONAL_*`, `README_PROVISIONAL.md` y el historial de pruebas deben conservarse en `docs/historico/`, no mezclados con la raíz pública.

## Estructura que falta para cerrar la versión

```text
inmoGL/
├── .github/workflows/
│   ├── sincronizacion-inmuebles.yml
│   ├── comprobacion-tecnica.yml
│   └── revision-seo.yml
├── automation/
│   ├── sync/
│   └── carteles/
│       ├── plantillas/
│       └── generador/
├── docs/
│   ├── reglas/
│   └── historico/
├── images/inmuebles/
├── inmuebles/
└── web estática actual
```

## Secuencia necesaria

1. Recuperar o construir el sincronizador y los tres workflows.
2. Integrar la plantilla canónica y el generador de carteles.
3. Corregir documentos y elevar las reglas aprobadas al documento canónico.
4. Ejecutar la sincronización real y descargar todos los medios.
5. Probar el inmueble 107727313, validar `.sla`, PDF y correo.
6. Realizar la revisión visual y SEO final.
7. Solo entonces renombrar y generar los tres ZIP de producción.
