let minBlurAmount = .5;
let maxBlurAmount = 2;
const numParticles = 100;
let hexRadius = 40;
let hexShrinkFactor = .96;
let minRadius = 1;
let maxRadius = 30;

function skewedRandom(min, max) {
    return (randomGaussian(.5*(min+max)) + randomGaussian(.5*(min, max))) / 2; // Average of two randoms
  }

class Particle {
    constructor(x, y, radius, speedX = 1, speedY = 1) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.speedX = speedX;
      this.speedY = speedY;
      this.color = [random(0,255), 255, 255]; // Random color
      this.blurAmount = radius*random(minBlurAmount,maxBlurAmount); // Random blur
    }
  
    draw() {
      const ctx = drawingContext;
  
      ctx.save();
      ctx.filter = `blur(${this.blurAmount}px)`;
  
      // Draw the circle
      fill(this.color[0], this.color[1], this.color[2]);
      circle(this.x, this.y, this.radius);
  
      ctx.restore();
  
      this.update();
    }
  
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
  
      this.checkBounds();
    }
  
    checkBounds() {
      if (this.x - this.radius < 0 || this.x + this.radius > width) this.speedX *= -1;
      if (this.y - this.radius < 0 || this.y + this.radius > height) this.speedY *= -1;
    }
  }
  
  let particles = [];
  const canvasWidth = 800;
  const canvasHeight = 800;
  
  function setup() {
    createCanvas(canvasWidth, canvasHeight);
    noStroke();
  
    // Populate particles array
    for (let i = 0; i < numParticles; i++) {
      let radius = random(minRadius, maxRadius);
      particles.push(
        new Particle(
        skewedRandom(radius, canvasWidth - radius),
        skewedRandom(radius, canvasHeight - radius),
          radius,
          random(-4, 4),
          random(-4, 4)
        )
      );
    }
  }
  
  function draw() {
    background(0); // Clear the canvas with a black background
  
    // Draw particles on top of the hexagons
    for (let particle of particles) {
      particle.draw();
    }

     // Draw hexagons first
     drawHexagons();
  }
  
  function drawHexagons() {
    const originalRadius = hexRadius; // Base hexagon radius
    const shrinkFactor = hexShrinkFactor; // Shrink hexagons slightly
    const radius = originalRadius * shrinkFactor; // Adjusted hexagon radius
    const hexWidth = sqrt(3) * originalRadius; // Width of hexagons
    const hexHeight = 2 * originalRadius; // Height of hexagons
    const yStep = 1.5 * originalRadius; // Vertical spacing
    const rows = ceil(canvasHeight / yStep) + 1; // Ensure full canvas coverage
    const cols = ceil(canvasWidth / hexWidth) + 1;
  
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        let x = col * hexWidth;
        let y = row * yStep;
  
        if (row % 2 === 1) {
          x += hexWidth / 2; // Offset for staggered rows
        }
  
        fill(0); // Gray color for hexagons
        noStroke();
        drawHexagon(x, y, radius);
      }
    }
  }
  
  function drawHexagon(x, y, radius) {
    beginShape();
    for (let i = 0; i < 6; i++) {
      let angle = PI / 6 + (TWO_PI / 6) * i; // Rotate for vertex-up orientation
      let vx = x + cos(angle) * radius;
      let vy = y + sin(angle) * radius;
      vertex(vx, vy);
    }
    endShape(CLOSE);
  }
  