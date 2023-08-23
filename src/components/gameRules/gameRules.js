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
  const boldWord1 = document.createElement("span");
  boldWord1.classList.add("bold");
  boldWord1.innerHTML = "Easy";
  const text1 = document.createElement("span");
  text1.innerHTML =
    " - In this mode, the computer will guess randomly, even if they get a hit.";
  easyRule.appendChild(boldWord1);
  easyRule.appendChild(text1);
  rules.append(easyRule);

  const realisticRule = document.createElement("li");
  const boldWord2 = document.createElement("span");
  boldWord2.classList.add("bold");
  boldWord2.innerHTML = "Realistic";
  const text2 = document.createElement("span");
  text2.innerHTML =
    " - In this mode, the computer will have a smarter AI and behave similar to a human player. They will guess near places they get a hit until they sink the ship.";
  realisticRule.appendChild(boldWord2);
  realisticRule.appendChild(text2);
  rules.appendChild(realisticRule);

  gameRulesContainer.appendChild(rules);

  return gameRulesContainer;
};

export default gameRules;
