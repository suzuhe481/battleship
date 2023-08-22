import { pickShipLocations } from "../game/functions/game";

import "./pickDifficultyButtons.css";

// Easy difficulty
const startEasy = () => {
  // Hides the difficulty buttons
  const container = document.getElementById("difficulty-container");
  container.style.display = "none";

  // Displays the Rotate Ship button
  const rotateButton = document.getElementById("rotate-ship-button");
  rotateButton.style.display = "block";

  // First step of game. Let player1 pick ship locations.
  pickShipLocations("EASY");
};

// Realistic difficulty
const startRealistic = () => {
  // Hides the difficulty buttons
  const container = document.getElementById("difficulty-container");
  container.style.display = "none";

  // Displays the Rotate Ship button
  const rotateButton = document.getElementById("rotate-ship-button");
  rotateButton.style.display = "block";

  // First step of game. Let player1 pick ship locations.
  pickShipLocations("REALISTIC");
};

const pickDifficultyButtons = () => {
  const difficultyContainer = document.createElement("div");
  difficultyContainer.id = "difficulty-container";

  const easyButton = document.createElement("button");
  easyButton.classList.add("difficulty-button");
  easyButton.innerHTML = "Easy";
  easyButton.onclick = startEasy;

  const realisticButton = document.createElement("button");
  realisticButton.classList.add("difficulty-button");
  realisticButton.innerHTML = "Realistic";
  realisticButton.onclick = startRealistic;

  difficultyContainer.appendChild(easyButton);
  difficultyContainer.appendChild(realisticButton);

  return difficultyContainer;
};

export default pickDifficultyButtons;
