const gameBoardFactory = () => {
  const gameBoard = {
    shipCollection: [],

    placeShip(ship, location) {
      this.shipCollection.push(ship);

      ship.location = location;
    },
  };

  return gameBoard;
};

module.exports = gameBoardFactory;
