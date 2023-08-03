const gameBoardFactory = require("../gameBoard/gameBoard");

const PlayerFactory = (name) => {
  const player = {
    name: name,
    board: gameBoardFactory(),
  };

  return player;
};

module.exports = PlayerFactory;
