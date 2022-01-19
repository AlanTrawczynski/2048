"use strict";

// ####################################################################
// PREAMBULO
const author = "Alan Trawczynski";
document.getElementById("author").innerHTML = author;

// ####################################################################
/* COMENTARIOS
Para implementar la lógica del juego se hizo uso del vídeo proporcionado
junto a la propuesta del trabajo. Una vez implementado, se llevaron a cabo
varias mejoras y arreglos (en el recurso se cometían varios fallos).
Para el resto del código no se han utilizado recursos completos, más allá
de numerosas búsquedas para resolver problemas concretos.
Como inspiración evidente, sobretodo para el aspecto visual, se ha utilizado
el juego original (https://play2048.co/).

El JavaScript del proyecto se divide en 2 archivos principales:
  - game.js: contiene la clase Game que codifica toda la lógica del juego.
  - script.js: es este archivo, y comunica la lógica de juego de game.js
    con la interfaz de usuario.

Se ha intentado crear un código lo más legible posible, creo que los nombres
son bastante explicativos. En cualquier caso, se han documentado las funciones.
Me he tomado el permiso de modificar la función `comienzo()`, exigida en el
enunciado, por la función `start()`, puesto que el código hace uso del inglés.

El juego se controla mediante las flechas ↑ ↓ ← → (alternativamente, w a s d).
Adicionalmente, utilizando la tecla `t`, podemos probar la pantalla de victoria.

La implementación soporta diferentes tamaños de tablero. Esto ha supuesto que,
para poder hacer la interfaz completamente responsiva, algunas de las
propiedades CSS han de ser definidas y actualizadas mediante JavaScript (en
script.js) durante la ejecución de la aplicación, concretamente:
  - El grid-template del tablero se modifica en updateDisplay().
  - El gap del tablero se modifica en updateBoardGap().
  - El font-size de cada casilla se modifica en updateSquaresFontSize().
*/

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

/**
 * Crea el juego, añade los controlardores de eventos, e inicializa la
 * información de la interfaz (incluyendo algunas propiedades CSS).
 */
function start() {
  game = new Game(boardDisplay, generateRandomColors());
  isEndgame = false;

  document.addEventListener("keyup", controlKeyUp);
  window.addEventListener("resize", controlResize);
  updateDisplay();
}

// --------------------------------------------------------------------
// Auxiliares

/**
 * Genera un array de 11 colores aleatorios, representados en forma de string.
 * @returns Array de 11 strings
 */
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

/**
 * Genera un número entero aleatorio enel rango `(start, end)`.
 * @param {*} start Valor mínimo a generar
 * @param {*} end Valor máximo a generar
 * @returns
 */
function randomInt(start, end) {
  return start + Math.round(Math.random() * (end - start));
}

/**
 * Actualiza:
 * - La información del juego en la interfaz (score y board size).
 * - El grid-template del tablero, que define el número de columnas y filas.
 * - El gap del tablero.
 * - El font-size de cada casilla en el tablero.
 */
function updateDisplay() {
  scoreDisplay.innerHTML = game.score;
  sizeDisplay.innerHTML = game.size;
  sizeSlider.value = game.size;
  boardDisplay.style.gridTemplate = `repeat(${game.size}, 1fr) / repeat(${game.size}, 1fr)`;
  updateBoardGap();
  updateSquaresFontSize();
}

/**
 * Actualiza el font-size de cada casilla en el tablero, teniendo en cuenta
 * el tamaño de la pantalla, del tablero y la cantidad de cifras en el
 * número de la casilla.
 */
function updateSquaresFontSize() {
  const squareFontSize = (boardDisplay.clientWidth * 0.5) / game.size;

  Array.from(boardDisplay.children).forEach((child) => {
    const numberLength = child.innerHTML.length;
    child.style.fontSize = squareFontSize * (1 - numberLength * 0.12) + "px";
  });
}

/**
 * Actualiza el gap del tablero, teniendo en cuenta el tamaño de pantalla
 * y del tablero.
 */
function updateBoardGap() {
  const boardGap = (boardDisplay.clientWidth * 0.2) / game.size;
  boardDisplay.style.gap = boardGap + "px";
}

// --------------------------------------------------------------------
// Eventos

/**
 * Inicia un juego nuevo con el tamaño indicado por el slider.
 */
function newGame() {
  game.newGame(sizeSlider.valueAsNumber);
  isEndgame = false;
  endgameDisplay.classList.remove("board-container__message--visible");
  updateDisplay();
}

/**
 * Actualiza el texto del elemento que muestra el tamaño del juego.
 */
function controlSizeSlider() {
  sizeDisplay.innerHTML = sizeSlider.value;
}

/**
 * Controla la pulsación de teclas:
 * - w, ↑: movimiento hacia arriba
 * - a, ←: movimiento hacia la izquierda
 * - s, ↓: movimiento hacia abajo
 * - d, →: movimiento hacia la derecha
 * - t: permite comprobar el funcionamiento de la interfaz ante una victoria
 */
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

/**
 * Actualiza:
 * - El gap del tablero.
 * - El font-size de cada casilla en el tablero.
 */
function controlResize() {
  updateBoardGap();
  updateSquaresFontSize();
}

// ####################################################################

start();
