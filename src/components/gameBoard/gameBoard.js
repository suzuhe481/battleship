function compareSpots(spot1, spot2) {
  if (JSON.stringify(spot1) === JSON.stringify(spot2)) {
    return true;
  }

  return false;
}

const gameBoardFactory = () => {
  const gameBoard = {
    shipCollection: [],
    missedHits: [],

    placeShip(ship, location) {
      this.shipCollection.push(ship);

      ship.location = location;
    },

    // Returns hit ship object on hit.
    // Returns null on miss..
    receiveAttack(attack) {
      // For every ship
      for (var i = 0; i < this.shipCollection.length; i++) {
        var ship = this.shipCollection[i];

        // For every ship's location
        for (var j = 0; j < ship.location.length; j++) {
          var spot = ship.location[j];

          if (compareSpots(spot, attack)) {
            ship.hit();
            return ship;
          }
        }
      }

      // Mark missed location
      this.missedHits.push(attack);

      return null;
    },

    // Returns true if move is valid.
    // Returns false otherwise.
    isValidMove(attack) {
      // Return if attack was already made
      for (var i = 0; i < this.missedHits.length; i++) {
        if (compareSpots(attack, this.missedHits[i])) {
          return false;
        }
      }

      return true;
    },
  };

  return gameBoard;
};

module.exports = gameBoardFactory;
