import CreateHitIcon from "../../gameBoard/UI/hitIcon";
import CreateMissIcon from "../../gameBoard/UI/missIcon";

import GameBoards from "../../gameBoard/UI/gameBoards";

import * as player1Funcs from "./player1/player1";
import * as compFuncs from "./computer/computer";

const Player = require("../../player/player");

var player1 = Player("Player 1");
var player2 = Player("Computer");

var currPlayer = player1;
var enemyPlayer = player2;

var horizontal = true;
var currentShipPlacement = "carrier";
var currentShipLength = 5;

var player1Ships = {};
var player2Ships = {};

// Debug
const timeBetweenTurns = 200; // 1000
const timeAddedOnShipDestroyed = 200; // 1000

// Debug
// Place ships vertically starting at [C, 3] and
// go right for this test
var isFirstCompGuess = true;
var firstGuess = ["E", 5];

// Variables for realistic difficulty
var difficultyOptions = {
  realisticDifficlty: true,
  huntMode: false,
  prevHits: [],
  huntDirection: "",
  isHuntDirectionReversed: false,
  isLastAttackHit: false,
  guessRight: false,
  guessBelow: false,
  guessLeft: false,
  guessAbove: false,
};

// var realisticDifficlty = true;
// var huntMode = false;
// var prevHits = [];
// var huntDirection = "";
// var isHuntDirectionReversed = false;
// var isLastAttackHit = false;
// var guessRight = false;
// var guessBelow = false;
// var guessLeft = false;
// var guessAbove = false;

// Allows the enemy board to be clicked.
const enableEnemyBoard = () => {
  var turnStatus = document.getElementById("game-turn-status");
  turnStatus.style.display = "block";
  turnStatus.innerHTML = "";
  turnStatus.innerHTML = `It is ${currPlayer.name}'s turn.`;

  // Player 1 turn - Turn on enemy board.
  if (currPlayer.name === "Player 1") {
    var p2Cells = "#player2-board > .cell.playable-cell";
    var playableCells = document.querySelectorAll(p2Cells);

    // "active" class enables color change on hover.
    playableCells.forEach((cell) => {
      cell.classList.add("active");
      cell.addEventListener("click", runAttack);
    });
  }
  // Computer turn - Have computer attack
  else {
    if (difficultyOptions.realisticDifficlty) {
      var computerAttack = compFuncs.getRealisticComputerAttack(
        difficultyOptions,
        enemyPlayer
      );
      // Debug if statement
      if (isFirstCompGuess) {
        computerAttack = firstGuess;
        isFirstCompGuess = false;
      }
      runAttack(computerAttack);
    } else {
      var computerAttack = compFuncs.getRandomComputerAttack(enemyPlayer);
      runAttack(computerAttack);
    }
  }
};

// Disables the enemy board from being clicked.
const disableEnemyBoard = () => {
  if (enemyPlayer.name === "Player 1") {
    var p1Cells = "#player1-board > .cell.playable-cell";
    var playableCells = document.querySelectorAll(p1Cells);
  } else {
    var p2Cells = "#player2-board > .cell.playable-cell";
    var playableCells = document.querySelectorAll(p2Cells);
  }

  playableCells.forEach((cell) => {
    cell.classList.remove("active");
    cell.removeEventListener("click", runAttack);
  });
};

// Attacks based on cell clicked.
const runAttack = (event) => {
  disableEnemyBoard();

  // Player 1 turn
  if (currPlayer.name === "Player 1") {
    // Retrieving attack coordinates
    var letter = event.target.dataset.letter;
    var number = parseInt(event.target.dataset.number);
    var coordinates = [letter, number];

    var cellElement = event.target;
  }
  // Computer turn
  // event is an array of the position
  else {
    // Retrieving attack coordinates
    var pos = event;
    var letter = pos[0];
    var number = pos[1];
    var coordinates = [letter, number];

    var cellElement = player1Funcs.getPlayer1CellElementFromArray(coordinates);
  }

  setGameMessage("");

  // Results is null if miss.
  // Results is hit ship object if hit.
  var results = enemyPlayer.board.receiveAttack(coordinates);

  // Displays attack results
  // Attack was a miss
  if (results === null) {
    setGameMessage(`Attack at [${coordinates}] missed.`);

    // Adjusting variables for realistic difficulty
    if (currPlayer.name === "Computer") {
      difficultyOptions.isLastAttackHit = false;
    }

    var missIcon = CreateMissIcon();
    cellElement.appendChild(missIcon);
    cellElement.classList.remove("playable-cell");
  }
  // Attack was a hit
  else {
    setGameMessage(`Attack at [${coordinates}] hit!`);

    // Adjusting variables for realistic difficulty
    if (currPlayer.name === "Computer") {
      difficultyOptions.huntMode = true;
      difficultyOptions.isLastAttackHit = true;
      difficultyOptions.prevHits.push(coordinates);
    }

    var hitIcon = CreateHitIcon();
    cellElement.appendChild(hitIcon);
    cellElement.classList.remove("playable-cell");

    // Checks is ship was sunk
    if (results.isSunk()) {
      setGameMessage(`\n The ${results.name} was sunk!`);

      // Adjusting variables for realistic difficulty
      if (currPlayer.name === "Computer") {
        difficultyOptions.huntDirection = "";
        difficultyOptions.guessRight = false;
        difficultyOptions.guessBelow = false;
        difficultyOptions.guessLeft = false;
        difficultyOptions.guessAbove = false;
        // isLastAttackHit is set to false to search surrounding cells
        // from the last previous hit before sinking the ship.
        difficultyOptions.isLastAttackHit = false;

        // Remove sunk ship's locations from prevHits
        removeSunkShipFromPrevHits(results);

        // If prevHits array is empty
        if (difficultyOptions.prevHits.length === 0) {
          difficultyOptions.huntMode = false;
        }
      }
    }

    // Checks game win condition
    if (enemyPlayer.board.allShipsSunk()) {
      gameWon();
      return;
    }
  }

  // Switches player after a second
  setTimeout(function () {
    if (results !== null && results.isSunk()) {
      setTimeout(function () {
        setGameMessage("");
        switchPlayers();
        enableEnemyBoard();
      }, timeBetweenTurns);
    } else {
      setGameMessage("");
      switchPlayers();
      enableEnemyBoard();
    }
  }, timeAddedOnShipDestroyed);
};

// Switches current player
const switchPlayers = () => {
  var temp = currPlayer;
  currPlayer = enemyPlayer;
  enemyPlayer = temp;
};

// Displays winning message.
const gameWon = () => {
  disableEnemyBoard();

  revealEnemyShips();

  var turnStatus = document.getElementById("game-turn-status");
  turnStatus.style.display = "none";

  setGameTurnStatus(`${currPlayer.name} Wins!`);

  var resetButton = document.getElementById("play-again-button");
  resetButton.style.display = "block";
};

// Starts the game and resets cells to starting positions.
const gameStart = () => {
  setGameMessage("");

  var rotateButton = document.getElementById("rotate-ship-button");
  rotateButton.style.display = "none";

  player1Funcs.removeAllPlayer1CellEventListeners();
  player1Funcs.setAllPlayer1CellsToDefaultClasses();

  enableEnemyBoard();
};

// Resets to start a new game.
const resetGame = () => {
  // New player objects
  player1 = Player("Player 1");
  player2 = Player("Computer");

  // Resets current player
  currPlayer = player1;
  enemyPlayer = player2;

  // Empties ship locations and gets new ship locations.
  player1Ships = {};
  player2Ships = {};

  // Resets rotate direction to horizontal.
  horizontal = true;

  // Displays rotate button.
  var rotateButton = document.getElementById("rotate-ship-button");
  rotateButton.style.display = "block";
  rotateButton.innerHTML = "Rotate Ship - Horizontal";

  // Creates new game boards
  var gameBoardsContainer = document.getElementById("gameboards-container");
  gameBoardsContainer.innerHTML = "";
  gameBoardsContainer.appendChild(GameBoards());

  // Sets ship placement to carrier.
  currentShipPlacement = "carrier";
  currentShipLength = 5;

  pickShipLocations();
};

// Enables picking a location of a ship for player 1.
// The ship being placed is determined by currentShipPlacement.
const pickShipLocations = () => {
  setGameMessage(`Place your ${currentShipPlacement}`);

  switch (currentShipPlacement) {
    case "carrier":
      currentShipLength = 5;
      break;
    case "battleship":
      currentShipLength = 4;
      break;
    case "destroyer":
      currentShipLength = 3;
      break;
    case "submarine":
      currentShipLength = 3;
      break;
    case "patrol boat":
      currentShipLength = 2;
      break;
  }

  // Resets each player 1's cell's classes and eventListeners
  player1Funcs.removeAllPlayer1CellEventListeners();
  player1Funcs.setAllPlayer1CellsToDefaultClasses();

  // Labels valid and invalid cells when set in the horizontal position.
  if (horizontal) {
    var validHoriz = getValidandInvalidHorizontalCells()[0];
    var invalidHoriz = getValidandInvalidHorizontalCells()[1];

    var validHorizontalCells = validHoriz;
    var invalidHorizontalCells = invalidHoriz;

    validHorizontalCells.forEach((cell) => {
      cell.addEventListener("mouseover", highlightShips, false);
      cell.addEventListener("mouseout", highlightShips, false);
      cell.addEventListener("click", selectedShipLocation, false);
    });

    // Labels each invalid cell
    invalidHorizontalCells.forEach((cell) => {
      cell.classList.add("invalid");
    });
  }
  // Labels valid and invalid cells when set in the vertical position.
  else {
    var validVert = getValidandInvalidVerticalCells()[0];
    var invalidVert = getValidandInvalidVerticalCells()[1];

    var validVerticalCells = validVert;
    var invalidVerticalCells = invalidVert;

    validVerticalCells.forEach((cell) => {
      cell.addEventListener("mouseover", highlightShips, false);
      cell.addEventListener("mouseout", highlightShips, false);
      cell.addEventListener("click", selectedShipLocation, false);
    });

    // Labels each invalid cell
    invalidVerticalCells.forEach((cell) => {
      cell.classList.add("invalid");
    });
  }
};

// Returns true if the given cell has a ship.
// Returns false otherwise.
const isSpaceOccupied = (cell) => {
  if (cell === null) {
    return true;
  }
  if (cell.classList.contains("ship")) {
    return true;
  }

  return false;
};

// Gets valid and invalid cells for a ship can be placed on horizontally.
// Returns an array with 2 array elements.
// First - All valid cell elements for horizontal placement.
// Second - All invalid cell elements for horizontal placement.
const getValidandInvalidHorizontalCells = () => {
  var queryString = "#player1-board > .cell.playable-cell";
  var player1Cells = document.querySelectorAll(queryString);

  var validCells = [];
  var inValidCells = [];

  player1Cells.forEach((cell) => {
    switch (currentShipPlacement) {
      case "carrier":
        currentShipLength = 5;
        break;
      case "battleship":
        currentShipLength = 4;
        break;
      case "destroyer":
        currentShipLength = 3;
        break;
      case "submarine":
        currentShipLength = 3;
        break;
      case "patrol boat":
        currentShipLength = 2;
        break;
    }

    var nextRightCell = cell;
    for (var i = 0; i < currentShipLength; i++) {
      // Check horizontal cells for if space is occupied OR is on board
      if (!isSpaceOccupied(nextRightCell)) {
        nextRightCell = player1Funcs.getPlayer1RightCellElement(nextRightCell);
      } else {
        // Invalid
        inValidCells.push(cell);
        return;
      }
    }

    validCells.push(cell);
  });

  return [validCells, inValidCells];
};

// Gets valid and invalid cells for a ship can be placed on vertically.
// Returns an array with 2 array elements.
// First - All valid cell elements for vertical placement.
// Second - All invalid cell elements for vertical placement.
const getValidandInvalidVerticalCells = () => {
  var queryString = "#player1-board > .cell.playable-cell";
  var player1Cells = document.querySelectorAll(queryString);

  var validCells = [];
  var inValidCells = [];

  player1Cells.forEach((cell) => {
    switch (currentShipPlacement) {
      case "carrier":
        currentShipLength = 5;
        break;
      case "battleship":
        currentShipLength = 4;
        break;
      case "destroyer":
        currentShipLength = 3;
        break;
      case "submarine":
        currentShipLength = 3;
        break;
      case "patrol boat":
        currentShipLength = 2;
        break;
    }

    var nextBelowCell = cell;
    for (var i = 0; i < currentShipLength; i++) {
      // Check vertical cells for if space is occupied
      if (!isSpaceOccupied(nextBelowCell)) {
        nextBelowCell = player1Funcs.getPlayer1BelowCellElement(nextBelowCell);
      } else {
        // Invalid
        inValidCells.push(cell);
        return;
      }
    }

    validCells.push(cell);
  });

  return [validCells, inValidCells];
};

// Adds a class to the valid ship cells.
const highlightShips = (event) => {
  var currCell = event.target;

  currCell.classList.toggle("highlight");

  for (var i = 1; i < currentShipLength; i++) {
    if (horizontal) {
      currCell = player1Funcs.getPlayer1RightCellElement(currCell);
      currCell.classList.toggle("highlight");
    } else {
      currCell = player1Funcs.getPlayer1BelowCellElement(currCell);
      currCell.classList.toggle("highlight");
    }
  }
};

// Sets game message text.
const setGameMessage = (message) => {
  var messageBox = document.getElementById("game-message");

  messageBox.innerHTML = "";
  messageBox.innerHTML = message;
};

// Sets the game turn status.
const setGameTurnStatus = (message) => {
  var gameTurnBox = document.getElementById("game-turn-status");

  gameTurnBox.innerHTML = "";
  gameTurnBox.innerHTML = message;
};

// Places and stores a ship on a valid click.
// Stores ship location on a valid click.
const selectedShipLocation = (event) => {
  var location = [];
  player1Funcs.setAllPlayer1CellsToDefaultClasses();

  var cell = event.target;

  for (var i = 0; i < currentShipLength; i++) {
    var currCellLetter = getCellLetter(cell);
    var currCellNumber = getCellNumberAsInt(cell);
    var coordinates = [currCellLetter, currCellNumber];
    var cell = player1Funcs.getPlayer1CellElementFromArray(coordinates);

    cell.classList.add("ship");
    location.push([currCellLetter, currCellNumber]);

    // If ship is horizontal, get right cell.
    // If vertical, get below cell.
    if (horizontal) {
      cell = player1Funcs.getPlayer1RightCellElement(cell);
    } else {
      cell = player1Funcs.getPlayer1BelowCellElement(cell);
    }
  }

  storeShipAndSwitchOrStartGame(location);
};

// Stores current ship in player1 object and goes to next ship,
// Or starts game if last ship placed was the patrol boat.
const storeShipAndSwitchOrStartGame = (shipLocation) => {
  switch (currentShipPlacement) {
    case "carrier":
      player1Ships.carrier = shipLocation;
      currentShipPlacement = "battleship";

      pickShipLocations();
      break;
    case "battleship":
      player1Ships.battleship = shipLocation;
      currentShipPlacement = "destroyer";

      pickShipLocations();
      break;
    case "destroyer":
      player1Ships.destroyer = shipLocation;
      currentShipPlacement = "submarine";

      pickShipLocations();

      break;
    case "submarine":
      player1Ships.submarine = shipLocation;
      currentShipPlacement = "patrol boat";

      pickShipLocations();
      break;

    case "patrol boat":
      player1Ships["patrol boat"] = shipLocation;
      currentShipPlacement = null;

      player2Ships = compFuncs.placeRandomComputerShips();

      // Debug
      console.log(player2Ships);

      placeShips(player1Ships, player2Ships);

      gameStart();
      break;
  }
};

// Given a cell element, returns it's Letter as a String.
const getCellLetter = (cell) => {
  return cell.dataset.letter;
};
// Given a cell element, returns it's Number as an Int.
const getCellNumberAsInt = (cell) => {
  return parseInt(cell.dataset.number);
};

// Given the results of the sunk ship,
// Removes the sunk ship's location from the prevHits array.
const removeSunkShipFromPrevHits = (results) => {
  var shipLocation = results.location;

  var newPrevHits = [];

  for (var i = 0; i < difficultyOptions.prevHits.length; i++) {
    for (var j = 0; j < shipLocation.length; j++) {
      if (areArraysEqual(difficultyOptions.prevHits[i], shipLocation[j])) {
        break;
      } else if (j === shipLocation.length - 1) {
        newPrevHits.push(difficultyOptions.prevHits[i]);
      }
    }
  }

  difficultyOptions.prevHits = newPrevHits;
};

// Returns an array with a position on the board.
const getRandomPosition = () => {
  const characters = "ABCDEFGHIJ";
  var letter = characters.charAt(Math.floor(Math.random() * characters.length));

  var number = Math.floor(Math.random() * 10) + 1;

  return [letter, number];
};

// Returns true if the 2 arrays are equal.
const areArraysEqual = (arr1, arr2) => {
  if (JSON.stringify(arr1) === JSON.stringify(arr2)) {
    return true;
  }

  return false;
};

// Reveals the enemy ships.
const revealEnemyShips = () => {
  var enemy;
  // Gets the computer player.
  if (player1.name === "Computer") {
    enemy = player1;
  } else {
    enemy = player2;
  }

  // Initializing variable.
  var allShipLocations = [];

  // Gets the locations for every ship.
  for (var ship of enemy.board.shipCollection) {
    allShipLocations.push(ship.location);
  }

  // Flattens shipLocations into a 1D array.
  allShipLocations = allShipLocations.flat();

  for (var i = 0; i < allShipLocations.length; i++) {
    var cell = compFuncs.getComputerCellFromArray(allShipLocations[i]);
    cell.classList.add("ship");
  }
};

// Placing ships for player1 and player2 on the board.
const placeShips = (player1Ships, player2Ships) => {
  // Player 1 ship placement
  player1.board.placeShip("carrier", player1Ships.carrier);
  player1.board.placeShip("battleship", player1Ships.battleship);
  player1.board.placeShip("destroyer", player1Ships.destroyer);
  player1.board.placeShip("submarine", player1Ships.submarine);
  player1.board.placeShip("patrol boat", player1Ships["patrol boat"]);

  // Player 2 ship placement
  player2.board.placeShip("carrier", player2Ships.carrier);
  player2.board.placeShip("battleship", player2Ships.battleship);
  player2.board.placeShip("destroyer", player2Ships.destroyer);
  player2.board.placeShip("submarine", player2Ships.submarine);
  player2.board.placeShip("patrol boat", player2Ships["patrol boat"]);
};

// Updates the horizontal variable.
// Restarts the ship placement methods depending on which is the current ship being placed.
const rotate = () => {
  var button = document.getElementById("rotate-ship-button");

  if (horizontal) {
    button.innerHTML = "Rotate Ship - Vertical";
    horizontal = false;
  } else {
    button.innerHTML = "Rotate Ship - Horizontal";
    horizontal = true;
  }

  // Back to picking ship
  pickShipLocations();
};

export {
  rotate,
  pickShipLocations,
  resetGame,
  highlightShips,
  selectedShipLocation,
  getRandomPosition,
  areArraysEqual,
};
