import { resetGame } from "../game/functions/game";

import "./playAgainButton.css";

const playAgain = () => {
  const button = document.getElementById("play-again-button");
  button.style.display = "none";

  resetGame();
};

const playAgainButton = () => {
  const button = document.createElement("button");
  button.id = "play-again-button";
  button.innerHTML = "Play Again";

  button.onclick = playAgain;

  return button;
};
export default playAgainButton;
