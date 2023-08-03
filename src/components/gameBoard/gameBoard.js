const ShipFactory = require("../ship/ship");

function isSameSpot(spot1, spot2) {
  if (JSON.stringify(spot1) === JSON.stringify(spot2)) {
    return true;
  }

  return false;
}

const GameBoardFactory = () => {
  const gameBoard = {
    shipCollection: [],
    missedAttacks: [],
    hitAttacks: [],

    placeShip(shipName, location) {
      var ship = ShipFactory(shipName, location);
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

          if (isSameSpot(spot, attack)) {
            ship.hit();
            this.hitAttacks.push(attack);
            return ship;
          }
        }
      }

      // Mark missed location
      this.missedAttacks.push(attack);

      return null;
    },

    // Returns true if move is valid.
    // Returns false otherwise.
    isValidMove(attack) {
      // Return if attack was already made
      for (var i = 0; i < this.missedAttacks.length; i++) {
        if (isSameSpot(attack, this.missedAttacks[i])) {
          return false;
        }
      }

      for (var i = 0; i < this.hitAttacks.length; i++) {
        if (isSameSpot(attack, this.hitAttacks[i])) {
          return false;
        }
      }

      return true;
    },

    // Returns true if every ship is sunk.
    // Returns false if any ship is still not sunk.
    allShipsSunk() {
      for (var i = 0; i < this.shipCollection.length; i++) {
        var ship = this.shipCollection[i];

        if (!ship.isSunk()) {
          return false;
        }
      }

      return true;
    },
  };

  return gameBoard;
};

module.exports = GameBoardFactory;
