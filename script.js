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
const boardDisplay = document.getElementById("board");
const scoreDisplay = document.getElementById("score");

let boardWidth = 4;
let boardHeight = 4;
const squares = [];

// -----------------------------------------------------------------------

// FUNCIONES
//    1. Start
//    2. Auxiliares
//    3. Gestores de eventos

function start() {
  console.log("starting...");
  document.addEventListener('keyup', control);
  createBoard();
}

// Initializes the board
function createBoard() {
  for (let i = 0; i < boardWidth * boardHeight; i++) {
    const square = document.createElement("div");
    boardDisplay.appendChild(square);
    squares.push(square);
  }

  fillBoard();
  fillBoard();
}

// Randomly fills an empty position (square) on the board
function fillBoard() {
  const random = Math.floor(Math.random() * squares.length);
  const randomSquare = squares[random];

  if (randomSquare.innerHTML.length === 0) {
    randomSquare.innerHTML = 2;
  } else fillBoard();
}

// Returns squares as an array of ints
function getSquares() {
  return squares.map((square) => +square.innerHTML);
}

function moveRight() {
  const intSquares = getSquares();

  for (let i = 0; i < boardWidth; i++) {
    const row = intSquares.slice(i * boardWidth, (i + 1) * boardWidth);
    let newRow = row.filter((n) => n);
    const missingValues = boardWidth - newRow.length;
    newRow = Array(missingValues).fill(0).concat(newRow);

    for (let j = 0; j < 4; j++) {
      squares[i * boardWidth + j].innerHTML = newRow[j];
    }
  }
}

function combineRow() {}

function move(movement) {
  //   switch (movement) {
  //     case "r":
  //       break;
  //     case "l":
  //       break;
  //     case "u":
  //       break;
  //     case "d":
  //       break;
  //     default:
  //       console.log("Invalid movement");
  //   }
}

function control(e) {
  switch (e.keyCode) {
    case 39:
      keyRight();
      break;
    case 37:
      keyLeft();
      break;
    case 38:
      keyUp();
      break;
    case 40:
      keyDown();
      break;
  }
}

function keyRight() {
  moveRight();
}

// -----------------------------------------------------------------------

start();
