const defaultShips = {
  carrier: {
    startingHealth: 5,
  },
  battleship: {
    startingHealth: 4,
  },
  destroyer: {
    startingHealth: 3,
  },
  submarine: {
    startingHealth: 3,
  },
  "patrol boat": {
    startingHealth: 2,
  },
};

const ShipFactory = (name, location) => {
  const ship = {
    name: name,
    health: defaultShips[name].startingHealth,
    length: defaultShips[name].startingHealth,
    timesHit: 0,
    location: location,

    hit() {
      this.health -= 1;
      this.timesHit += 1;
    },

    isSunk() {
      return true ? this.health <= 0 : false;
    },
  };

  return ship;
};

module.exports = ShipFactory;
