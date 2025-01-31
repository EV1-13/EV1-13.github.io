const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");
canvas.width = 400;
canvas.height = 700;

document.body.append(canvas);

const GAME_STATE = {
  START: "start",
  PLAYING: "playing",
  GAME_OVER: "gameOver"
};

const gameState = {
  currentState: GAME_STATE.START,
  score: 0,
  cakeHealth: 3
};

const player = {
  x: canvas.width / 2 - 30,
  y: canvas.height - 200,
  width: 80,
  height: 80,
  speed: 5
};

let forks = [];

const forkProperties = {
  width: 250,
  height: 30,
  speed: 4,
  spawnRate: 60,
  maxForks: 4
};

const background = {
  rayCount: 12,
  raySpeed: 0.005,
  rayAngle: 0,
  innerRadius: 1, // Size of triangle base near center
  outerRadius: 500 // How far the triangles stretch
};

const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false
};

// Event listeners for keyboard
document.addEventListener("keydown", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
  }
});

document.addEventListener("keyup", (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

class Button {
  constructor(text, x, y, width, height) {
    this.x = x || canvas.width / 2 - 60;
    this.y = y || canvas.height / 2 + 50;
    this.width = width || 120;
    this.height = height || 50;
    this.text = text;
  }

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = "#04678e";
    ctx.beginPath();
    ctx.roundRect(this.x, this.y, this.width, this.height, 10);
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.text, this.x + this.width / 2, this.y + this.height / 2);

    ctx.restore();
  }

  isClicked(mouseX, mouseY) {
    return (
      mouseX >= this.x &&
      mouseX <= this.x + this.width &&
      mouseY >= this.y &&
      mouseY <= this.y + this.height
    );
  }
}

const startButton = new Button("START");
const restartButton = new Button("RESTART");

canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (
    gameState.currentState === GAME_STATE.START &&
    startButton.isClicked(mouseX, mouseY)
  ) {
    startGame();
  } else if (
    gameState.currentState === GAME_STATE.GAME_OVER &&
    restartButton.isClicked(mouseX, mouseY)
  ) {
    startGame();
  }
});

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = e.clientX - rect.left;
  const mouseY = e.clientY - rect.top;

  if (
    startButton.isClicked(mouseX, mouseY) ||
    restartButton.isClicked(mouseX, mouseY)
  ) {
    canvas.style.cursor = "pointer";
  } else {
    canvas.style.cursor = "default";
  }
});

function createFork() {
  let width = forkProperties.width * Math.random();
  if (width < 100) {
    width = 100;
  }

  const random = Math.random();

  return {
    x: random > 0.5 ? canvas.width - width : 0,
    y: -forkProperties.height,
    width,
    height: forkProperties.height,
    fromLeft: random < 0.5
  };
}

function checkCollision(rect1, rect2) {
  return (
    rect1.x < rect2.x + rect2.width &&
    rect1.x + rect1.width > rect2.x &&
    rect1.y < rect2.y + rect2.height &&
    rect1.y + rect1.height > rect2.y
  );
}

function updatePlayer() {
  if (keys.ArrowRight && player.x > 0) {
    player.x -= player.speed;
  }
  if (keys.ArrowLeft && player.x < canvas.width - player.width) {
    player.x += player.speed;
  }
  if (keys.ArrowDown && player.y > 0) {
    player.y -= player.speed;
  }
  if (keys.ArrowUp && player.y < canvas.height - player.height) {
    player.y += player.speed;
  }
}

function updateForks() {
  if (
    frameCount % forkProperties.spawnRate === 0 &&
    forks.length < forkProperties.maxForks
  ) {
    forks.push(createFork());
  }

  for (let i = forks.length - 1; i >= 0; i--) {
    const fork = forks[i];
    fork.y += forkProperties.speed;

    fork.x += Math.sin(0.03 * frameCount);

    if (checkCollision(fork, player)) {
      gameState.cakeHealth--;
      forks.splice(i, 1);

      if (gameState.cakeHealth <= 0) {
        gameState.currentState = GAME_STATE.GAME_OVER;
      }
      continue;
    }

    if (fork.y > canvas.height) {
      forks.splice(i, 1);
      gameState.score++;

      if (gameState.score % 20 === 0) {
        forkProperties.speed++;
      }
    }
  }
}

function drawBackground() {
  ctx.save(); // Save the current state

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const gradient = ctx.createRadialGradient(
    centerX,
    centerY,
    0,
    centerX,
    centerY,
    canvas.width
  );

  gradient.addColorStop(0, "#b8ebff");
  gradient.addColorStop(1, "#78d2ff");

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw triangular rays
  ctx.save();
  ctx.translate(centerX, centerY);
  ctx.rotate(background.rayAngle);

  // Set ray style
  ctx.fillStyle = "rgba(255, 255, 255, 0.1)";

  // Draw each triangular ray
  for (let i = 0; i < background.rayCount; i++) {
    const angle = ((Math.PI * 2) / background.rayCount) * i;

    ctx.save();
    ctx.rotate(angle);

    // Draw triangle
    ctx.beginPath();
    ctx.moveTo(-background.innerRadius, 0); // Left point near center
    ctx.lineTo(background.outerRadius, -background.outerRadius / 3); // Top outer point
    ctx.lineTo(background.outerRadius, background.outerRadius / 2); // Bottom outer point
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  ctx.restore();

  // Update ray rotation
  background.rayAngle += background.raySpeed;

  ctx.restore(); // Restore the saved state
}

function drawPlayer() {
  ctx.beginPath();
  ctx.fillStyle = "#D2691E"; // Chocolate colour
  ctx.rect(player.x, player.y + 50, player.width, player.height - 50);
  ctx.fill();

  ctx.beginPath();
  ctx.fillStyle = "#FFFACD"; // Light yellow (like vanilla icing)
  ctx.rect(player.x, player.y + 30, player.width, player.height - 60);
  ctx.fill();

  function drawCherries(cherriesCount, x, y) {
    const initX = x - 10;
    for (let i = 1; i <= cherriesCount; i++) {
      x = initX + i * 25;
      // Draw the cherry on top
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI); // Cherry at the centre of the icing
      ctx.fillStyle = "#FF0000"; // Red cherry
      ctx.fill();
      // Optional: Draw a little stem for the cherry
      ctx.beginPath();
      ctx.moveTo(x, y - 10); // Starting point for the stem
      ctx.lineTo(x, y - 25); // Ending point of the stem
      ctx.strokeStyle = "#8B4513"; // Brown stem colour
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  drawCherries(gameState.cakeHealth, player.x, player.y + 20);

  // ctx.fillStyle = "RGBA(255, 0, 0, 0.2)";
  // ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawForks() {
  forks.forEach((fork) => {
    ctx.save();
    ctx.fillStyle = "silver";
    ctx.lineWidth = 3;

    const forkBodyX = fork.fromLeft ? fork.x + fork.width - 55 : fork.x + 30;
    drawRoundedRect(
      ctx,
      fork.fromLeft ? 0 : forkBodyX,
      fork.y + 22,
      fork.fromLeft ? forkBodyX : canvas.width,
      10,
      0
    );
    ctx.stroke();
    ctx.fill();

    // draw prongs
    const prongsX = fork.fromLeft ? fork.x + fork.width - 40 : fork.x;
    drawRoundedRect(ctx, prongsX, fork.y + 10, 40, 4, 2);
    ctx.stroke();
    ctx.fill();
    drawRoundedRect(ctx, prongsX, fork.y + 20, 40, 4, 2);
    ctx.stroke();
    ctx.fill();
    drawRoundedRect(ctx, prongsX, fork.y + 30, 40, 4, 2);
    ctx.stroke();
    ctx.fill();
    drawRoundedRect(ctx, prongsX, fork.y + 40, 40, 4, 2);
    ctx.stroke();
    ctx.fill();
    drawRoundedRect(ctx, forkBodyX, fork.y + 10, 30, 35, 10);
    ctx.stroke();
    ctx.fill();

    drawRoundedRect(ctx, prongsX, fork.y + 10, 40, 4, 2);
    ctx.fill();
    drawRoundedRect(ctx, prongsX, fork.y + 20, 40, 4, 2);
    ctx.fill();
    drawRoundedRect(ctx, prongsX, fork.y + 30, 40, 4, 2);
    ctx.fill();
    drawRoundedRect(ctx, prongsX, fork.y + 40, 40, 4, 2);
    ctx.fill();
    drawRoundedRect(ctx, forkBodyX, fork.y + 10, 30, 35, 10);
    ctx.fill();

    ctx.fillStyle = "#c02b35";
    drawRoundedRect(
      ctx,
      fork.fromLeft ? 0 : forkBodyX + 60,
      fork.y + 17,
      fork.fromLeft ? forkBodyX - 30 : canvas.width,
      20,
      5
    );
    ctx.stroke();
    ctx.fill();

    // ctx.fillStyle = "RGBA(255, 0, 0, 0.2)";
    // ctx.fillRect(fork.x, fork.y, fork.width, fork.height);

    ctx.restore();
  });
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawScore() {
  ctx.save(); // Save the current state

  // draw blue shadow under the score
  ctx.fillStyle = "rgba(0, 150, 210, 0.5)";
  drawRoundedRect(ctx, canvas.width / 2 - 50, 50, 100, 50, 10);
  ctx.fill();

  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 5;

  // Draw rounded rectangle
  drawRoundedRect(ctx, canvas.width / 2 - 50, 40, 100, 50, 10);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "black";
  ctx.font = "32px Arial";
  ctx.fontWeight = "bold";
  ctx.textAlign = "center";
  ctx.fillText(`${gameState.score}`, canvas.width / 2, 75);

  ctx.restore(); // Restore the saved state
}

function createFunkyText(text, x, y) {
  ctx.save();
  ctx.font = "60px Arial";
  ctx.fontWeight = "bold";
  ctx.textAlign = "center";

  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.strokeStyle = "#c02b35";
  ctx.lineWidth = 20;
  ctx.lineJoin = "round";
  ctx.strokeText(text, x + 5, y + 5);
  ctx.fillText(text, x + 5, y + 5);

  ctx.fillStyle = "white";
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(0,0,0,0.5)";
  ctx.strokeText(text, x, y);
  ctx.fillText(text, x, y);
  ctx.restore();
}

function drawStartScreen() {
  drawBackground();

  ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  createFunkyText("Cake", canvas.width / 2, 150);
  createFunkyText("Defense", canvas.width / 2 + 5, 205);

  ctx.fillStyle = "black";
  ctx.font = "24px Arial";
  ctx.fillText("Protect your cake!", canvas.width / 2 - 90, canvas.height / 2);

  startButton.draw(ctx);
}

function drawGameOverScreen() {
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.font = "48px Arial";
  ctx.textAlign = "center";
  ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2 - 50);

  ctx.font = "24px Arial";
  ctx.fillText(
    `Final Score: ${gameState.score}`,
    canvas.width / 2,
    canvas.height / 2
  );

  restartButton.draw(ctx);
}

function startGame() {
  gameState.currentState = GAME_STATE.PLAYING;
  gameState.score = 0;
  gameState.cakeHealth = 3;
  forks = [];
  forkProperties.speed = 4;
  (player.x = canvas.width / 2 - 30),
    (player.y = canvas.height - 200),
    (frameCount = 0);
}

let frameCount = 0;
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  if (gameState.currentState === GAME_STATE.START) {
    drawStartScreen();
  } else if (gameState.currentState === GAME_STATE.PLAYING) {
    updatePlayer();
    updateForks();
    drawPlayer();
    drawForks();
    drawScore();
    frameCount++;
  } else if (gameState.currentState === GAME_STATE.GAME_OVER) {
    drawGameOverScreen();
  }

  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();

// signature
const funs = new Funs();
funs.signature();