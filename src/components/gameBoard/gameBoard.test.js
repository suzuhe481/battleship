const GameBoardFactory = require("./gameBoard");

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

test("Placing a ship", () => {
  var submarineLocation = [
    ["b", 2],
    ["b", 3],
    ["b", 4],
  ];

  var gameBoard = GameBoardFactory();
  gameBoard.placeShip("submarine", submarineLocation);

  expect(gameBoard.shipCollection[0].location).toBe(submarineLocation);
});

test("Receive attack and hit", () => {
  var carrierLocation = [
    ["b", 2],
    ["b", 3],
    ["b", 4],
    ["b", 5],
    ["b", 6],
  ];
  var patrolBoatLocation = [["f", 3], ["f, 4"]];

  var gameBoard = GameBoardFactory();
  gameBoard.placeShip("carrier", carrierLocation);
  gameBoard.placeShip("patrol boat", patrolBoatLocation);

  var shipHit = gameBoard.receiveAttack(["b", 4]);

  expect(shipHit.health).toBe(shipHit.length - 1);
});

test("Receive attack and miss", () => {
  var carrierLocation = [
    ["b", 2],
    ["b", 3],
    ["b", 4],
    ["b", 5],
    ["b", 6],
  ];

  var gameBoard = GameBoardFactory();
  gameBoard.placeShip("carrier", carrierLocation);

  var shipHit = gameBoard.receiveAttack(["c", 4]);

  expect(shipHit).toBe(null);
});

test("Multiple attacks missed and recorded", () => {
  var carrierLocation = [
    ["b", 2],
    ["b", 3],
    ["b", 4],
    ["b", 5],
    ["b", 6],
  ];
  var patrolBoatLocation = [["f", 3], ["f, 4"]];

  var gameBoard = GameBoardFactory();
  gameBoard.placeShip("carrier", carrierLocation);
  gameBoard.placeShip("patrol boat", patrolBoatLocation);

  var attack1 = ["c", 5];
  var attack2 = ["c", 6];
  var attacks = [];
  attacks.push(attack1);
  attacks.push(attack2);

  var result = gameBoard.receiveAttack(attack1);
  result = gameBoard.receiveAttack(attack2);

  expect(gameBoard.missedAttacks).toStrictEqual(attacks);
});

test("Prevent same missed move from being used twice", () => {
  var carrierLocation = [
    ["b", 2],
    ["b", 3],
    ["b", 4],
    ["b", 5],
    ["b", 6],
  ];

  var gameBoard = GameBoardFactory();
  gameBoard.placeShip("carrier", carrierLocation);

  var attacks = [];
  var attack = ["c", 5];
  attacks.push(attack);

  var result = gameBoard.isValidMove(attack);
  expect(result).toBe(true);

  result = gameBoard.receiveAttack(attack);

  result = gameBoard.isValidMove(attack);
  expect(result).toBe(false);
});

test("Prevent same hit move from being used twice", () => {
  var carrierLocation = [
    ["b", 2],
    ["b", 3],
    ["b", 4],
    ["b", 5],
    ["b", 6],
  ];

  var gameBoard = GameBoardFactory();
  gameBoard.placeShip("carrier", carrierLocation);

  var attacks = [];
  var attack1 = ["b", 3];
  attacks.push(attack1);

  var result = gameBoard.isValidMove(attack1);
  expect(result).toBe(true);
  gameBoard.receiveAttack(attack1);

  result = gameBoard.isValidMove(attack1);
  expect(result).toBe(false);
});

test("Are all ships sunk", () => {
  var patrolBoatLocation = [
    ["b", 2],
    ["b", 3],
  ];
  var destroyerLocation = [
    ["c", 1],
    ["c", 2],
    ["c", 3],
  ];

  var gameBoard = GameBoardFactory();
  gameBoard.placeShip("patrol boat", patrolBoatLocation);
  gameBoard.placeShip("destroyer", destroyerLocation);

  var attacks = [];
  var attack1 = ["b", 2];
  var attack2 = ["b", 3];
  var attack3 = ["c", 1];
  var attack4 = ["c", 2];
  var attack5 = ["c", 3];
  attacks.push(attack1);
  attacks.push(attack2);
  attacks.push(attack3);
  attacks.push(attack4);
  attacks.push(attack5);

  gameBoard.receiveAttack(attack1);
  gameBoard.receiveAttack(attack2);

  expect(gameBoard.allShipsSunk()).toBe(false);

  gameBoard.receiveAttack(attack3);
  gameBoard.receiveAttack(attack4);
  gameBoard.receiveAttack(attack5);

  expect(gameBoard.allShipsSunk()).toBe(true);
});
