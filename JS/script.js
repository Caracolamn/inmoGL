document.addEventListener('DOMContentLoaded', () => {
  // BOTONES FLOTANTES INMOGL: iconos proporcionados por usuario, SVG incrustados.
  // Esta capa es autosuficiente: NO sustituye styles.css ni altera los HTML.
  if (!document.getElementById('inmogl-floating-buttons-style')) {
    const style = document.createElement('style');
    style.id = 'inmogl-floating-buttons-style';
    style.textContent = `
/* Exclusivamente botones flotantes. No cambia la estructura de página. */
#whatsapp.desktop .inmogl-wa-disc {
  position:relative; display:flex; align-items:center; justify-content:center;
  box-sizing:border-box; flex:0 0 50px; width:50px; height:50px;
  border-radius:50%; overflow:hidden; color:#fff;
  background:radial-gradient(circle at 34% 18%, #75efa0 0%, #32da70 27%, #25d366 53%, #15984d 80%, #086333 100%);
  box-shadow:inset 0 2px 4px rgba(255,255,255,.25), inset 0 -5px 8px rgba(0,0,0,.28), 0 9px 20px rgba(0,0,0,.32);
  filter:none; transition:transform .18s ease,box-shadow .18s ease;
}
#whatsapp.desktop .inmogl-wa-disc::before,
#whatsapp-m.mobile::before, #phone-m.mobile::before {
  content:""; position:absolute; top:5px; left:8px; right:8px;
  height:17px; border-radius:50%; pointer-events:none;
  background:linear-gradient(180deg,rgba(255,255,255,.34),rgba(255,255,255,0));
}
/* Mantiene el aumento de 50 a 56 px del hover original, sin mover su anclaje. */
#whatsapp.desktop:hover .inmogl-wa-disc { transform:scale(1.12); }
#whatsapp.desktop .inmogl-wa-disc svg { display:block; width:32px; height:32px; padding:0; margin:0; }
@media only screen and (max-width:768px) {
  /* Prevent an offscreen horizontal pan in mobile emulation. */
  html, body { max-width:100%; overflow-x:clip!important; }
  #whatsapp.desktop { display:none!important; }
  #whatsapp-m.mobile, #phone-m.mobile {
    display:flex!important; position:fixed!important;
    box-sizing:border-box!important; flex:none!important;
    right:16px!important; margin:0!important; padding:0!important;
    width:52px!important; height:52px!important;
    min-width:52px!important; min-height:52px!important;
    border:0!important; border-radius:50%!important;
    align-items:center!important; justify-content:center!important;
    z-index:10!important; overflow:hidden!important;
    box-shadow:inset 0 2px 4px rgba(255,255,255,.25), inset 0 -5px 8px rgba(0,0,0,.28), 0 9px 20px rgba(0,0,0,.36)!important;
    filter:none!important; animation:none!important;
  }
  /* Centro visual del WhatsApp original restaurado (44px del pie, con su margen). */
  #whatsapp-m.mobile { bottom:9px!important; right:20px!important; color:#fff!important;
    background:radial-gradient(circle at 34% 18%, #75efa0 0%, #32da70 27%, #25d366 53%, #15984d 80%, #086333 100%)!important;
  }
  /* Mismo margen derecho; 15px libres entre ambos círculos de 52px.
     Teléfono: MISMA receta visual que WhatsApp, sustituyendo el verde por azul corporativo. */
  #phone-m.mobile { bottom:76px!important; right:20px!important; color:#fff!important;
    background:radial-gradient(circle at 34% 18%, #8fd4ff 0%, #56b7ff 27%, #3399ff 53%, #1c70bf 80%, #0a416f 100%)!important;
  }

  /* Venta: misma familia visual 3D que WhatsApp/teléfono.
     Se conservan tamaño, posición y el anillo exterior rojo ya existente. */
  header .stage.mobile .icon {
    background:radial-gradient(circle at 34% 18%, #8fd4ff 0%, #56b7ff 27%, #3399ff 53%, #1c70bf 80%, #0a416f 100%)!important;
    box-shadow:inset 0 2px 4px rgba(255,255,255,.25), inset 0 -5px 8px rgba(0,0,0,.28), 0 9px 20px rgba(0,0,0,.36)!important;
    filter:none!important;
    overflow:visible!important;
  }
  header .stage.mobile .icon > a {
    position:relative!important; overflow:hidden!important; border-radius:50%!important;
  }
  header .stage.mobile .icon > a::before {
    content:""!important; position:absolute!important; top:5px!important; left:8px!important; right:8px!important;
    width:auto!important; height:17px!important; border-radius:50%!important; pointer-events:none!important;
    background:linear-gradient(180deg,rgba(255,255,255,.34),rgba(255,255,255,0))!important;
    transform:none!important; z-index:1!important;
  }
  header .stage.mobile #sale-icon { position:relative!important; z-index:2!important; }

  #whatsapp-m.mobile svg, #phone-m.mobile svg {
    display:block!important; width:32px!important; height:32px!important;
    padding:0!important; margin:0!important; max-width:32px!important;
    max-height:32px!important; flex:none!important; filter:none!important;
  }
  #phone-m.mobile svg { transform-origin:center center; transform-box:fill-box; }
  #whatsapp-m.mobile svg { animation:none!important; transition:none!important; }
}
@media only screen and (max-width:768px) and (prefers-reduced-motion:no-preference) {
  #phone-m.mobile svg { animation:inmogl-phone-ring 6.2s linear infinite!important; }
}
@media only screen and (max-width:768px) and (prefers-reduced-motion:reduce) {
  #phone-m.mobile svg { animation:none!important; }
}
@keyframes inmogl-phone-ring {
  /* Mantiene los tiempos absolutos de las dos ráfagas de Caracoles.
     Solo se reduce de 7.2 s a 6.2 s la pausa final. */
  0%,3.484%,19.742%,23.226%,39.484%,100% { transform:rotate(0deg); }
  5.806%,10.452%,25.548%,30.194% { transform:rotate(-13deg); }
  8.129%,12.774%,27.871%,32.516% { transform:rotate(13deg); }
  15.097%,34.839% { transform:rotate(-10deg); }
  17.419%,37.161% { transform:rotate(10deg); }
}
`;
    document.head.appendChild(style);
  }
  const floatingSvg = {
    phone: `<svg class="inmogl-inline-icon inmogl-inline-icon--phone" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 31.45176 29.272304" width="32" height="32" aria-hidden="true" focusable="false"><g transform="translate(-41.961024,-37.099009)"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M 65.826,66.355 C 59.758,66.139 50.09,61.348 43.469,49.846 c -2.351,-4.087 -2.012,-8.749 1.433,-11.95 1.164,-1.086 2.624,-0.822 3.992,-0.589 0.336,0.051 0.686,0.564 0.855,0.945 0.882,2.007 1.751,4.014 2.518,6.071 0.406,1.085 -0.341,2.106 -1.911,3.915 -0.502,0.57 -0.604,1.102 -0.213,1.765 2.547,4.311 6.106,7.43 10.787,9.262 0.688,0.265 1.201,0.1 1.638,-0.439 2.481,-3.027 2.734,-3.914 4.039,-3.293 6.279,3.001 6.77,3.126 6.799,3.839 0.213,5.291 -4.639,7.199 -7.58,6.983 z"/></g></svg>`,
    whatsapp: `<svg class="inmogl-inline-icon inmogl-inline-icon--whatsapp" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.342874 62.674373" width="32" height="32" aria-hidden="true" focusable="false"><g transform="translate(-26.455,-20.357629)"><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="m 26.455,83.032 c 0.35,-1.353 0.656,-2.529 0.972,-3.708 1.031,-3.764 2.089,-7.521 3.067,-11.294 0.142,-0.564 0.082,-1.311 -0.186,-1.816 -9.563,-18.228 0.306,-40.292 20.373,-45.002 18.224,-4.271 34.608,8.028 37.599,24.479 3.111,17.156 -8.112,33.458 -25.134,36.436 -6.766,1.169 -13.235,0.175 -19.412,-2.828 -0.55,-0.273 -1.327,-0.348 -1.912,-0.207 -8.231,2.064 -13.707,3.615 -15.367,3.94 z m 7.24,-7.14 c 3.096,-0.805 5.949,-1.518 8.774,-2.315 0.8,-0.215 1.416,-0.099 2.122,0.309 5.351,3.084 11.085,4.236 17.213,3.249 C 75.913,74.873 85.578,61.67 83.42,47.616 81.179,33.045 67.519,23.269 53.083,25.916 35.62,29.123 26.35,48.593 35.034,64.009 c 0.962,1.708 1.227,3.117 0.58,4.934 -0.772,2.187 -1.249,4.469 -1.919,6.949 z"/><path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M 65.826,66.355 C 59.758,66.139 50.09,61.348 43.469,49.846 c -2.351,-4.087 -2.012,-8.749 1.433,-11.95 1.164,-1.086 2.624,-0.822 3.992,-0.589 0.336,0.051 0.686,0.564 0.855,0.945 0.882,2.007 1.751,4.014 2.518,6.071 0.406,1.085 -0.341,2.106 -1.911,3.915 -0.502,0.57 -0.604,1.102 -0.213,1.765 2.547,4.311 6.106,7.43 10.787,9.262 0.688,0.265 1.201,0.1 1.638,-0.439 2.481,-3.027 2.734,-3.914 4.039,-3.293 6.279,3.001 6.77,3.126 6.799,3.839 0.213,5.291 -4.639,7.199 -7.58,6.983 z"/></g></svg>`
  };
  // Preservar la caja, posición y padding original del botón desktop.
  const desktopWa = document.getElementById('whatsapp');
  if (desktopWa && !desktopWa.querySelector('.inmogl-wa-disc')) {
    desktopWa.innerHTML = `<span class="inmogl-wa-disc">${floatingSvg.whatsapp}</span>`;
    desktopWa.setAttribute('aria-label','Abrir WhatsApp');
  }
  // Solo se reemplazan los iconos internos; botones, URL y anclajes permanecen.
  for (const [id, svg] of [['whatsapp-m',floatingSvg.whatsapp],['phone-m',floatingSvg.phone]]) {
    const button = document.getElementById(id);
    if (button && !button.querySelector('.inmogl-inline-icon')) button.innerHTML = svg;
  }

  const updateYear = () => {
    const now = new Date();
    document.querySelectorAll('[data-current-year]').forEach(element => {
      element.textContent = String(now.getFullYear());
    });
    const nextYear = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 25);
    window.setTimeout(updateYear, Math.min(nextYear.getTime() - now.getTime(), 2147483647));
  };
  updateYear();

  const menuBtn = document.getElementById('hamburger-btn');
  const menu = document.getElementById('menu');

  if (menuBtn && menu) {
    menuBtn.addEventListener('click', () => {
      menu.classList.toggle('open');
      menuBtn.classList.toggle('active');
    });
  }

  const locationSelect = document.getElementById('location-select');
  const propertyFiles = Array.from(document.querySelectorAll('.box'));

  if (locationSelect && propertyFiles.length) {
    const applyLocationFilter = () => {
      const selectedLocation = locationSelect.value;

      propertyFiles.forEach(propertyFile => {
        const locationElement = propertyFile.querySelector('.ubicacion h3');
        if (!locationElement) return;

        const location = locationElement.textContent.trim();
        propertyFile.style.display = (selectedLocation === '' || selectedLocation === location)
          ? 'block'
          : 'none';
      });
    };

    locationSelect.addEventListener('change', applyLocationFilter);

    const resetLocationFilter = () => {
      locationSelect.selectedIndex = 0;
      applyLocationFilter();
    };

    resetLocationFilter();
    window.addEventListener('pageshow', resetLocationFilter);
  }

  const propertyContainer = document.querySelector('.container');
  if (propertyContainer) {
    const currentPage = window.location.pathname.split('/').pop();
    const locationOrderedPages = new Set([
      'buscando_Local_Lerma.html',
      'buscando_Terreno_Lerma.html'
    ]);
    const orderByLocation = locationOrderedPages.has(currentPage);
    const locationCollator = new Intl.Collator('es', { sensitivity: 'base' });
    const pricedBoxes = Array.from(propertyContainer.querySelectorAll('.box'))
      .filter(box => box.querySelector('.moneda'));

    pricedBoxes
      .map((box, originalIndex) => ({
        box,
        originalIndex,
        price: Number(box.querySelector('.moneda').textContent.replace(/\D/g, '')),
        location: box.querySelector('.ubicacion h3')?.textContent.trim() || ''
      }))
      .sort((a, b) => {
        if (orderByLocation) {
          const aIsLerma = locationCollator.compare(a.location, 'Lerma') === 0;
          const bIsLerma = locationCollator.compare(b.location, 'Lerma') === 0;

          if (aIsLerma !== bIsLerma) return aIsLerma ? -1 : 1;

          const locationOrder = locationCollator.compare(a.location, b.location);
          if (locationOrder !== 0) return locationOrder;
        }

        return (a.price - b.price) || (a.originalIndex - b.originalIndex);
      })
      .forEach(({ box }) => propertyContainer.appendChild(box));
  }
});

/* INMOGL · Frescura de publicación: cobertura común para listados y fichas.
   Funciona sin pasos adicionales tanto en publicaciones manuales como futuras
   publicaciones automáticas. No instala cachés de contenido ni hace precarga. */
(function registerInmoglFreshness() {
  if (!('serviceWorker' in navigator) || !/^https?:$/.test(location.protocol)) return;
  const sharedScript = document.currentScript;
  const siteRoot = new URL('../', sharedScript ? sharedScript.src : location.href);
  const worker = new URL('sw.js', siteRoot);
  navigator.serviceWorker.register(worker.href, {
    scope: siteRoot.pathname,
    updateViaCache: 'none'
  }).catch(error => {
    console.warn('INMOGL: no se ha podido activar la actualización de caché', error);
  });
})();
