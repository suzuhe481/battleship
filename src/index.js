import GameBoards from "./components/gameBoard/UI/gameBoards";

const Game = require("./components/game/game");

const gameBoardsContainer = document.createElement("div");
gameBoardsContainer.id = "gameboards-container";
document.body.appendChild(gameBoardsContainer);

gameBoardsContainer.appendChild(GameBoards());

var game = Game();

game.gameStart();
