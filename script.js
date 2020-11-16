const game = { turnPlayer: 0 };
const players = [{ score: 0 }, { score: 0 }];
const diagonals = [
  [
    { row: 0, column: 0 },
    { row: 1, column: 1 },
    { row: 2, column: 2 },
  ],
  [
    { row: 0, column: 2 },
    { row: 1, column: 1 },
    { row: 2, column: 0 },
  ],
];
let gamesPlayed = 0;
let cells;

function getCellCoordinates(cell) {
  const index = cells.indexOf(cell);
  return { row: Math.floor(index / 3), column: index % 3 };
}

function initializeBoard() {
  game.board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  registerCellClickListeners();
}

function recordTurn(coordinates) {
  game.board[coordinates.row][coordinates.column] = game.turnPlayer;
  game.changedCoordinates = coordinates;
}

function toggleTurnPlayer() {
  game.turnPlayer = game.turnPlayer === 0 ? 1 : 0;
}

function recordVictory() {
  players[game.turnPlayer].score += 1;
}

function startNextGame() {
  gamesPlayed += 1;
  initializeBoard();
  game.turnPlayer = gamesPlayed % 2;
}

function allEqual(array) {
  return array.every((value) => value === array[0]);
}

function includes(coordinatesList, coordinates) {
  const coordinatesEqual = (a, b) => a.row === b.row && a.column === b.column;
  return (
    coordinatesList.filter((x) => coordinatesEqual(x, coordinates)).length > 0
  );
}

function getTriples(coordinates) {
  const rowTriple = game.board[coordinates.row];
  const columnTriple = game.board.map((row) => row[coordinates.column]);
  const diagonalTriples = diagonals
    .filter((diagonal) => includes(diagonal, coordinates))
    .map((diagonal) =>
      diagonal.map((cell) => game.board[cell.row][cell.column])
    );
  return [rowTriple, columnTriple, ...diagonalTriples];
}

function inWinState() {
  const triples = getTriples(game.changedCoordinates);
  return triples.reduce((won, triple) => won || allEqual(triple), false);
}

function isBoardFull() {
  const isRowFull = (row) =>
    row.reduce((cellsFull, cell) => cellsFull && cell !== null, true);
  return game.board.reduce((rowsFull, row) => rowsFull && isRowFull(row), true);
}

function onCellClicked(e) {
  const coordinates = getCellCoordinates(e.target);
  recordTurn(coordinates);
  const isWinningTurn = inWinState();
  const gameOver = isWinningTurn || isBoardFull();
  if (gameOver) {
    if (isWinningTurn) recordVictory();
    startNextGame();
  } else {
    toggleTurnPlayer();
  }
}

function registerCellClickListeners() {
  cells.forEach((cell) =>
    cell.addEventListener('click', onCellClicked, { once: true })
  );
}

document.addEventListener('DOMContentLoaded', () => {
  cells = [...document.querySelectorAll('.hash-board span')];
  initializeBoard();
});
