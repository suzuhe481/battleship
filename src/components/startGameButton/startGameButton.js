import { pickShipLocations } from "../game/functions/game";

import "./startGameButton.css";

const startTheGame = () => {
  // Hides the Start Game button.
  const button = document.getElementById("start-game-button");
  button.style.display = "none";

  // Display the difficulty buttons
  const difficultyButtons = document.getElementById("difficulty-container");
  difficultyButtons.style.display = "block";
};

const startGameButton = () => {
  const button = document.createElement("button");
  button.id = "start-game-button";
  button.innerHTML = "Start Game";

  button.onclick = startTheGame;

  return button;
};

export default startGameButton;
