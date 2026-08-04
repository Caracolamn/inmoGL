document.addEventListener('DOMContentLoaded', () => {
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
    const pricedBoxes = Array.from(propertyContainer.querySelectorAll('.box'))
      .filter(box => box.querySelector('.moneda'));

    pricedBoxes
      .map(box => ({
        box,
        price: Number(box.querySelector('.moneda').textContent.replace(/\D/g, ''))
      }))
      .sort((a, b) => a.price - b.price)
      .forEach(({ box }) => propertyContainer.appendChild(box));
  }
});
