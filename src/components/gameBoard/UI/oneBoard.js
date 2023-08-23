import Cell from "./cell";

import "./oneBoard.css";
import previousHits from "./previousHits";

const numToLetter = (num) => {
  return String.fromCharCode(num + 64);
};

const OneBoard = (playerName) => {
  const boardContainer = document.createElement("div");
  boardContainer.classList.add("board-container");

  const playerTitle = document.createElement("div");
  playerTitle.classList.add("player-title");
  playerTitle.innerHTML = playerName;

  boardContainer.appendChild(playerTitle);

  const boardAndChart = document.createElement("div");
  boardAndChart.classList.add("board-chart");

  const board = document.createElement("div");
  board.classList.add("board");

  for (var row = 0; row < 11; row++) {
    for (var col = 0; col < 11; col++) {
      // If first cell, blank
      if (row === 0 && col === 0) {
        board.appendChild(Cell("/", row, col));
      }
      // If starting row, letter
      else if (row === 0) {
        var label = col;
        board.appendChild(Cell(numToLetter(label, row, col)));
      }
      // If start of a row, number
      else if (col === 0) {
        var label = row;
        board.appendChild(Cell(label, row, col));
      }
      // Else blank
      else {
        var label = "";
        board.appendChild(Cell(label, row, col));
      }
    }
  }

  boardAndChart.appendChild(board);
  boardAndChart.appendChild(previousHits(playerName));

  boardContainer.appendChild(boardAndChart);

  return boardContainer;
};

export default OneBoard;
