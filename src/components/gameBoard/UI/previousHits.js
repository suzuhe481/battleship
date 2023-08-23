import "./previousHits.css";

const previousHits = (name) => {
  const prevHits = document.createElement("div");
  prevHits.classList.add("previous-hits");

  const listOfHits = document.createElement("ul");
  listOfHits.classList.add("list");

  if (name === "Player 1") {
    listOfHits.id = "player1-chart";
  } else {
    listOfHits.id = "player2-chart";
  }

  const playerName = document.createElement("li");
  playerName.classList.add("player-name");
  playerName.innerHTML = name + " Guesses";

  listOfHits.appendChild(playerName);
  prevHits.appendChild(listOfHits);

  return prevHits;
};

export default previousHits;
