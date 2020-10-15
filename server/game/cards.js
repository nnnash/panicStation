const {repeat, insert} = require('ramda');
const r = require('./random');
const c = require('../../common/constants');

const cards = {
  [c.CARD_ARMOR]: {
    count: 7,
    useNumber: 1,
  },
  [c.CARD_KEY]: {
    count: 3,
  },
  [c.CARD_SCANNER]: {
    count: 1,
    useNumber: 1,
  },
  [c.CARD_GRENADE]: {
    count: 2,
    useNumber: 1,
    costsActionPoint: true,
  },
  [c.CARD_GAS]: {
    count: 12,
    useNumber: 1,
  },
  [c.CARD_FIRST_AID]: {
    count: 3,
    useNumber: 1,
  },
  [c.CARD_TARGET_SCOPE]: {
    count: 2,
  },
  [c.CARD_KNIFE]: {
    count: 2,
    costsActionPoint: true,
  },
  [c.CARD_GUN]: {
    count: 2,
    costsActionPoint: true,
  },
  [c.CARD_AMMO]: {
    count: 6,
    useNumber: 4,
  },
  [c.CARD_ENERGY]: {
    count: 2,
    useNumber: 1,
  },
  [c.CARD_PARASITE]: {
    count: 3,
    immediatelyPlayed: true,
  }
};

const createCard = ({
  name,
  color,
  user,
  playable = true,
  inUse = false,
  useNumber = -1,
  costsActionPoint = false,
  immediatelyPlayed = false,
}) => ({
  name,
  color,
  user,
  playable,
  inUse,
  useNumber,
  costsActionPoint,
  immediatelyPlayed,
});

const createBloodCard = (user, color) =>
  createCard({name: c.CARD_BLOOD, color, user, playable: false});

const createDeck = userNumber => {
  const startGas = repeat(createCard({...cards.gas, name: c.CARD_GAS}), userNumber);
  cards.gas.count -= userNumber;

  const restCards = Object.keys(cards).reduce((acc, cardType) => {
    const card = cards[cardType];
    const cardsOfType = repeat(createCard({...card, name: cardType}), card.count);

    return acc.concat(cardsOfType);
  }, []);

  let deck = r.shuffle(restCards);

  while (startGas.length) {
    deck = insert(r.integer(0, (userNumber * 3) - 2), startGas.shift(), deck);
  }
  deck = insert(
    r.integer(0, (userNumber * 3) - 1),
    createCard({name: c.CARD_INFECTION, playable: false}),
    deck
  );

  return deck;
};

module.exports = {
  createBloodCard,
  createDeck,
};
