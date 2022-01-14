"use strict";

// ####################################################################
// PREAMBULO
const author = "Alan Trawczynski";
document.getElementById("author").innerHTML = author;

// ####################################################################
// COMENTARIOS
// ...

// ####################################################################
// VARIABLES

// --------------------------------------------------------------------
// Interacción

const newGameButton = document.getElementById("newGameButton"),
  sizeSlider = document.getElementById("boardSizeSlider");

newGameButton.addEventListener("click", newGame);
sizeSlider.addEventListener("input", controlSizeSlider);

// --------------------------------------------------------------------
// Informativos

const boardDisplay = document.getElementById("board"),
  sizeDisplay = document.getElementById("boardSizeValue"),
  scoreDisplay = document.getElementById("scoreValue"),
  endgameDisplay = document.getElementById("endgameScreen");

// --------------------------------------------------------------------
// General

let game, isEndgame;

// ####################################################################
// FUNCIONES

// --------------------------------------------------------------------
// Start

function start() {
  game = new Game(boardDisplay, generateRandomColors());
  isEndgame = false;

  document.addEventListener("keyup", controlKeyUp);
  window.addEventListener("resize", controlResize);
  updateDisplay();
}

// --------------------------------------------------------------------
// Auxiliares

// Returns an array of randomly generated colors
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

// Updates game information and board's gridTemplate
function updateDisplay() {
  scoreDisplay.innerHTML = game.score;
  sizeDisplay.innerHTML = game.size;
  sizeSlider.value = game.size;
  boardDisplay.style.gridTemplate = `repeat(${game.size}, 1fr) / repeat(${game.size}, 1fr)`;
  updateBoardGap();
  updateSquaresFontSize();
}

// Updates fontSize of each square in the board
function updateSquaresFontSize() {
  const squareFontSize = (boardDisplay.clientWidth * 0.5) / game.size;

  Array.from(boardDisplay.children).forEach((child) => {
    const numberLength = child.innerHTML.length;
    child.style.fontSize = squareFontSize * (1 - numberLength * 0.12) + "px";
  });
}

// Updates board's gap
function updateBoardGap() {
  const boardGap = (boardDisplay.clientWidth * 0.2) / game.size;
  boardDisplay.style.gap = boardGap + "px";
}

// --------------------------------------------------------------------
// Eventos

// newGameButton click event controller
function newGame() {
  game.newGame(sizeSlider.valueAsNumber);
  isEndgame = false;
  endgameDisplay.classList.remove("board-container__message--visible");
  updateDisplay();
}

// sizeSlider input event controller
function controlSizeSlider() {
  sizeDisplay.innerHTML = sizeSlider.value;
}

// KeyUp event controller
function controlKeyUp(e) {
  if (isEndgame) {
    return;
  }

  switch (e.keyCode) {
    case 87: // w
    case 38: // ↑
      game.moveUp();
      break;
    case 65: // a
    case 37: // ←
      game.moveLeft();
      break;
    case 83: // s
    case 40: // ↓
      game.moveDown();
      break;
    case 68: // d
    case 39: // →
      game.moveRight();
      break;
    case 84: // t (testing)
      game.testWin();
      updateDisplay();
      break;
  }

  scoreDisplay.innerHTML = game.score;
  updateSquaresFontSize();

  if (game.isEndgame) {
    isEndgame = true;
    // Show endgame message
    endgameDisplay.innerHTML = game.isWin ? "You win" : "Game over";
    endgameDisplay.classList.add("board-container__message--visible");
  }
}

// Resize event controller
function controlResize() {
  updateBoardGap();
  updateSquaresFontSize();
}

// ####################################################################

start();
