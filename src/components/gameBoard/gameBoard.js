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

    // On hit - Returns hit ship.
    // On miss - Returns null.
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
  };

  return gameBoard;
};

module.exports = gameBoardFactory;
