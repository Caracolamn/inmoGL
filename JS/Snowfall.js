// Set up canvas
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create snowflakes
let snowflakes = [];

for (let i = 0; i < 100; i++) {
  snowflakes.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 5 + 2,
    speed: Math.random() * 1 + 0.5,
    opacity: Math.random() * 0.5 + 0.5
  });
}

// Draw snowflakes
function drawSnowflakes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < snowflakes.length; i++) {
    let snowflake = snowflakes[i];

    ctx.beginPath();
    ctx.arc(snowflake.x, snowflake.y, snowflake.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${snowflake.opacity})`;
    ctx.fill();
    ctx.closePath();

    snowflake.y += snowflake.speed;

    if (snowflake.y > canvas.height) {
      snowflake.y = 0;
    }
  }

  requestAnimationFrame(drawSnowflakes);
}

drawSnowflakes();