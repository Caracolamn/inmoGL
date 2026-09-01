document.addEventListener('DOMContentLoaded', () => {
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
