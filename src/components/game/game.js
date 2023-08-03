const Player = require("../player/player");

const Game = () => {
  const game = {
    gameStart() {
      const player1 = Player("Player 1");
      const player2 = Player("Player 2");
    },
  };

  return game;
};

module.exports = Game;
