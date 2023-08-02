const shipFactory = (health, location) => {
  const ship = {
    health: health,
    length: health,
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

module.exports = shipFactory;
