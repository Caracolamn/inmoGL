const menuBtn = document.getElementById('hamburger-btn');
const menu = document.getElementById('menu');

menuBtn.addEventListener('click', () => {
  menu.classList.toggle('open');
});




const hamburgerBtn = document.querySelector('#hamburger-btn');
    
hamburgerBtn.addEventListener('click', function() {
  this.classList.toggle('active');
});



//FILTER POBLACION DROPDOWN MENU
// Get a reference to the location select dropdown
const locationSelect = document.getElementById('location-select');

// Get a reference to all the property files
const propertyFiles = document.querySelectorAll('.box');

// Add an event listener to the location select dropdown
locationSelect.addEventListener('change', () => {
  // Get the selected location
  const selectedLocation = locationSelect.value;

  // Loop through all the property files
  propertyFiles.forEach(propertyFile => {
    // Get the location of the current property file
    const location = propertyFile.querySelector('.ubicacion h3').textContent;

    // If the selected location is empty or matches the current property file location, show the property file. Otherwise, hide it.
    if (selectedLocation === '' || selectedLocation === location) {
      propertyFile.style.display = 'block';
    } else {
      propertyFile.style.display = 'none';
    }
  });
});


// refresh page to default FILTER POBLACION DROPDOWN MENU on firefox browser
window.onload = function() {
  document.getElementById("location-select").selectedIndex = 0;
}



//sort property by price fom A to B

const container = document.querySelector('.container');
const boxes = container.querySelectorAll('.box');

// create array of objects pairing each box with its corresponding price
const boxPrices = Array.from(boxes).map(box => ({
  box: box,
  price: Number(box.querySelector('.moneda').textContent.replace(/\D/g, ''))
}));

// sort the array of objects based on the price
boxPrices.sort((a, b) => a.price - b.price);

// loop through the sorted array to append the boxes to the container in the correct order
for (const boxPrice of boxPrices) {
  container.appendChild(boxPrice.box);
}
