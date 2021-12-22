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

let size = 4,
  board = [],
  score,
  gameover;
const boardDisplaySize = 0.6; // [0, 1]: portion of window size

// -----------------------------------------------------------------------

// FUNCIONES
//    1. Start
//    2. Auxiliares
//    3. Gestores de eventos

function start() {
  console.log("starting...");
  addEventListeners();
  resizeBoard();
  loadBoard();
}

function addEventListeners() {
  document.addEventListener("keyup", controlKeyUp);
  window.addEventListener("resize", resizeBoard);
  newGameButton.addEventListener("click", newGame);
  sizeSlider.addEventListener("input", controlBoardSize);
}

// Loads board from localStorage
function loadBoard() {
  const intBoard = JSON.parse(localStorage.getItem("board"));

  if (intBoard !== null) {
    createBoardFromMatrix(intBoard);
    score = +localStorage.getItem("score");
  } else {
    createBoard();
  }
  updateDisplay();
}

// Saves board to localStorage
function saveBoard() {
  localStorage.setItem("board", JSON.stringify(getIntBoard()));
  localStorage.setItem("score", score);
}

function updateDisplay() {
  scoreDisplay.innerHTML = score;
  sizeDisplay.innerHTML = size;
  sizeSlider.value = size;
  boardDisplay.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;
}

// Initializes the board
function createBoard() {
  const localBoard = [];

  score = 0;
  gameover = false;
  boardDisplay.innerHTML = "";

  for (let i = 0; i < size; i++) {
    const row = [];

    for (let j = 0; j < size; j++) {
      const square = document.createElement("div");
      // square.classList.add("square", "square-0");
      boardDisplay.appendChild(square);
      row.push(square);
    }
    localBoard.push(row);
  }

  board = localBoard;
  fillBoard();
  fillBoard();
  saveBoard();
}

// Randomly fills an empty position (square) on the board
function fillBoard() {
  const row = Math.floor(Math.random() * size),
    col = Math.floor(Math.random() * size),
    randomSquare = board[row][col];

  if (randomSquare.innerHTML.length === 0) {
    randomSquare.innerHTML = 2;
  } else fillBoard();
}

// Initializes the board from a matrix of ints
function createBoardFromMatrix(intBoard) {
  board = intBoard.map((row) =>
    row.map(function (value) {
      const square = document.createElement("div");
      square.innerHTML = value != 0 ? value : "";
      boardDisplay.appendChild(square);
      return square;
    })
  );

  size = intBoard.length;
}

// Returns an int version of board
function getIntBoard() {
  return board.map((row) => row.map((square) => +square.innerHTML));
}

// Moves the squares in `dir` direction
function move(dir, combine = true) {
  const vectors = ["r", "l"].includes(dir) ? board : transpose(board);
  let moved = false;

  for (const vector of vectors) {
    const intVector = vector.map((squareHTML) => +squareHTML.innerHTML);
    let newVector = intVector.filter((n) => n);
    const missingValues = Array(size - newVector.length).fill("");
    newVector = ["r", "d"].includes(dir)
      ? missingValues.concat(newVector)
      : newVector.concat(missingValues);

    moved ||= intVector.some((e, i) => e != +newVector[i]);

    for (const [i, square] of vector.entries()) {
      square.innerHTML = newVector[i];
    }
  }

  if (combine) {
    const combined = combineVectors(dir, vectors);
    return moved || combined;
  }
}

// Transposes the input matrix
function transpose(M) {
  return M[0].map((_, i) => M.map((row) => row[i]));
}

// Combines rows or columns after each move
function combineVectors(dir, vectors) {
  let combined = false;

  for (let vector of vectors) {
    // Vector must be iterated in the direction of movement
    if (dir == "r" || dir == "d") {
      vector = vector.slice().reverse();
    }

    // Ignore last element
    for (let i = 0; i < vector.length - 1; i++) {
      const squareValue = +vector[i].innerHTML,
        nextSquareValue = +vector[i + 1].innerHTML;

      if (squareValue && squareValue === nextSquareValue) {
        vector[i].innerHTML = squareValue * 2;
        vector[i + 1].innerHTML = "";
        addScore(squareValue * 2);
        combined = true;
        i++;
      }
    }
  }

  if (combined) {
    move(dir, false);
  }
  return combined;
}

// Adds `x` to score
function addScore(x) {
  score += x;
  scoreDisplay.innerHTML = score;
}

function isGameover() {
  const intBoard = getIntBoard();

  if (intBoard.some((row) => row.includes(0))) {
    return false;
  }
  // Check for combinable squares
  else {
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        const current = intBoard[i][j],
          neighbors = [
            intBoard[i + 1]?.[j],
            intBoard[i - 1]?.[j],
            intBoard[i]?.[j + 1],
            intBoard[i]?.[j - 1],
          ];

        if (neighbors.some((n) => n === current)) {
          return false;
        }
      }
    }
  }

  return true;
}

// Key up event controller
function controlKeyUp(e) {
  if (gameover) {
    return;
  }

  switch (e.keyCode) {
    case 39:
      moveEvent("r");
      break;
    case 37:
      moveEvent("l");
      break;
    case 38:
      moveEvent("u");
      break;
    case 40:
      moveEvent("d");
      break;
  }
}

function moveEvent(dir) {
  const updated = move(dir);

  if (updated) {
    fillBoard();
    saveBoard();
  }
  if (isGameover()) {
    console.log("gameover!");
    gameover = true;
  }
}

function resizeBoard() {
  const size = Math.max(
    250,
    Math.min(window.innerWidth, window.innerHeight) * boardDisplaySize
  );
  boardDisplay.style.width = size + "px";
  boardDisplay.style.height = size + "px";
}

function newGame() {
  createBoard();
  updateDisplay();
}

function controlBoardSize() {
  size = sizeSlider.valueAsNumber;
  sizeDisplay.innerHTML = size;
}

// -----------------------------------------------------------------------

start();
