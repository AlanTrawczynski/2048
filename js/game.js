/**
 * Clase que condifica toda la lógica del juego 2048.
 *
 * Su única interacción con el HTML es la creación de una serie de `div`s
 * que representan las casillas del tablero, insertándolas en el contendor
 * pasado como parámetro al constructor. Además, las clases de las
 * casillas son actualizadas a medida que cambia el estado del juego.
 *
 * Como parámetro opcional en el constructor, puede incluirse un array de
 * strings con el color asociado a cada tipo de casilla.
 */
class Game {
  /**
   * Constructor de la clase Game.
   * @param {*} container Contenedor en el que se incluirán las casillas del juego
   * @param {*} colors Colores asciados a cada uno de los tipos de casilla
   */
  constructor(container, colors = null) {
    this.container = container;
    this.colors = colors;
    this.boardValues = null;
    this.board = null;
    this.score = null;
    this.newestSquare = null;

    const isSaved = localStorage.getItem("boardValues") !== null;
    if (isSaved) {
      this.load();
    } else {
      this.newGame(4);
    }
  }

  /**
   * Devuelve el tamaño del tablero.
   */
  get size() {
    return this.boardValues.length;
  }

  /**
   * `true` si el estado del juego es una derrota o victoria.
   */
  get isEndgame() {
    return this.isWin || this.isGameover;
  }

  /**
   * `true` si el estado del juego es victoria.
   */
  get isWin() {
    return this.boardValues.flat().some((v) => v === 2048);
  }

  /**
   * `true` si el estado del juego es derrota.
   */
  get isGameover() {
    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const current = this.boardValues[row][col],
          neighbors = [
            this.boardValues[row + 1]?.[col],
            this.boardValues[row - 1]?.[col],
            this.boardValues[row]?.[col + 1],
            this.boardValues[row]?.[col - 1],
          ].filter((n) => n);

        if (current === 0 || neighbors.includes(current)) {
          return false;
        }
      }
    }
    return true;
  }

  // --------------------------------------------------------------------
  // METHODS

  /**
   * Carga el estado del juego guardado en `localStorage`.
   */
  load() {
    this.boardValues = JSON.parse(localStorage.getItem("boardValues"));
    this.score = +localStorage.getItem("score");
    this.generateBoard();
    this.updateColors();
  }

  /** 
   * Guarda el estado del juego en `localStorage`.
  */
  save() {
    localStorage.setItem("boardValues", JSON.stringify(this.boardValues));
    localStorage.setItem("score", this.score);
  }

 /**
  * Inicializa un nuevo juego con un tablero de tamaño `size`.
  * @param {*} size Tamaño del tablero del nuevo juego
  */
  newGame(size) {
    this.container.innerHTML = ""; // Removes all child nodes
    this.score = 0;
    this.boardValues = Array(size) // Set boardValues to a matrix of 0s
      .fill(0)
      .map((_) => Array(size).fill(0));
    this.generateBoard();
    this.fillSquare();
    this.fillSquare();
    this.updateColors();
    this.save();
  }

  /**
   * Utilizando los valores de `this.boardValues`, crea los `div`s que
   * representan las casillas del tablero, insertándolas en `this.container`.
   */
  generateBoard() {
    this.board = this.boardValues.map((row) =>
      row.map((value) => {
        const square = document.createElement("div");
        square.innerHTML = value !== 0 ? value : "";
        square.classList.add("square", `square--${value}`);
        this.container.appendChild(square);
        return square;
      })
    );
  }

  /** 
   * Rellena una posición aleatoria del tablero con una casilla de tipo 2
   * y le añade la clase `square--new`.
  */
  fillSquare() {
    const row = Math.floor(Math.random() * this.size),
      col = Math.floor(Math.random() * this.size),
      squareValue = this.boardValues[row][col];

    if (squareValue === 0) {
      this.setSquare(row, col, 2);
      this.addNewClass(row, col);
    } else this.fillSquare();
  }

  /**
   * Actualiza los valores de la casilla `[row, col]` del tablero con
   * el valor `value`.
   * @param {*} row Fila de la casilla a actualizar
   * @param {*} col Columna de la casilla a actualizar
   * @param {*} value Nuevo valor de la casilla a actualizar
   */
  setSquare(row, col, value) {
    const square = this.board[row][col];

    this.boardValues[row][col] = value;
    square.innerHTML = value !== 0 ? value : "";
    square.classList = `square square--${value}`;
  }

  /**
   * Añade la clase `square--new` a la casilla `[row, col]` del tablero,
   * eliminándola de la casilla que la tuviera anteriormente.
   * @param {*} row Fila de la casilla a actualizar
   * @param {*} col Columna de la casilla a actualizar
   */
  addNewClass(row, col) {
    const square = this.board[row][col];

    if (this.newestSquare !== null) {
      this.newestSquare.classList.remove("square--new");

      // Si la casilla a la que vamos a añadir la clase se encuentra en la
      // misma posición que la que la tenía anteriormente, debemos de
      // reiniciar la animación (https://betterprogramming.pub/how-to-restart-a-css-animation-with-javascript-and-what-is-the-dom-reflow-a86e8b6df00f)
      if (this.newestSquare === square) {
        void square.offsetWidth;
      }
    }
    square.classList.add("square--new");
    this.newestSquare = square;
  }

  /** 
   * Realiza un movimiento hacia la derecha
  */
  moveRight() {
    this.move("R");
  }
  /** 
   * Realiza un movimiento hacia la izquierda
  */
  moveLeft() {
    this.move("L");
  }
  /** 
   * Realiza un movimiento hacia arriba
  */
  moveUp() {
    this.move("U");
  }
  /** 
   * Realiza un movimiento hacia abajo
  */
  moveDown() {
    this.move("D");
  }

  /**
   * Realiza un movimiento en la dirección indicada por `dir`.
   * @param {*} dir "U": up, "L": left, "R": right, "D": down
   * @param {*} combine Si es `true`, se realiza una combinación de casillas tras el movimiento
   */
  move(dir, combine = true) {
    let moved = false;
    const isHorizontal = ["R", "L"].includes(dir),
      vectors = isHorizontal ? this.boardValues : transpose(this.boardValues);

    for (const [i, vector] of vectors.entries()) {
      let newVector = vector.filter((n) => n);
      const missingValues = Array(this.size - newVector.length).fill(0);
      newVector = ["R", "D"].includes(dir)
        ? missingValues.concat(newVector)
        : newVector.concat(missingValues);

      for (const [j, value] of vector.entries()) {
        const newValue = newVector[j],
          [row, col] = isHorizontal ? [i, j] : [j, i];

        if (value !== newValue) {
          this.setSquare(row, col, newValue);
          moved = true;
        }
      }
    }

    if (combine) {
      const combined = this.combineVectors(dir);
      if (moved || combined) {
        this.fillSquare();
        this.updateColors();

        if (this.isEndgame) {
          localStorage.clear();
        } else {
          this.save();
        }
      }
    }
  }

  // Combines rows or columns after each move
  /**
   * Combina las casillas por filas o columnas, en los 2 posibles sentidos.
   * @param {*} dir Indica la dirección en la que vamos a combinar
   * @returns 
   */
  combineVectors(dir) {
    let combined = false;
    const isHorizontal = ["R", "L"].includes(dir),
      [start, end, step] = ["L", "U"].includes(dir)
        ? [0, this.size - 1, 1]
        : [this.size - 1, 0, -1];

    for (let i = 0; i < this.size; i++) {
      for (let j = start; j !== end; j += step) {
        const [row, col] = isHorizontal ? [i, j] : [j, i],
          [nextRow, nextCol] = isHorizontal ? [i, j + step] : [j + step, i],
          value = this.boardValues[row][col],
          nextValue = this.boardValues[nextRow][nextCol];

        if (value !== 0 && value === nextValue) {
          this.setSquare(row, col, value * 2);
          this.setSquare(nextRow, nextCol, 0);
          this.score += value * 2;
          combined = true;
        }
      }
    }

    if (combined) {
      this.move(dir, false);
    }
    return combined;
  }

  /** 
   * Actualiza los colores de cada casilla del tablero si `this.colors`
   * fue definido al crear el objeto Game.
  */
  updateColors() {
    if (this.colors === null) {
      return;
    }

    for (let row = 0; row < this.size; row++) {
      for (let col = 0; col < this.size; col++) {
        const square = this.board[row][col],
          value = this.boardValues[row][col],
          colorIndex = Math.log2(value) - 1;

        square.style.backgroundColor =
          value !== 0 ? this.colors[colorIndex] : null;
      }
    }
  }

  // --------------------------------------------------------------------
  // TEST

  /**
   * Función para testear el estado de victoria.
   */
  testWin() {
    const boardValues = [];
    for (let i = 0; i < this.size; i++) {
      const vs = [];
      for (let j = 0; j < this.size; j++) {
        const v = 2 ** (this.size * i + j + 1);
        vs.push(v <= 2048 ? v : 0);
      }
      boardValues.push(vs);
    }
    this.container.innerHTML = "";
    this.boardValues = boardValues;
    this.generateBoard();
    this.updateColors();
  }
}

// ####################################################################

/**
 * Transpone la matriz de entrada.
 * @param {*} M Matriz a transponer
 * @returns Matriz `M` transpuesta
 */
function transpose(M) {
  return M[0].map((_, i) => M.map((row) => row[i]));
}
