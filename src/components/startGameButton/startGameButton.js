import { pickShipLocations } from "../game/functions/game";

import "./startGameButton.css";

const startTheGame = () => {
  // Hides the Start Game button.
  const button = document.getElementById("start-game-button");
  button.style.display = "none";

  // Displays the Rotate Ship button
  const rotateButton = document.getElementById("rotate-ship-button");
  rotateButton.style.display = "block";

  // First step of game. Let player1 pick ship locations.
  pickShipLocations();
};

const startGameButton = () => {
  const button = document.createElement("button");
  button.id = "start-game-button";
  button.innerHTML = "Start Game";

  button.onclick = startTheGame;

  return button;
};

export default startGameButton;
