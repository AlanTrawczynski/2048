class Game {
  constructor(container) {
    this.container = container;
    this.isGameover = false;
    this.boardValues = null;
    this.board = null;
    this.score = null;
    this.size = null;

    const isSaved = localStorage.getItem("boardValues") === null;
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
    this.fillSquare();
    this.fillSquare();
    this.save();
  }

  // Generates a board using boardValues data
  generateBoard() {
    this.board = this.boardValues.map((row) =>
      row.map((value) => {
        const square = document.createElement("div");
        square.innerHTML = value !== 0 ? value : "";
        this.container.appendChild(square);
        return square;
      })
    );
  }

  // Randomly fills an empty position (square) on the board
  fillSquare() {
    const row = Math.floor(Math.random() * this.size),
      col = Math.floor(Math.random() * this.size),
      squareValue = this.boardValues[row][col];

    if (squareValue === 0) {
      this.setSquare(row, col, 2, true);
    } else this.fillSquare();
  }

  // Updates a single square of board with the given value
  setSquare(row, col, value) {
    this.boardValues[row][col] = value;
    this.board[row][col].innerHTML = value !== 0 ? value : "";
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
        this.checkGameover();
        this.save();
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

        // console.log(neighbors, current);
        if (current === 0 || neighbors.includes(current)) {
          return;
        }
      }
    }

    this.isGameover = true;
    localStorage.removeItem("boardValues");
    localStorage.removeItem("score");
  }
}

// Transposes the input matrix
function transpose(M) {
  return M[0].map((_, i) => M.map((row) => row[i]));
}
