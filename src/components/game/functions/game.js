import CreateHitIcon from "../../gameBoard/UI/hitIcon";
import CreateMissIcon from "../../gameBoard/UI/missIcon";

import GameBoards from "../../gameBoard/UI/gameBoards";

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

const timeBetweenTurns = 1000;
const timeAddedOnShipDestroyed = 1000;

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
    var computerAttack = getComputerAttack();
    runAttack(computerAttack);
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
  // // Computer turn
  else {
    // Retrieving attack coordinates
    var pos = event;
    var letter = pos[0];
    var number = pos[1];
    var coordinates = [letter, number];

    var cellElement = getPlayer1Cell(letter, number);
  }

  setGameMessage("");

  // Results is null if miss.
  // Results is hit ship object if hit.
  var results = enemyPlayer.board.receiveAttack(coordinates);

  // Displays attack results
  if (results === null) {
    setGameMessage(`Attack at [${coordinates}] missed.`);

    var missIcon = CreateMissIcon();
    cellElement.appendChild(missIcon);
    cellElement.classList.remove("playable-cell");
  } else {
    setGameMessage(`Attack at [${coordinates}] hit!`);

    var hitIcon = CreateHitIcon();
    cellElement.appendChild(hitIcon);
    cellElement.classList.remove("playable-cell");

    // Checks is ship was sunk
    if (results.isSunk()) {
      setGameMessage(`\n The ${results.name} was sunk!`);
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

  removeAllPlayer1CellEventListeners();
  setAllPlayer1CellsToDefaultClasses();

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
  player2Ships = placeRandomComputerShips();

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
  removeAllPlayer1CellEventListeners();
  setAllPlayer1CellsToDefaultClasses();

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
        nextRightCell = getRightCell(nextRightCell);
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
        nextBelowCell = getBelowCell(nextBelowCell);
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
      currCell = getRightCell(currCell);
      currCell.classList.toggle("highlight");
    } else {
      currCell = getBelowCell(currCell);
      currCell.classList.toggle("highlight");
    }
  }
};

// Gets player1's cell with the given letter and number position.
const getPlayer1Cell = (letter, number) => {
  var letter = String(letter);
  var number = String(number);

  var queryString = `#player1-board > .cell.playable-cell[data-letter="${letter}"][data-number="${number}"]`;

  var cell = document.querySelector(queryString);

  return cell;
};

// Returns the cell element to the right of the given cell.
const getRightCell = (currCell) => {
  var letter = currCell.dataset.letter;
  var number = currCell.dataset.number;
  var nextLetter = String.fromCharCode(letter.charCodeAt(0) + 1);

  var rightCell = getPlayer1Cell(nextLetter, number);

  return rightCell;
};

// Returns the cell element below the given cell element.
const getBelowCell = (currCell) => {
  var letter = currCell.dataset.letter;
  var number = currCell.dataset.number;
  var nextNumber = (parseInt(number) + 1).toString();

  var belowCell = getPlayer1Cell(letter, nextNumber);

  return belowCell;
};

// Removes every event listener for every cell in player 1's board.
const removeAllPlayer1CellEventListeners = () => {
  var queryString = "#player1-board > .cell.playable-cell";
  var player1Cells = document.querySelectorAll(queryString);

  player1Cells.forEach((cell) => {
    cell.removeEventListener("mouseover", highlightShips);
    cell.removeEventListener("mouseout", highlightShips);
    cell.removeEventListener("click", selectedShipLocation);
  });
};

// Resets Player 1's cells to default classes that do NOT have a ship placed on them.
const setAllPlayer1CellsToDefaultClasses = () => {
  var queryString = "#player1-board > .cell.playable-cell";
  var player1Cells = document.querySelectorAll(queryString);

  player1Cells.forEach((cell) => {
    cell.classList.remove("highlight");
    cell.classList.remove("invalid");
  });
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
  setAllPlayer1CellsToDefaultClasses();

  var cell = event.target;

  for (var i = 0; i < currentShipLength; i++) {
    var currCellLetter = getCellLetter(cell);
    var currCellNumber = getCellNumberAsInt(cell);
    var cell = getPlayer1Cell(currCellLetter, currCellNumber);

    cell.classList.add("ship");
    location.push([currCellLetter, currCellNumber]);

    // If ship is horizontal, get right cell.
    // If vertical, get below cell.
    if (horizontal) {
      cell = getRightCell(cell);
    } else {
      cell = getBelowCell(cell);
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

      player2Ships = placeRandomComputerShips();

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

// Picks ships for the computer opponnent player.
// Returns an object with 5 ships and their location arrays.
const placeRandomComputerShips = () => {
  var shipLocations = {};

  var carrierLocation = getSingleComputerShipLocation(5, shipLocations);
  shipLocations.carrier = carrierLocation;

  var battleshipLocation = getSingleComputerShipLocation(4, shipLocations);
  shipLocations.battleship = battleshipLocation;

  var destroyerLocation = getSingleComputerShipLocation(3, shipLocations);
  shipLocations.destroyer = destroyerLocation;

  var submarineLocation = getSingleComputerShipLocation(3, shipLocations);
  shipLocations.submarine = submarineLocation;

  var patrolBoatLocation = getSingleComputerShipLocation(2, shipLocations);
  shipLocations["patrol boat"] = patrolBoatLocation;

  return shipLocations;
};

// Returns an array for a random location that has not been picked yet for the computer player.
const getComputerAttack = () => {
  var hitAttacks = enemyPlayer.board.hitAttacks;
  var missedAttacks = enemyPlayer.board.missedAttacks;
  var takenSpots = hitAttacks.concat(missedAttacks);

  var pos = getRandomPosition();
  var validSpot = false;
  while (!validSpot) {
    // Get new pos
    var pos = getRandomPosition();

    // Checks if pos is currently taken.
    for (var i = 0; i <= takenSpots.length; i++) {
      // Exit loop if pos is taken.
      if (areArraysEqual(pos, takenSpots[i])) {
        break;
      }

      if (i === takenSpots.length) {
        validSpot = true;
        break;
      }
    }
  }

  return pos;
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

// Returns an array of arrays.
// Inner array is an array of positions for the given ship's length.
const getSingleComputerShipLocation = (shipLength, shipLocations) => {
  // Returns true if position is valid, not occupied, and on the board.
  // Returns false otherwise.
  // Takes in array with 2 elements.
  // A letter as a string.
  // A number as an int.
  const isSpotValidandOnBoard = (posArr) => {
    var letter = posArr[0];
    var number = posArr[1];

    // Checks if letter is outside of valid range of "A" and "J".
    if (letter.charCodeAt(0) < 65 || letter.charCodeAt(0) > 74) {
      return false;
    }

    // Checks if number is outside of valid range of 1 and 10.
    if (number < 1 || number > 10) {
      return false;
    }

    // Checks if posArr is currently taken.
    for (var i = 0; i < shipLocations1D.length; i++) {
      if (areArraysEqual(posArr, shipLocations1D[i])) {
        return false;
      }
    }

    // Position is valid.
    return true;
  };

  // Returns array of a position with the given position moved right.
  const moveRight = (cellArr) => {
    var letter = cellArr[0];
    var number = cellArr[1];

    letter = String.fromCharCode(letter.charCodeAt(0) + 1);
    number = parseInt(number);

    return [letter, number];
  };

  // Returns array of a position with the given position moved down.
  const moveDown = (cellArr) => {
    var letter = cellArr[0];
    var number = cellArr[1];

    letter = letter;
    number = parseInt(number + 1);

    return [letter, number];
  };

  // Initialize location array, positionFound boolean.
  // Flattens all currently placed ship locations to 1D array of positions.
  var location = [];
  var positionFound = false;
  var shipLocations1D = Object.values(shipLocations).flat();

  // Repeats until a valid ship location is found.
  while (!positionFound) {
    // Reset location array.
    location = [];

    // Randomly get a valid current starting position.
    var validStart = false;
    var currPos = getRandomPosition();
    while (!validStart) {
      if (!isSpotValidandOnBoard(currPos)) {
        currPos = getRandomPosition();
      } else {
        validStart = true;
      }
    }

    // Push current position to location array.
    location.push(currPos);

    // Get random direction to move in as a boolean.
    var horizontal = Math.random() < 0.5;

    // Get remaining positions. Starts after the first position.
    for (var i = 1; i < shipLength; i++) {
      // Moving horizontally.
      if (horizontal) {
        currPos = moveRight(currPos);
      }
      // Moving vertically.
      else {
        currPos = moveDown(currPos);
      }

      // Exits for loop if position is not valid.
      // While loop is restarted with new starting position.
      if (!isSpotValidandOnBoard(currPos)) {
        break;
      }

      // Adds currPos to location array.
      location.push(currPos);

      // If length of array reaches the length of the ship, position found, exit while loop.
      if (location.length === shipLength) {
        positionFound = true;
      }
    }
  }

  return location;
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
    var cell = getComputerCellFromArray(allShipLocations[i]);
    cell.classList.add("ship");
  }
};

// Returns the cell element on the Computer's board given an array position.
const getComputerCellFromArray = (posArr) => {
  var letter = String(posArr[0]);
  var number = String(posArr[1]);
  var queryString = `#player2-board > .cell[data-letter="${letter}"][data-number="${number}"]`;

  var cell = document.querySelector(queryString);

  return cell;
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

export { rotate, pickShipLocations, resetGame };
