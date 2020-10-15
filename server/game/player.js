const {pathOr, find, propEq, findIndex} = require('ramda');

const getPlayerActionPoints = player =>
  Math.ceil(pathOr(0, ['team', 'droid', 'health'], player) / 2)
  + Math.ceil(pathOr(0, ['team', 'person', 'health'], player) / 2);

const getActiveUser = users => find(propEq('isActive', true), users);

const getNextPlayerByUsername = (username, users) => {
  const active = getActiveUser(users);
  if (active) {
    active.isActive = false;
  }
  const next = find(propEq('username', username), users);
  next.isActive = true;
  return next;
};

const getNextPlayer = users => {
  const userIndex = findIndex(propEq('isActive', true), users);
  Object.assign(users[userIndex], {
    isActive: false,
  });
  const next = userIndex === users.length - 1 ? users[0] : users[userIndex + 1];
  next.isActive = true;
  return next;
};

const getUserIndexByName = (username, users) => findIndex(propEq('username', username), users);

module.exports = {
  getPlayerActionPoints,
  getNextPlayerByUsername,
  getNextPlayer,
  getUserIndexByName,
};
