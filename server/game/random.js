const Random = require('random-js');

const r = Random();

r.removeAndTakeRandomItem = array => array.splice(r.integer(0, array.length - 1), 1)[0];

module.exports = r;
