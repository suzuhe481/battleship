const shipFactory = (health) => {
  const ship = {
    health: health,

    hit() {
      this.health = this.health - 1;
    },

    isSunk() {
      return true ? this.health <= 0 : false;
    },
  };

  return ship;
};

module.exports = shipFactory;
