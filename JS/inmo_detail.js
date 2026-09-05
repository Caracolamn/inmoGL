(function(){
  'use strict';

  const SLIDE_DELAY = 5000;

  function initSlider(slider){
    if(!slider || slider.dataset.sliderReady === '1') return;
    slider.dataset.sliderReady = '1';
    const track = slider.querySelector('.slider-track');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const previous = slider.querySelector('.slider-btn.prev');
    const next = slider.querySelector('.slider-btn.next');
    const play = slider.querySelector('.slider-play');
    const status = slider.querySelector('.slider-status');
    if(!track || !slides.length) return;

    let index = 0;
    let automatic = slides.length > 1;
    let timer = null;

    function announce(){
      if(status) status.textContent = `${index + 1} / ${slides.length}`;
    }
    function show(position){
      index = (position + slides.length) % slides.length;
      slider.dataset.currentIndex = String(index);
      track.style.transform = `translateX(-${index * 100}%)`;
      slides.forEach((slide, slideIndex) => slide.setAttribute('aria-hidden', slideIndex === index ? 'false' : 'true'));
      announce();
    }
    function stopAutomatic(){
      automatic = false;
      window.clearTimeout(timer);
      timer = null;
      slider.dataset.playing = 'false';
    }
    function schedule(delay = SLIDE_DELAY){
      window.clearTimeout(timer);
      if(!automatic || slides.length <= 1) return;
      slider.dataset.playing = 'true';
      timer = window.setTimeout(() => {
        show(index + 1);
        schedule(SLIDE_DELAY);
      }, delay);
    }
    function manualStep(step){
      stopAutomatic();
      show(index + step);
    }

    previous?.addEventListener('click', () => manualStep(-1));
    next?.addEventListener('click', () => manualStep(1));
    play?.addEventListener('click', () => {
      automatic = true;
      schedule(SLIDE_DELAY);
    });
    slider.addEventListener('keydown', event => {
      if(event.key === 'ArrowLeft'){
        event.preventDefault();
        manualStep(-1);
      }
      if(event.key === 'ArrowRight'){
        event.preventDefault();
        manualStep(1);
      }
    });
    slider.addEventListener('inmogl:photo-index', event => {
      const position = Number(event.detail?.index);
      if(Number.isFinite(position)){
        stopAutomatic();
        show(position);
      }
    });

    let startX = null;
    slider.addEventListener('touchstart', event => {
      startX = event.touches[0].clientX;
    }, {passive:true});
    slider.addEventListener('touchend', event => {
      if(startX === null) return;
      const movement = event.changedTouches[0].clientX - startX;
      if(Math.abs(movement) > 45) manualStep(movement < 0 ? 1 : -1);
      startX = null;
    }, {passive:true});

    document.addEventListener('visibilitychange', () => {
      if(document.hidden) window.clearTimeout(timer);
      else if(automatic) schedule(SLIDE_DELAY);
    });

    if(slides.length <= 1) slider.classList.add('single');
    show(0);
    schedule(SLIDE_DELAY);
  }

  function fullscreenIcon(expanded){
    if(expanded){
      return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 3v6H3M15 3v6h6M9 21v-6H3M15 21v-6h6"/></svg>';
    }
    return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 3H3v5M16 3h5v5M8 21H3v-5M16 21h5v-5"/></svg>';
  }

  function initPhotoViewer(slider){
    if(!slider || slider.dataset.photoViewerReady === '1') return;
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const sources = slides.map(slide => {
      const photo = slide.querySelector('img');
      return {src:photo?.currentSrc || photo?.src || '', alt:photo?.alt || 'Fotografía del inmueble'};
    }).filter(photo => photo.src);
    if(!sources.length) return;
    slider.dataset.photoViewerReady = '1';

    const openButton = document.createElement('button');
    openButton.type = 'button';
    openButton.className = 'photo-fullscreen-open';
    openButton.setAttribute('aria-label', 'Ampliar fotografías a pantalla completa');
    openButton.title = 'Pantalla completa';
    openButton.innerHTML = fullscreenIcon(false);
    slider.appendChild(openButton);

    const viewer = document.createElement('div');
    viewer.className = 'photo-viewer';
    viewer.hidden = true;
    viewer.setAttribute('aria-hidden', 'true');
    viewer.setAttribute('role', 'dialog');
    viewer.setAttribute('aria-label', 'Fotografías del inmueble a pantalla completa');
    viewer.tabIndex = -1;
    viewer.innerHTML = `
      <button type="button" class="photo-viewer-nav photo-viewer-prev" aria-label="Fotografía anterior">&#8249;</button>
      <figure class="photo-viewer-figure">
        <img class="photo-viewer-image" alt="">
      </figure>
      <button type="button" class="photo-viewer-nav photo-viewer-next" aria-label="Fotografía siguiente">&#8250;</button>
      <span class="photo-viewer-status" aria-live="polite"></span>
      <button type="button" class="photo-fullscreen-close" aria-label="Cerrar pantalla completa y volver a la ficha" title="Volver a la ficha">${fullscreenIcon(true)}</button>`;
    document.body.appendChild(viewer);

    const image = viewer.querySelector('.photo-viewer-image');
    const status = viewer.querySelector('.photo-viewer-status');
    const closeButton = viewer.querySelector('.photo-fullscreen-close');
    const previous = viewer.querySelector('.photo-viewer-prev');
    const next = viewer.querySelector('.photo-viewer-next');
    let index = 0;
    let open = false;

    function updateImageOrientation(){
      const portrait = image.naturalHeight > image.naturalWidth;
      image.classList.toggle('is-portrait', portrait);
    }

    image.addEventListener('load', updateImageOrientation);
    image.addEventListener('error', () => image.classList.remove('is-portrait'));

    function show(position){
      index = (position + sources.length) % sources.length;
      image.classList.remove('is-portrait');
      image.src = sources[index].src;
      image.alt = sources[index].alt;
      if(image.complete && image.naturalWidth) updateImageOrientation();
      status.textContent = `${index + 1} / ${sources.length}`;
    }
    function syncSecondLayer(){
      slider.dispatchEvent(new CustomEvent('inmogl:photo-index', {detail:{index}}));
    }
    async function dismiss(){
      if(!open) return;
      open = false;
      if(document.fullscreenElement === viewer){
        try{ await document.exitFullscreen(); }catch(error){}
      }
      viewer.hidden = true;
      viewer.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('photo-viewer-open');
      syncSecondLayer();
      openButton.focus();
    }
    async function launch(){
      index = Number(slider.dataset.currentIndex) || 0;
      show(index);
      open = true;
      viewer.hidden = false;
      viewer.setAttribute('aria-hidden', 'false');
      document.body.classList.add('photo-viewer-open');
      viewer.focus();
      if(viewer.requestFullscreen){
        try{ await viewer.requestFullscreen(); }catch(error){}
      }
    }

    openButton.addEventListener('click', launch);
    closeButton.addEventListener('click', dismiss);
    previous.addEventListener('click', () => show(index - 1));
    next.addEventListener('click', () => show(index + 1));
    viewer.addEventListener('keydown', event => {
      if(event.key === 'Escape') dismiss();
      if(event.key === 'ArrowLeft') show(index - 1);
      if(event.key === 'ArrowRight') show(index + 1);
    });
    viewer.addEventListener('click', event => {
      if(event.target === viewer) dismiss();
    });
    document.addEventListener('fullscreenchange', () => {
      if(open && document.fullscreenElement !== viewer) dismiss();
    });

    let startX = null;
    viewer.addEventListener('touchstart', event => {
      startX = event.touches[0].clientX;
    }, {passive:true});
    viewer.addEventListener('touchend', event => {
      if(startX === null) return;
      const movement = event.changedTouches[0].clientX - startX;
      if(Math.abs(movement) > 45) show(index + (movement < 0 ? 1 : -1));
      startX = null;
    }, {passive:true});

    if(sources.length <= 1){
      previous.hidden = true;
      next.hidden = true;
    }
  }

  function initCompare(box){
    if(!box || box.dataset.compareReady === '1') return;
    box.dataset.compareReady = '1';
    const range = box.querySelector('.compare-range');
    const after = box.querySelector('.compare-after');
    const line = box.querySelector('.compare-line');
    const handle = box.querySelector('.compare-handle');
    if(!range || !after || !line || !handle) return;
    const update = () => {
      const value = Number(range.value);
      after.style.clipPath = `inset(0 0 0 ${value}%)`;
      line.style.left = `${value}%`;
      handle.style.left = `${value}%`;
    };
    range.addEventListener('input', update);
    update();
  }

  function syncDesktopTooltips(){
    const desktopHover = window.matchMedia('(hover: hover) and (pointer: fine)');
    const labels = {planos:'PLANOS',ambientacion:'AMBIENTE',video:'VIDEOS',eficiencia:'EFIC. ENERGÉTICA'};
    document.querySelectorAll('.media-shortcut').forEach(link => {
      const target = (link.getAttribute('href') || '').replace(/^#/, '');
      const tooltip = labels[target];
      if(desktopHover.matches && tooltip) link.setAttribute('title', tooltip);
      else link.removeAttribute('title');
    });
  }

  function initPlanViewer(section){
    const buttons = Array.from(section.querySelectorAll('.plan-open'));
    const lightbox = section.querySelector('[data-plan-lightbox]');
    if(!buttons.length || !lightbox) return;
    const image = lightbox.querySelector('.plan-lightbox-image');
    const status = lightbox.querySelector('.plan-lightbox-status');
    const close = lightbox.querySelector('.plan-lightbox-close');
    const previous = lightbox.querySelector('.plan-lightbox-prev');
    const next = lightbox.querySelector('.plan-lightbox-next');
    const sources = buttons.map(button => {
      const plan = button.querySelector('img');
      return {src:plan?.currentSrc || plan?.src || '', alt:plan?.alt || 'Plano ampliado'};
    });
    let index = 0;
    let returnFocus = null;

    function show(position){
      index = (position + sources.length) % sources.length;
      if(image){
        image.src = sources[index].src;
        image.alt = sources[index].alt.replace('del inmueble', 'ampliado');
      }
      if(status) status.textContent = `${index + 1} / ${sources.length}`;
    }
    function open(position, trigger){
      returnFocus = trigger;
      show(position);
      lightbox.hidden = false;
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.classList.add('plan-viewer-open');
      close?.focus();
    }
    function dismiss(){
      lightbox.hidden = true;
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('plan-viewer-open');
      returnFocus?.focus();
    }
    buttons.forEach((button, buttonIndex) => button.addEventListener('click', () => open(buttonIndex, button)));
    close?.addEventListener('click', dismiss);
    previous?.addEventListener('click', () => show(index - 1));
    next?.addEventListener('click', () => show(index + 1));
    lightbox.addEventListener('click', event => {
      if(event.target === lightbox) dismiss();
    });
    lightbox.addEventListener('keydown', event => {
      if(event.key === 'Escape') dismiss();
      if(event.key === 'ArrowLeft') show(index - 1);
      if(event.key === 'ArrowRight') show(index + 1);
    });
  }

  function initVideoMosaic(shell){
    const videos = Array.from(shell.querySelectorAll('.property-video'));
    if(!videos.length) return;
    const narrow = () => window.matchMedia('(max-width: 640px)').matches;

    function resizeItem(video){
      if(narrow()){
        video.style.gridRowEnd = 'auto';
        return;
      }
      const shellStyle = getComputedStyle(shell);
      const row = parseFloat(shellStyle.gridAutoRows) || 8;
      const gap = parseFloat(shellStyle.rowGap) || 16;
      const span = Math.max(1, Math.ceil((video.getBoundingClientRect().height + gap) / (row + gap)));
      video.style.gridRowEnd = `span ${span}`;
    }
    function classify(video){
      if(!video.videoWidth || !video.videoHeight) return;
      const landscape = video.videoWidth >= video.videoHeight;
      video.classList.toggle('is-landscape', landscape);
      video.classList.toggle('is-portrait', !landscape);
      video.style.aspectRatio = `${video.videoWidth} / ${video.videoHeight}`;
      requestAnimationFrame(() => resizeItem(video));
    }
    videos.forEach(video => {
      video.defaultMuted = true;
      video.muted = true;

      // La vista previa/poster llena el marco; al comenzar la reproducción,
      // el vídeo pasa a mostrar el contenido completo sin recorte.
      video.addEventListener('play', () => {
        video.classList.add('has-started');
      }, {once:true});

      if(video.readyState >= 1) classify(video);
      else video.addEventListener('loadedmetadata', () => classify(video), {once:true});
    });
    const resizeAll = () => videos.forEach(resizeItem);
    window.addEventListener('resize', resizeAll, {passive:true});
    window.addEventListener('orientationchange', () => requestAnimationFrame(resizeAll), {passive:true});
    if('ResizeObserver' in window){
      const observer = new ResizeObserver(resizeAll);
      observer.observe(shell);
    }
  }

  document.querySelectorAll('[data-slider]').forEach(initSlider);
  document.querySelectorAll('[data-slider]').forEach(initPhotoViewer);
  document.querySelectorAll('[data-compare]').forEach(initCompare);
  document.querySelectorAll('#planos').forEach(initPlanViewer);
  document.querySelectorAll('.video-shell').forEach(initVideoMosaic);
  syncDesktopTooltips();
  window.matchMedia('(hover: hover) and (pointer: fine)').addEventListener?.('change', syncDesktopTooltips);
})();
