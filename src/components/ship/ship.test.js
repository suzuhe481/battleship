const ShipFactory = require("./ship");

var defaultShips = {
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
  patrolBoat: {
    startingHealth: 2,
  },
};

test("Creates ship with specified health", () => {
  var carrier = ShipFactory("carrier");

  expect(carrier.health).toBe(defaultShips.carrier.startingHealth);
});

test("On hit, ship's health is decremented by 1", () => {
  var battleship = ShipFactory("battleship");
  battleship.hit();

  expect(battleship.health).toBe(defaultShips.battleship.startingHealth - 1);
});

test("Confirm sunk ship", () => {
  var destroyer = ShipFactory("destroyer");

  for (var i = 0; i < defaultShips.destroyer.startingHealth; i++) {
    expect(destroyer.isSunk()).toBe(false);

    destroyer.hit();
  }

  expect(destroyer.isSunk()).toBe(true);
});

test("Increments time ship is hit", () => {
  var submarine = ShipFactory("submarine");
  var numTimesHit = 2;

  for (var i = 0; i < numTimesHit; i++) {
    submarine.hit();
  }

  expect(submarine.timesHit).toBe(numTimesHit);
});
