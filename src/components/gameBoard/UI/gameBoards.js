import OneBoard from "./oneBoard";

import "./gameBoards.css";

const GameBoards = () => {
  const gameBoards = document.createElement("div");
  gameBoards.classList.add("gameboards");

  const player1Board = OneBoard("Player 1");
  player1Board.id = "player1-board";

  const player2Board = OneBoard("Computer");
  player2Board.id = "player2-board";

  gameBoards.appendChild(player1Board);
  gameBoards.appendChild(player2Board);

  return gameBoards;
};

export default GameBoards;
