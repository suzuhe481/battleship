import updateBoard from "./updateBoard";

const Player = require("../../player/player");

const player1 = Player("Player 1");
const player2 = Player("Computer");

const gameStart = (player1, player2) => {
  const switchPlayers = () => {
    var temp = currPlayer;
    currPlayer = enemy;
    enemy = temp;
  };

  console.log("game started");

  var currPlayer = player1;
  var enemy = player2;

  // console.log("curr", currPlayer);
  // console.log("enemy", enemy);

  // switchPlayers();

  // console.log("curr", currPlayer);
  // console.log("enemy", enemy);

  var isGameWon = false;
  // Game logic goes here
  while (!isGameWon) {
    // Current player picks a coordinate
    // Check if valid coordinate
    // If not, pick new coordinate
    // If hit
    //   Update board and ship
    // If miss
    //   Update board
    // If allShipsSunk()
    //     isGameWon = true;
  }

  // Find a way to affect the dom from here
  // var boardPiece = document.querySelector(".cell.non-playable");

  // Update board
  // updateBoard(player1.board, player2.board, x);
  // console.log(x);
};

const placeShips = (player1Ships, player2Ships) => {
  // Player 1 ship placement
  player1.board.placeShip("carrier", player1Ships.carrier);
  player1.board.placeShip("battleship", player1Ships.battleship);
  player1.board.placeShip("destroyer", player1Ships.destroyer);
  player1.board.placeShip("submarine", player1Ships.submarin);
  player1.board.placeShip("patrol boat", player1Ships["patrol boat"]);

  // Player 2 ship placement
  player2.board.placeShip("carrier", player2Ships.carrier);
  player2.board.placeShip("battleship", player2Ships.battleship);
  player2.board.placeShip("destroyer", player2Ships.destroyer);
  player2.board.placeShip("submarine", player2Ships.submarin);
  player2.board.placeShip("patrol boat", player2Ships["patrol boat"]);

  console.log("ships placed");
};

const Game = () => {
  console.log("start");

  // Test location objects
  var player1Ships = {
    carrier: [
      ["a", 1],
      ["a", 2],
      ["a", 3],
      ["a", 4],
      ["a", 5],
    ],
    battleship: [
      ["c", 5],
      ["d", 5],
      ["e", 5],
      ["f", 5],
    ],
    destroyer: [
      ["f", 7],
      ["g", 7],
      ["h", 7],
    ],
    submarine: [
      ["i", 8],
      ["i", 9],
      ["i", 10],
    ],
    "patrol boat": [
      ["b", 9],
      ["c", 9],
    ],
  };

  var player2Ships = {
    carrier: [
      ["f", 1],
      ["g", 1],
      ["h", 1],
      ["i", 1],
      ["j", 1],
    ],
    battleship: [
      ["a", 7],
      ["a", 8],
      ["a", 9],
      ["a", 10],
    ],
    destroyer: [
      ["c", 6],
      ["d", 6],
      ["e", 6],
    ],
    submarine: [
      ["f", 8],
      ["f", 9],
      ["f", 10],
    ],
    "patrol boat": [
      ["a", 3],
      ["b", 3],
    ],
  };

  placeShips(player1Ships, player2Ships);

  gameStart(player1, player2);
};

export default Game;
