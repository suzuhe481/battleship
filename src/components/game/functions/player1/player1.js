import { highlightShips, selectedShipLocation } from "../game";

// Gets player1's cell with the given array.
// Array is a letter and number.
const getPlayer1CellElementFromArray = (posArr) => {
  var letter = posArr[0];
  var number = posArr[1];

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

export {
  getPlayer1CellElementFromArray,
  getPlayer1RightCellElement,
  getPlayer1BelowCellElement,
  removeAllPlayer1CellEventListeners,
  setAllPlayer1CellsToDefaultClasses,
};
