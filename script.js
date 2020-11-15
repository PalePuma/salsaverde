let cells;

function getCellCoordinates(cell) {
  const index = cells.indexOf(cell);
  return { row: Math.floor(index / 3), column: index % 3 };
}

function onCellClicked(e) {
  const coordinates = getCellCoordinates(e.target);
}

function registerCellClickListeners() {
  cells.forEach((cell) =>
    cell.addEventListener('click', onCellClicked, { once: true })
  );
}

document.addEventListener('DOMContentLoaded', () => {
  cells = [...document.querySelectorAll('.hash-board span')];
  registerCellClickListeners();
});
