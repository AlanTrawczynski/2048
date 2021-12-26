class Game {
  constructor(container, colors = null) {
    this.container = container;
    this.colors = colors;
    this.isGameover = false;
    this.boardValues = null;
    this.board = null;
    this.score = null;
    this.size = null;
    this.newestSquare = null;

    const isSaved = localStorage.getItem("boardValues") !== null;
    if (isSaved) {
      this.load();
    } else {
      this.newGame(4);
    }
  }

  // Loads and initializes game stored in localStorage
  load() {
    this.boardValues = JSON.parse(localStorage.getItem("boardValues"));
    this.score = +localStorage.getItem("score");
    this.size = this.boardValues.length;
    this.generateBoard();
    this.updateColors();
    this.checkGameover();
  }

  // Saves game in localStorage
  save() {
    localStorage.setItem("boardValues", JSON.stringify(this.boardValues));
    localStorage.setItem("score", this.score);
  }

  // Creates a new game with given size
  newGame(size) {
    this.container.innerHTML = ""; // Removes all child nodes of board container
    this.isGameover = false;
    this.score = 0;
    this.size = size;
    this.boardValues = Array(size) // Set boardValues to a matrix of 0s
      .fill(0)
      .map((_) => Array(size).fill(0));

    this.generateBoard(); // Generate HTML board elements
    this.fillSquare(false);
    this.fillSquare(false);
    this.updateColors();
    this.save();
  }

  // Generates a board using boardValues data
  generateBoard() {
    this.board = this.boardValues.map((row) =>
      row.map((value) => {
        const square = document.createElement("div");
        square.innerHTML = value !== 0 ? value : "";
        square.classList.add("square", `square-${value}`);
        this.container.appendChild(square);
        return square;
      })
    );
  }

  // Randomly fills an empty position (square) on the board
  fillSquare(addNewClass = true) {
    const row = Math.floor(Math.random() * this.size),
      col = Math.floor(Math.random() * this.size),
      squareValue = this.boardValues[row][col];

    if (squareValue === 0) {
      this.setSquare(row, col, 2, addNewClass);
    } else this.fillSquare();
  }

  // Updates a single square of board with the given value
  setSquare(row, col, value, addNewClass = false) {
    const square = this.board[row][col];

    this.boardValues[row][col] = value;
    square.innerHTML = value !== 0 ? value : "";
    square.classList.remove(square.classList[1]);
    square.classList.add(`square-${value}`);

    if (this.newestSquare !== null) {
      this.newestSquare.classList.remove("square-new");
    }
    if (addNewClass) {
      if (this.newestSquare === square) {
        // https://betterprogramming.pub/how-to-restart-a-css-animation-with-javascript-and-what-is-the-dom-reflow-a86e8b6df00f
        void square.offsetWidth;
      }
      square.classList.add("square-new");
      this.newestSquare = square;
    }
  }

  moveRight() {
    this.move("R");
  }
  moveLeft() {
    this.move("L");
  }
  moveUp() {
    this.move("U");
  }
  moveDown() {
    this.move("D");
  }

  // Moves the squares in `dir` direction
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
        this.save();
        this.checkGameover();
      }
    }
  }

  // Combines rows or columns after each move
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

  checkGameover() {
    // Check for combinable squares
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
          return;
        }
      }
    }

    this.isGameover = true;
    localStorage.clear();
  }

  updateColors() {
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

  // temp
  test() {
    const boardValues = [];
    for (let i = 0; i < this.size; i++) {
      const vs = [];
      for (let j = 0; j < this.size; j++) {
        const v = 2 ** (this.size*i + j);
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

// Transposes the input matrix
function transpose(M) {
  return M[0].map((_, i) => M.map((row) => row[i]));
}
