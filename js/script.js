"use strict";

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
  scoreDisplay = document.getElementById("scoreValue"),
  endgameDisplay = document.getElementById("endgameScreen");

let game = new Game(boardDisplay, generateRandomColors()),
  isEndgame = false;
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
  const h0 = Math.floor(Math.random() * 360),
    s = 80,
    l = 65;

  for (let i = 0; i < 11; i++) {
    const h = (h0 + (360 / 11) * i) % 360;
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
  if (isEndgame) {
    return;
  }

  switch (e.keyCode) {
    case 39: // →
      game.moveRight();
      break;
    case 37: // ←
      game.moveLeft();
      break;
    case 38: // ↑
      game.moveUp();
      break;
    case 40: // ↓
      game.moveDown();
      break;
    case 84: // t: testing
      game.test();
      updateDisplay();
      break;
  }

  updateFontSize();
  if (game.isEndgame) {
    endgameDisplay.innerHTML = game.isWin ? "You win" : "Game over";
    endgameDisplay.classList.add("board-container__message--visible");
    isEndgame = true;
  }
  scoreDisplay.innerHTML = game.score;
}

function newGame() {
  game.newGame(sizeSlider.valueAsNumber);
  endgameDisplay.classList.remove("board-container__message--visible");
  isEndgame = false;
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
