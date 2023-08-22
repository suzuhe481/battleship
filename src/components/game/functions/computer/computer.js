import { getRandomPosition, areArraysEqual } from "../game";
import * as player1Funcs from "../player1/player1";

// Returns the cell element on the Computer's board given an array position.
const getComputerCellFromArray = (posArr) => {
  var letter = String(posArr[0]);
  var number = String(posArr[1]);
  var queryString = `#player2-board > .board > .cell[data-letter="${letter}"][data-number="${number}"]`;

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

// Returns an array for a random location that has not been picked yet for the computer player.
const getRandomComputerAttack = (enemyPlayer) => {
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

// Gets a more realistic guess for the computer player.
const getRealisticComputerAttack = (difficultyOptions, enemyPlayer) => {
  // Helper function.
  // Using the last hit cell, gets a valid non-picked surrounding cell.
  // Order: Right, Below, Left, Above
  const getCurrValidSurroundingGuess = () => {
    // Get last hit in array.
    var lastHit =
      difficultyOptions.prevHits[difficultyOptions.prevHits.length - 1];

    var currCell;
    // Get right cell if valid and not previously picked
    if (!difficultyOptions.guessRight) {
      currCell = player1Funcs.getRightCellArray(lastHit);
      difficultyOptions.huntDirection = "RIGHT";

      if (!player1Funcs.isCellOnBoardAndNotPicked(currCell)) {
        // Go to next surrounding cell
        difficultyOptions.guessRight = true;
      }
    }

    // Get below cell if valid and not previously picked
    if (difficultyOptions.guessRight && !difficultyOptions.guessBelow) {
      currCell = player1Funcs.getBelowCellArray(lastHit);
      difficultyOptions.huntDirection = "BELOW";

      if (!player1Funcs.isCellOnBoardAndNotPicked(currCell)) {
        // Go to next surrounding cell
        difficultyOptions.guessBelow = true;
      }
    }

    // Get left cell if valid and not previously picked
    if (
      difficultyOptions.guessRight &&
      difficultyOptions.guessBelow &&
      !difficultyOptions.guessLeft
    ) {
      currCell = player1Funcs.getLeftCellArray(lastHit);
      difficultyOptions.huntDirection = "LEFT";

      if (!player1Funcs.isCellOnBoardAndNotPicked(currCell)) {
        // Go to next surrounding cell
        difficultyOptions.guessLeft = true;
      }
    }

    // Get above cell if valid and not previously picked
    if (
      difficultyOptions.guessRight &&
      difficultyOptions.guessBelow &&
      difficultyOptions.guessLeft &&
      !difficultyOptions.guessAbove
    ) {
      currCell = player1Funcs.getAboveCellArray(lastHit);
      difficultyOptions.huntDirection = "ABOVE";

      if (!player1Funcs.isCellOnBoardAndNotPicked(currCell)) {
        // No more valid surrounding cells.
        // Set to null.
        currCell = null;
        difficultyOptions.guessAbove = true;
      }
    }

    // Set currently used direction to the next.
    switchToNextSurroundingDirection();

    // If there is no valid cell around prevHits[prevHits.length - 1]
    // Then remove the last hit in prevHits
    // And attempt surrounding cells again of new last hit.
    if (
      currCell === null &&
      difficultyOptions.guessRight &&
      difficultyOptions.guessBelow &&
      difficultyOptions.guessLeft &&
      difficultyOptions.guessAbove
    ) {
      difficultyOptions.prevHits.pop();
      // difficultyOptions.huntDirection = "RIGHT";
      difficultyOptions.huntDirection = "";

      difficultyOptions.guessRight = false;
      difficultyOptions.guessBelow = false;
      difficultyOptions.guessLeft = false;
      difficultyOptions.guessAbove = false;

      currCell = getCurrValidSurroundingGuess();
    }

    return currCell;
  };

  // Helper function gets a cell based on the direction of the last cell hit.
  const getGuessInDirection = () => {
    // Get last cell hit
    var currCell =
      difficultyOptions.prevHits[difficultyOptions.prevHits.length - 1];

    // Goes in a single direction until an available cell is reached.
    // If cell was hit, skips over it.
    switch (difficultyOptions.huntDirection) {
      case "RIGHT":
        currCell = player1Funcs.getRightCellArray(currCell);
        // Reversed direction
        if (difficultyOptions.isHuntDirectionReversed) {
          var validCell = false;

          while (!validCell) {
            if (player1Funcs.isCellOnBoardAndNotPicked(currCell)) {
              validCell = true;
            } else {
              currCell = player1Funcs.getRightCellArray(currCell);
            }
          }
        } else {
          if (!player1Funcs.isCellOnBoardAndNotPicked(currCell)) {
            currCell = null;
          }
        }
        break;
      case "BELOW":
        currCell = player1Funcs.getBelowCellArray(currCell);
        // Reversed direction
        if (difficultyOptions.isHuntDirectionReversed) {
          var validCell = false;

          while (!validCell) {
            if (player1Funcs.isCellOnBoardAndNotPicked(currCell)) {
              validCell = true;
            } else {
              currCell = player1Funcs.getBelowCellArray(currCell);
            }
          }
        } else {
          if (!player1Funcs.isCellOnBoardAndNotPicked(currCell)) {
            currCell = null;
          }
        }
        break;
      case "LEFT":
        currCell = player1Funcs.getLeftCellArray(currCell);
        // Reversed direction
        if (difficultyOptions.isHuntDirectionReversed) {
          var validCell = false;

          while (!validCell) {
            if (player1Funcs.isCellOnBoardAndNotPicked(currCell)) {
              validCell = true;
            } else {
              currCell = player1Funcs.getLeftCellArray(currCell);
            }
          }
        } else {
          if (!player1Funcs.isCellOnBoardAndNotPicked(currCell)) {
            currCell = null;
          }
        }
        break;
      case "ABOVE":
        currCell = player1Funcs.getAboveCellArray(currCell);
        // Reversed direction
        if (difficultyOptions.isHuntDirectionReversed) {
          var validCell = false;

          while (!validCell) {
            if (player1Funcs.isCellOnBoardAndNotPicked(currCell)) {
              validCell = true;
            } else {
              currCell = player1Funcs.getAboveCellArray(currCell);
            }
          }
        } else {
          if (!player1Funcs.isCellOnBoardAndNotPicked(currCell)) {
            currCell = null;
          }
        }
        break;
    }

    // Cell was not valid.
    // Reverse huntDirection and restart getGuessInDirection()
    if (currCell === null) {
      reverseHuntDirection();

      // Guess will be retrieved via recursion.
      currCell = getGuessInDirection();
    }

    return currCell;
  };

  // Set currently used direction to the next.
  // Right => Below => Left => Above
  const switchToNextSurroundingDirection = () => {
    if (!difficultyOptions.guessRight) {
      difficultyOptions.guessRight = true;
    } else if (difficultyOptions.guessRight && !difficultyOptions.guessBelow) {
      difficultyOptions.guessBelow = true;
    } else if (
      difficultyOptions.guessRight &&
      difficultyOptions.guessBelow &&
      !difficultyOptions.guessLeft
    ) {
      difficultyOptions.guessLeft = true;
    } else if (
      difficultyOptions.guessRight &&
      difficultyOptions.guessBelow &&
      difficultyOptions.guessLeft &&
      !difficultyOptions.guessAbove
    ) {
      difficultyOptions.guessAbove = true;
    }
  };

  // Reverses huntDirection
  const reverseHuntDirection = () => {
    switch (difficultyOptions.huntDirection) {
      case "RIGHT":
        difficultyOptions.huntDirection = "LEFT";
        break;
      case "BELOW":
        difficultyOptions.huntDirection = "ABOVE";
        break;
      case "LEFT":
        difficultyOptions.huntDirection = "RIGHT";
        break;
      case "ABOVE":
        difficultyOptions.huntDirection = "BELOW";
        break;
    }
  };

  var guess;

  // Random guessing
  if (!difficultyOptions.huntMode) {
    guess = getRandomComputerAttack(enemyPlayer);
  }
  // Hunt mode is first activated
  else if (
    difficultyOptions.huntMode &&
    difficultyOptions.isLastAttackHit &&
    difficultyOptions.prevHits.length === 1
  ) {
    guess = getCurrValidSurroundingGuess();
  }
  // Hunt mode active, last guess was miss, prevHits is non empty, not using huntDirection.
  else if (
    difficultyOptions.huntMode &&
    !difficultyOptions.isLastAttackHit &&
    difficultyOptions.prevHits.length !== 0 &&
    difficultyOptions.huntDirection === ""
  ) {
    difficultyOptions.guessRight = false;
    difficultyOptions.guessBelow = false;
    difficultyOptions.guessLeft = false;
    difficultyOptions.guessAbove = false;
    guess = getCurrValidSurroundingGuess();
  }
  // Hunt mode active, going in a reverse direction, missed last attak
  // Reset and go back to surrounding guesses
  else if (
    difficultyOptions.huntMode &&
    difficultyOptions.huntDirection !== "" &&
    !difficultyOptions.isLastAttackHit &&
    difficultyOptions.isHuntDirectionReversed
  ) {
    difficultyOptions.isHuntDirectionReversed = false;
    difficultyOptions.huntDirection = "";

    difficultyOptions.guessRight = false;
    difficultyOptions.guessBelow = false;
    difficultyOptions.guessLeft = false;
    difficultyOptions.guessAbove = false;
    guess = getCurrValidSurroundingGuess();
  }
  // Hunt mode active, last guess was miss, reverse huntDirection
  else if (
    difficultyOptions.huntMode &&
    !difficultyOptions.isLastAttackHit &&
    difficultyOptions.huntDirection !== ""
  ) {
    difficultyOptions.isHuntDirectionReversed = true;

    reverseHuntDirection();

    guess = getGuessInDirection();
  }

  // Hunt mode has been active, last guess was hit
  else if (
    difficultyOptions.huntMode &&
    difficultyOptions.isLastAttackHit &&
    difficultyOptions.prevHits.length !== 0
  ) {
    guess = getGuessInDirection();
  }

  return guess;
};

export {
  getComputerCellFromArray,
  placeRandomComputerShips,
  getRandomComputerAttack,
  getRealisticComputerAttack,
};
