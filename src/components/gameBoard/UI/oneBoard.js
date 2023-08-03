import Cell from "./cell";

import "./oneBoard.css";

const numToLetter = (num) => {
  return String.fromCharCode(num + 64);
};

const OneBoard = () => {
  const board = document.createElement("div");
  board.classList.add("board");

  for (var row = 0; row < 11; row++) {
    for (var col = 0; col < 11; col++) {
      // If first cell, blank
      if (row === 0 && col === 0) {
        board.appendChild(Cell("/"));
      }
      // If starting row, letter
      else if (row === 0) {
        board.appendChild(Cell(numToLetter(col)));
      }
      // If start of a row, number
      else if (col === 0) {
        board.appendChild(Cell(row));
      }
      // Else blank
      else {
        board.appendChild(Cell());
      }
    }
  }

  return board;
};

export default OneBoard;
