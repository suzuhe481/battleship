import "./gameRules.css";

const gameRules = () => {
  const gameRulesContainer = document.createElement("div");
  gameRulesContainer.id = "game-rules";

  const description = document.createElement("div");
  description.classList.add("description");
  description.innerHTML =
    "The game is Battleship. The rules are simple. Place your ships, then take turns guessing where your opponent's ships are. First player to guess where all their opponent's ships are wins.";
  gameRulesContainer.appendChild(description);

  const rules = document.createElement("ul");
  rules.classList.add("rules");

  const easyRule = document.createElement("li");
  easyRule.innerHTML =
    "Easy - In this mode, the computer will guess randomly, even if they get a hit.";
  rules.appendChild(easyRule);

  const realisticRule = document.createElement("li");
  realisticRule.innerHTML =
    "Realistic - In this mode, the computer will have a smarter AI and behave similar to a human player. They will guess near places they get a hit until they sink the ship.";
  rules.appendChild(realisticRule);

  gameRulesContainer.appendChild(rules);

  return gameRulesContainer;
};

export default gameRules;
