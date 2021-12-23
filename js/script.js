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
  scoreDisplay = document.getElementById("score");

let game = new Game(boardDisplay);
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

function addEventListeners() {
  document.addEventListener("keyup", controlKeyUp);
  newGameButton.addEventListener("click", newGame);
  sizeSlider.addEventListener("input", controlSizeSlider);
}

function updateDisplay() {
  scoreDisplay.innerHTML = game.score;
  sizeDisplay.innerHTML = game.size;
  sizeSlider.value = game.size;
  boardDisplay.style.gridTemplate = `repeat(${game.size}, 1fr) / repeat(${game.size}, 1fr)`;
}

// Key up event controller
function controlKeyUp(e) {
  if (game.isGameover) {
    console.log("gameover!");
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

  scoreDisplay.innerHTML = game.score;
}

function newGame() {
  game.newGame(sizeSlider.valueAsNumber);
  updateDisplay();
}

function controlSizeSlider() {
  sizeDisplay.innerHTML = sizeSlider.value;
}

// -----------------------------------------------------------------------

start();
