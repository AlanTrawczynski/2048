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

let ncols = 4;
let nrows = 4;
const board = [];

// -----------------------------------------------------------------------

// FUNCIONES
//    1. Start
//    2. Auxiliares
//    3. Gestores de eventos

function start() {
  console.log("starting...");
  document.addEventListener("keyup", controlKeyUp);
  createBoard();
}

// Initializes the board
function createBoard() {
  for (let i = 0; i < nrows; i++) {
    const row = [];

    for (let j = 0; j < ncols; j++) {
      const square = document.createElement("div");
      boardDisplay.appendChild(square);
      row.push(square);
    }

    board.push(row);
  }

  fillBoard();
  fillBoard();
}

// Randomly fills an empty position (square) on the board
function fillBoard() {
  const row = Math.floor(Math.random() * nrows);
  const col = Math.floor(Math.random() * ncols);
  const randomSquare = board[row][col];

  if (randomSquare.innerHTML.length === 0) {
    randomSquare.innerHTML = 2;
  } else fillBoard();
}

// Moves the squares in `dir` direction
function move(dir, combine=true) {
  const [vectors, elemsPerVector] = ["r", "l"].includes(dir)
    ? [board, ncols]
    : [transpose(board), ncols];

  for (const vector of vectors) {
    const intVector = vector.map((squareHTML) => +squareHTML.innerHTML);
    let newVector = intVector.filter((n) => n);
    const missingValues = Array(elemsPerVector - newVector.length).fill("");
    newVector = ["r", "d"].includes(dir)
      ? missingValues.concat(newVector)
      : newVector.concat(missingValues);

    for (const [i, square] of vector.entries()) {
      square.innerHTML = newVector[i];
    }
  }

  if (combine) {
    combineVectors(dir, vectors);
  }

  // TODO: check gameover
}

// Transposes the input matrix
function transpose(M) {
  return M[0].map((_, i) => M.map((row) => row[i]));
}

// Combines rows or columns after each move
function combineVectors(dir, vectors) {
  for (let vector of vectors) {
    // Vector must be iterated in the direction of movement
    if (dir == "r" || dir == "d") {
      vector = vector.slice().reverse();
    }

    // Ignore last element
    for (let i = 0; i < vector.length - 1; i++) {
      const squareValue = +vector[i].innerHTML;
      const nextSquareValue = +vector[i + 1].innerHTML;

      if (squareValue == nextSquareValue) {
        vector[i].innerHTML = squareValue * 2;
        vector[i + 1].innerHTML = "";
        addScore(squareValue * 2);
        i++;
      }
    }
  }

  move(dir, false)
}

// Adds `x` to score
function addScore(x) {
  scoreDisplay.innerHTML = +scoreDisplay.innerHTML + x;
}

// Key up event controller
function controlKeyUp(e) {
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
  move("r");
  setTimeout(fillBoard, 300);
}

function keyLeft() {
  move("l");
  setTimeout(fillBoard, 300);
}

function keyUp() {
  move("u");
  setTimeout(fillBoard, 300);
}

function keyDown() {
  move("d");
  setTimeout(fillBoard, 300);
}

// -----------------------------------------------------------------------

start();
