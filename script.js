const game = { turnPlayer: 0 };
let cells;

function getCellCoordinates(cell) {
  const index = cells.indexOf(cell);
  return { row: Math.floor(index / 3), column: index % 3 };
}

function initializeBoard() {
  game.board = [[], [], []];
}

function recordTurn(coordinates) {
  game.board[coordinates.row][coordinates.column] = game.turnPlayer;
  game.changedCoordinates = coordinates;
}

function toggleTurnPlayer() {
  game.turnPlayer = game.turnPlayer === 0 ? 1 : 0;
}

function onCellClicked(e) {
  const coordinates = getCellCoordinates(e.target);
  recordTurn(coordinates);
  toggleTurnPlayer();
}

function registerCellClickListeners() {
  cells.forEach((cell) =>
    cell.addEventListener('click', onCellClicked, { once: true })
  );
}

document.addEventListener('DOMContentLoaded', () => {
  initializeBoard();
  cells = [...document.querySelectorAll('.hash-board span')];
  registerCellClickListeners();
});
