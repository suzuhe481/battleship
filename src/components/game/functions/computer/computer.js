import { getRandomPosition, areArraysEqual } from "../game";

// Returns the cell element on the Computer's board given an array position.
const getComputerCellFromArray = (posArr) => {
  var letter = String(posArr[0]);
  var number = String(posArr[1]);
  var queryString = `#player2-board > .cell[data-letter="${letter}"][data-number="${number}"]`;

  var cell = document.querySelector(queryString);

  return cell;
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

export { getComputerCellFromArray, placeRandomComputerShips };
