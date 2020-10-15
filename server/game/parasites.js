const {times} = require('ramda');

let iterableId = 0;
const createParasite = (color, health) => ({
  id: iterableId++,
  color,
  health,
});

const createParasites = () => ({
  gray: times(() => createParasite('gray', 1), 5),
  black: times(() => createParasite('black', 2), 5),
});

const getParasite = game => {
  const {gray, black} = game.parasitesPile;
  if (gray.length) {
    return gray.pop();
  }
  if (black.length) {
    return black.pop();
  }
  // TODO: get parasite from crowded room
  return null;
};

module.exports = {
  createParasites,
  getParasite,
};
