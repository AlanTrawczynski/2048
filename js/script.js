"use strict";

// -----------------------------------------------------------------------

// PREAMBULO
const author = "Alan Trawczynski";
document.getElementById("author").innerHTML = author;

// -----------------------------------------------------------------------

// COMENTARIOS
// ...

// -----------------------------------------------------------------------

// VARIABLES
//    1. Acceso a elementos HTML con interacción (e interacciones asociadas)
//    2. Acceso a elementos HTML informativos
//    3. Uso general
const boardDisplay = document.getElementById("board"),
  newGameButton = document.getElementById("newGameButton"),
  sizeSlider = document.getElementById("boardSizeSlider");

const sizeDisplay = document.getElementById("boardSizeValue"),
  scoreDisplay = document.getElementById("score"),
  gameoverDisplay = document.getElementById("gameoverScreen");

let game = new Game(boardDisplay, generateRandomColors());
const boardDisplaySize = 0.6; // [0, 1]: portion of window size

// -----------------------------------------------------------------------

// FUNCIONES
//    1. Start
//    2. Auxiliares
//    3. Gestores de eventos

function start() {
  console.log("starting...");
  addEventListeners();
  updateDisplay();
}

function generateRandomColors() {
  let colors = [];
  const h0 = Math.floor(Math.random() * 255),
    s0 = 50,
    l0 = 60;

  for (let i = 0; i < 11; i++) {
    const h = (h0 + 25 * i) % 255,
      s = s0 + randomInt(-20, 20),
      l = l0 + randomInt(-20, 20);

    colors.push(`hsl(${h}, ${s}%, ${l}%)`);
  }
  return colors;
}

// Generates a random int in the given range
function randomInt(start, end) {
  return start + Math.round(Math.random() * (end - start));
}

function addEventListeners() {
  document.addEventListener("keyup", controlKeyUp);
  window.addEventListener("resize", controlResize);
  newGameButton.addEventListener("click", newGame);
  sizeSlider.addEventListener("input", controlSizeSlider);
  // temp
  document.getElementById("testButton").addEventListener("click", (_) => {
    game.test();
    updateDisplay();
  });
}

function updateDisplay() {
  scoreDisplay.innerHTML = game.score;
  sizeDisplay.innerHTML = game.size;
  sizeSlider.value = game.size;
  boardDisplay.style.gridTemplate = `repeat(${game.size}, 1fr) / repeat(${game.size}, 1fr)`;
  controlResize();
}

// Key up event controller
function controlKeyUp(e) {
  if (game.isGameover) {
    return;
  }

  switch (e.keyCode) {
    case 39:
      game.moveRight();
      break;
    case 37:
      game.moveLeft();
      break;
    case 38:
      game.moveUp();
      break;
    case 40:
      game.moveDown();
      break;
  }

  updateFontSize();
  if (game.isGameover) {
    gameoverDisplay.classList.add("gameover-message--visible");
  }
  scoreDisplay.innerHTML = game.score;
}

function showGameover() {
  gameoverDisplay.classList.add("gameover-message--visible");
}

function newGame() {
  game.newGame(sizeSlider.valueAsNumber);
  gameoverDisplay.classList.remove("gameover-message--visible");
  updateDisplay();
}

function controlResize() {
  const boardGap = (boardDisplay.clientWidth * 0.2) / game.size;

  boardDisplay.style.gap = boardGap + "px"; // update board gap
  updateFontSize();
}

function updateFontSize() {
  const squareFontSize = (boardDisplay.clientWidth * 0.5) / game.size;

  Array.from(boardDisplay.children).forEach((child) => {
    const numberLength = child.innerHTML.length;
    child.style.fontSize = squareFontSize * (1 - numberLength * 0.12) + "px";
  });
}

function controlSizeSlider() {
  sizeDisplay.innerHTML = sizeSlider.value;
}

// -----------------------------------------------------------------------

start();
