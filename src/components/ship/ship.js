const shipFactory = (name, health, location) => {
  const ship = {
    name: name,
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
