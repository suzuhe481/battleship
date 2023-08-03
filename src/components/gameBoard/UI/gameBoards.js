import OneBoard from "./oneBoard";

import "./gameBoards.css";

const GameBoards = () => {
  const gameBoards = document.createElement("div");
  gameBoards.classList.add("gameboards");

  const player1Board = OneBoard();
  player1Board.id = "player1";

  const player2Board = OneBoard();
  player2Board.id = "player2";

  gameBoards.appendChild(player1Board);
  gameBoards.appendChild(player2Board);

  return gameBoards;
};

export default GameBoards;
