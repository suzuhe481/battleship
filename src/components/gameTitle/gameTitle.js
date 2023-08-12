import "./gameTitle.css";

const gameTitle = () => {
  const gameTitle = document.createElement("div");
  gameTitle.id = "game-title";
  gameTitle.innerHTML = "BATTLESHIP";

  return gameTitle;
};

export default gameTitle;
