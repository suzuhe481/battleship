import gameTitle from "./components/gameTitle/gameTitle";
import startGameButton from "./components/startGameButton/startGameButton";
import pickDifficultyButtons from "./components/difficultyButtons/pickDifficultyButtons";
import rotateShipButton from "./components/rotateShipButton/rotateShipButton";
import playAgainButton from "./components/playAgainButton/playAgainButton";
import gameRules from "./components/gameRules/gameRules";
import GameBoards from "./components/gameBoard/UI/gameBoards";

import "./style.css";
import "./reset.css";

const gameTitleContainer = gameTitle();
document.body.appendChild(gameTitleContainer);

var gameMessageContainer = document.createElement("div");
gameMessageContainer.id = "game-message-container";
var gameTurnStatus = document.createElement("p");
gameTurnStatus.id = "game-turn-status";
var gameMessage = document.createElement("p");
gameMessage.id = "game-message";
gameMessage.innerHTML = "Welcome to Battleship.";
gameMessageContainer.appendChild(gameTurnStatus);
gameMessageContainer.appendChild(gameMessage);
document.body.appendChild(gameMessageContainer);

const gameButtonContainer = document.createElement("div");
gameButtonContainer.id = "game-button-container";
gameButtonContainer.appendChild(startGameButton());
gameButtonContainer.appendChild(pickDifficultyButtons());
gameButtonContainer.appendChild(rotateShipButton());
gameButtonContainer.appendChild(playAgainButton());
document.body.appendChild(gameButtonContainer);

const gameBoardsContainer = document.createElement("div");
gameBoardsContainer.id = "gameboards-container";
document.body.appendChild(gameBoardsContainer);

gameBoardsContainer.appendChild(GameBoards());

document.body.appendChild(gameRules());
