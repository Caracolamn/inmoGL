/* INMOGL · Actualización de cartera · 2026-09-27
   Mismo funcionamiento para ZIP manual y futuras publicaciones desde la API:
   - Cero precarga (no descarga toda la cartera ni sus multimedia).
   - Navegación y recursos propios: siempre consultar la red, sin guardar
     una copia HTML, CSS, JS, JSON, fotos o planos en Cache Storage.
   - URL técnica única por petición, sin renombrar archivos ni alterar los
     enlaces visibles; reduce la reutilización de versiones del CDN.
   - Vídeos y solicitudes Range: respetar los rangos sin cambiarles la URL,
     evitando interferir con reproducción y desplazamiento temporal.
   - Recursos de terceros sin interceptar. Sin versión offline obsoleta.
*/

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

let requestCounter = 0;

function uniqueFreshURL(url) {
  const fresh = new URL(url);
  fresh.searchParams.set('__inmogl_fresh', `${Date.now().toString(36)}-${(++requestCounter).toString(36)}`);
  return fresh.href;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;

  // Las navegaciones sirven el HTML remoto más reciente, incluidos los
  // listados y cualquier nueva ficha /inmuebles/<id>.html.
  if (request.mode === 'navigate') {
    const headers = new Headers(request.headers);
    headers.delete('if-none-match');
    headers.delete('if-modified-since');
    event.respondWith(fetch(uniqueFreshURL(request.url), {
      method: 'GET',
      mode: 'same-origin',
      credentials: request.credentials,
      headers,
      redirect: 'follow',
      cache: 'no-store'
    }));
    return;
  }

  // No modificar URL ni cabeceras Range de MP4/WebM/MOV: Safari y otros
  // navegadores necesitan las respuestas HTTP 206 para buscar en el vídeo.
  if (request.headers.has('range') || /\.(?:mp4|m4v|mov|webm)$/i.test(url.pathname)) {
    event.respondWith(fetch(request, { cache: 'no-store' }));
    return;
  }

  // CSS, JS, JSON, fotografías, planos, iconos y nuevos medios propios
  // obtienen URL técnica distinta en cada solicitud para evitar copias viejas.
  const freshRequest = new Request(uniqueFreshURL(request.url), request);
  event.respondWith(fetch(freshRequest, { cache: 'no-store' }));
});
