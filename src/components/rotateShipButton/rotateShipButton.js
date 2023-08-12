import { rotate } from "../game/functions/game";

import "./rotateShipButton.css";

const rotateShipButton = () => {
  const button = document.createElement("button");
  button.id = "rotate-ship-button";
  button.innerHTML = "Rotate Ship - Horizontal";

  button.onclick = rotate;

  return button;
};

export default rotateShipButton;
