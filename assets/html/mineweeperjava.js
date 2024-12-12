const boardSize = 10;
const numMines = 20;
let gameBoard = [];
let revealedCells = 0;
let gameOver = false;

const gameBoardElement = document.getElementById('game-board');
const resetButton = document.getElementById('reset-button');

// Initialize the game
function initGame() {
  gameBoard = [];
  revealedCells = 0;
  gameOver = false;
  gameBoardElement.innerHTML = '';
  const minePositions = generateMines();

  // Create the board
  for (let y = 0; y < boardSize; y++) {
    const row = [];
    for (let x = 0; x < boardSize; x++) {
      const cell = {
        x,
        y,
        mine: minePositions.includes(`${x}-${y}`),
        revealed: false,
        neighboringMines: 0,
      };
      row.push(cell);
    }
    gameBoard.push(row);
  }

  // Calculate neighboring mines for each cell
  calculateNeighboringMines();

  // Create the HTML grid
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cellElement = document.createElement('div');
      cellElement.classList.add('cell');
      cellElement.addEventListener('click', () => handleCellClick(x, y));
      gameBoardElement.appendChild(cellElement);
    }
  }
}

// Generate random positions for mines
function generateMines() {
  const positions = [];
  while (positions.length < numMines) {
    const x = Math.floor(Math.random() * boardSize);
    const y = Math.floor(Math.random() * boardSize);
    const position = `${x}-${y}`;
    if (!positions.includes(position)) {
      positions.push(position);
    }
  }
  return positions;
}

// Calculate neighboring mines for each cell
function calculateNeighboringMines() {
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      if (!gameBoard[y][x].mine) {
        gameBoard[y][x].neighboringMines = countNeighboringMines(x, y);
      }
    }
  }
}

// Count neighboring mines around a given cell
function countNeighboringMines(x, y) {
  let mineCount = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize && gameBoard[ny][nx].mine) {
        mineCount++;
      }
    }
  }
  return mineCount;
}

// Handle cell click
function handleCellClick(x, y) {
  if (gameOver || gameBoard[y][x].revealed) return;

  const cell = gameBoard[y][x];
  cell.revealed = true;
  const cellElement = gameBoardElement.children[y * boardSize + x];
  revealedCells++;

  // If mine is clicked, game over
  if (cell.mine) {
    cellElement.classList.add('mine');
    alert('Game Over! You hit a mine.');
    gameOver = true;
    revealAllCells();
    return;
  }

  // Reveal the cell
  cellElement.classList.add('revealed');
  if (cell.neighboringMines === 0) {
    revealAdjacentCells(x, y);
  } else {
    cellElement.textContent = cell.neighboringMines > 0 ? cell.neighboringMines : '';
  }

  // Check for win condition
  if (revealedCells === boardSize * boardSize - numMines) {
    alert('You Win!');
    gameOver = true;
  }
}

// Reveal adjacent cells if there are no neighboring mines
function revealAdjacentCells(x, y) {
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if (nx >= 0 && ny >= 0 && nx < boardSize && ny < boardSize && !gameBoard[ny][nx].revealed) {
        handleCellClick(nx, ny);
      }
    }
  }
}

// Reveal all cells (used for game over or win)
function revealAllCells() {
  for (let y = 0; y < boardSize; y++) {
    for (let x = 0; x < boardSize; x++) {
      const cell = gameBoard[y][x];
      const cellElement = gameBoardElement.children[y * boardSize + x];
      cell.revealed = true;
      if (cell.mine) {
        cellElement.classList.add('mine');
      } else {
        cellElement.classList.add('revealed');
        if (cell.neighboringMines > 0) {
          cellElement.textContent = cell.neighboringMines;
        }
      }
    }
  }
}

// Reset the game
resetButton.addEventListener('click', initGame);

// Start the game when the page loads
initGame();
