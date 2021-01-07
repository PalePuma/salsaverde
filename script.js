let gamesPlayed = 0;
const game = { turnPlayer: 0 };
const players = [
  {
    name: {
      value: 'Player 1',
      displayElement: null,
      inputElement: null,
    },
    score: 0,
  },
  {
    name: {
      value: 'Player 2',
      displayElement: null,
      inputElement: null,
    },
    score: 0,
  },
];

let cells;
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

/*
Unicode Characters
    «
    Left-Pointing Double Angle Quotation Mark
     UTF-16: 0x00AB
    Decimal: 171

    »
    Right-Pointing Double Angle Quotation Mark
     UTF-16: 0x00BB
    Decimal: 187
*/
const toggle = {
  isExpanded: false,
  collapseCharCode: 171,
  expandCharCode: 187,
  collapseTitle: 'Hide',
  expandTitle: 'Show',
};
let footer;

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

function registerToggleClickListeners() {
  Array.from(toggle.triggerButtons).forEach((button) =>
    button.addEventListener('click', onToggleClicked)
  );
}

function registerTextInputListeners() {
  players.forEach((player) =>
    player.name.inputElement.addEventListener('input', onTextInput)
  );
}

function onTextInput(e) {
  if (e.target.name.includes('x')) players[0].name.value = e.target.value;
  else players[1].name.value = e.target.value;
  renderPills();
}

function onToggleClicked() {
  toggle.isExpanded = !toggle.isExpanded;
  renderBottomBar();
}

function renderPills() {
  players[0].name.displayElement.innerHTML = players[0].name.value;
  players[1].name.displayElement.innerHTML = players[1].name.value;
}

function renderBottomBar() {
  // toggle indicator symbol
  toggle.toggleIndicator.innerHTML = toggle.isExpanded
    ? String.fromCharCode(toggle.collapseCharCode)
    : String.fromCharCode(toggle.expandCharCode);

  // toggle indicator tooltip
  toggle.toggleIndicator.setAttribute(
    'title',
    toggle.isExpanded ? toggle.collapseTitle : toggle.expandTitle
  );

  // footer visibility animation
  footer.forEach((element) => {
    element.classList.toggle('expanded-position');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  players[0].name.displayElement = document.querySelector(
    '.x-player .player-name-text'
  );
  players[1].name.displayElement = document.querySelector(
    '.o-player .player-name-text'
  );
  players[0].name.inputElement = document.querySelector('.input-pill.x-player');
  players[1].name.inputElement = document.querySelector('.input-pill.o-player');
  cells = [...document.querySelectorAll('.hash-board span')];
  toggle.toggleIndicator = document.querySelector('.toggle-tab span');
  toggle.triggerButtons = document.getElementsByClassName('toggle-trigger');
  footer = Array.from(document.querySelector('footer').children);

  initializeBoard();
  registerToggleClickListeners();
  registerTextInputListeners();
});
