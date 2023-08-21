import { highlightShips, selectedShipLocation } from "../game";

// Gets player1's cell with the given array.
// Array is a letter and number.
const getPlayer1CellElementFromArray = (posArr) => {
  // Query requires string elements.
  var letter = String(posArr[0]);
  var number = String(posArr[1]);

  var queryString = `#player1-board > .cell.playable-cell[data-letter="${letter}"][data-number="${number}"]`;

  var cell = document.querySelector(queryString);

  return cell;
};

// Returns the cell element to the right of the given cell.
const getPlayer1RightCellElement = (currCell) => {
  var letter = currCell.dataset.letter;
  var number = currCell.dataset.number;
  var nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1);
  var coordinates = [nextLetter, number];

  var rightCell = getPlayer1CellElementFromArray(coordinates);

  return rightCell;
};

// Returns the cell element below the given cell element.
const getPlayer1BelowCellElement = (currCell) => {
  var letter = currCell.dataset.letter;
  var number = currCell.dataset.number;
  var nextNumber = (parseInt(number) + 1).toString();
  var coordinates = [letter, nextNumber];

  var belowCell = getPlayer1CellElementFromArray(coordinates);

  return belowCell;
};

// Removes every event listener for every cell in player 1's board.
const removeAllPlayer1CellEventListeners = () => {
  var queryString = "#player1-board > .cell.playable-cell";
  var player1Cells = document.querySelectorAll(queryString);

  player1Cells.forEach((cell) => {
    cell.removeEventListener("mouseover", highlightShips);
    cell.removeEventListener("mouseout", highlightShips);
    cell.removeEventListener("click", selectedShipLocation);
  });
};

// Resets Player 1's cells to default classes that do NOT have a ship placed on them.
const setAllPlayer1CellsToDefaultClasses = () => {
  var queryString = "#player1-board > .cell.playable-cell";
  var player1Cells = document.querySelectorAll(queryString);

  player1Cells.forEach((cell) => {
    cell.classList.remove("highlight");
    cell.classList.remove("invalid");
  });
};

// Given an array of a position,
// Returns an array of the position to the right.
const getRightCellArray = (pos) => {
  var letter = pos[0];
  var number = pos[1];
  var newLetter = String.fromCharCode(letter.charCodeAt(0) + 1);
  var newPos = [newLetter, number];

  return newPos;
};

// Given an array of a position,
// Returns an array of the position to the left.
const getLeftCellArray = (pos) => {
  var letter = pos[0];
  var number = pos[1];
  var newLetter = String.fromCharCode(letter.charCodeAt(0) - 1);
  var newPos = [newLetter, number];

  return newPos;
};

// Given an array of a position,
// Returns an array of the position to the below.
const getBelowCellArray = (pos) => {
  var letter = pos[0];
  var number = pos[1];
  var newNumber = parseInt(number) + 1;
  var newPos = [letter, newNumber];

  return newPos;
};

// Given an array of a position,
// Returns an array of the position to the above.
const getAboveCellArray = (pos) => {
  var letter = pos[0];
  var number = pos[1];
  var newNumber = parseInt(number) - 1;
  var newPos = [letter, newNumber];

  return newPos;
};

// Given an array of a cell's position,
// Returns true if the cell is on the board and has not been picked.
const isCellOnBoardAndNotPicked = (pos) => {
  var cellElement = getPlayer1CellElementFromArray(pos);

  // Not on board.
  if (cellElement === null) {
    return false;
  }

  // Already picked.
  if (!cellElement.classList.contains("playable-cell")) {
    return false;
  }

  return true;
};

export {
  getPlayer1CellElementFromArray,
  getPlayer1RightCellElement,
  getPlayer1BelowCellElement,
  removeAllPlayer1CellEventListeners,
  setAllPlayer1CellsToDefaultClasses,
  getRightCellArray,
  getLeftCellArray,
  getBelowCellArray,
  getAboveCellArray,
  isCellOnBoardAndNotPicked,
};
