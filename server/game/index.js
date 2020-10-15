const ramda = require('ramda');

const teams = require('./teams');
const {createBloodCard, createDeck} = require('./cards');
const {
    createRoomsDeck,
    createMapRoom,
    getMapRoomById,
    getAdjacentRooms,
    addBlankEdges,
    getOppositeSide,
    getRoomCoordsByUnitId,
} = require('./rooms');
const {createParasites, getParasite} = require('./parasites');
const {
    getPlayerActionPoints,
    getNextPlayerByUsername,
    getNextPlayer,
    getUserIndexByName,
} = require('./player');
const {isNextRoomPlaceable} = require('../../common/helpers/room');
const rand = require('./random');
const c = require('../../common/constants');

let iterableId = 0;

/**
 * Makes next player active
 */
const changeActivePlayer = (gameModel, username) => {
    const game = gameModel;
    const nextPlayer = username
        ? getNextPlayerByUsername(username, game.users)
        : getNextPlayer(game.users);
    game.active = {
        user: nextPlayer.username,
        actionsLeft: getPlayerActionPoints(nextPlayer),
    };

    return game;
};

/**
 * Game initializations
 */
const setupGame = gameModel => {
    const game = gameModel.toObject();
    const rooms = createRoomsDeck();
    const reactor = createMapRoom(rooms.shift());

    const restTeams = teams.map(team => ramda.mergeDeepLeft({
        person: {
            id: iterableId++,
        },
        droid: {
            id: iterableId++,
        },
    }, team));

    const deck = createDeck(game.users.length);

    let startParasites = 0;
    game.users.forEach((user, ind) => {
        const team = rand.removeAndTakeRandomItem(restTeams);
        game.users[ind].team = team;

        const cards = ramda.repeat(createBloodCard(user, team.color), 3);
        cards.push(deck.shift());
        cards.push(deck.shift());
        while (cards.filter(ramda.propEq('name', c.CARD_PARASITE)).length) {
            cards.splice(ramda.findIndex(ramda.propEq('name', c.CARD_PARASITE), cards), 1);
            startParasites++;
            cards.push(deck.shift());
        }
        if (ramda.find(ramda.propEq('name', 'infection'), cards)) {
            game.users[ind].isInfected = true;
        }
        game.users[ind].cards = cards;
    });

    const firstPlayer = rand.pick(game.users);
    firstPlayer.isFirst = true;

    Object.assign(game, changeActivePlayer(game, firstPlayer.username));

    reactor.units = game.users.reduce(
        (acc, {team: {person, droid}}) => acc.concat([person.id, droid.id]), []
    );
    reactor.parasites = [];
    game.parasitesPile = createParasites();
    while (startParasites) {
        reactor.parasites.push(getParasite(game));
        startParasites--;
    }
    game.map = [
        [null, null, null],
        [null, reactor, null],
        [null, null, null],
    ];
    game.rooms = [{
        id: 100,
        name: 'open',
        explored: false,
        walls: 'dddd'.split('')
            .map(() => 'door'),
        separated: false,
    }, {
        id: 101,
        name: 'closed',
        explored: false,
        walls: 'dddd'.split('')
            .map(() => 'wall'),
        separated: false,
    }, {
        id: 102,
        name: 'closed',
        explored: false,
        walls: 'dddd'.split('')
            .map(() => 'wall'),
        separated: false,
    }, ...rooms];
    game.deck = deck;
    game.isNextRoomPlaceable = true;

    return game;
};

const playCard = (gameModel, {username, card, roomId}) => {
    const game = gameModel.toObject();
    switch (card) {
        case c.CARD_PARASITE:
            const parasite = getParasite(game);
            const room = getMapRoomById(game, roomId);
            if (room.parasites) {
                room.parasites.push(parasite);
            } else {
                room.parasites = [parasite];
            }
            game.markModified('map');

            break;

        default:
            break;
    }

    return game;
};

const placeRoom = (gameModel, {row, column, upsideDown}) => {
    const game = gameModel.toObject();
    const adjacent = getAdjacentRooms(game.map, row, column);
    const newRoom = game.rooms.shift();
    game.map[row][column] = createMapRoom(newRoom, upsideDown, adjacent, game);
    ramda.forEachObjIndexed((adj, key) => {
        if (adj) {
            const room = getMapRoomById(game, adj);
            room.sides[getOppositeSide(key)].adjacentRoomId = newRoom.id;
        }
    }, adjacent);
    game.map = addBlankEdges(game.map, row, column);
    if (game.rooms.length) {
        const nextRoom = game.rooms[0];
        if (!isNextRoomPlaceable(game.map, nextRoom)) {
            let binarySides = 1;
            if (nextRoom.separated) nextRoom.separated = false;
            do {
                nextRoom.walls = ramda.takeLast(4, (`000${binarySides.toString(2)}`).split(''))
                    .map(key => Number(key) ? c.ROOM_SIDE_TYPE_LOCKED : c.ROOM_SIDE_TYPE_WALL);
                binarySides++;
            } while (binarySides < 16 && !isNextRoomPlaceable(game.map, nextRoom));
            if (binarySides === 16 && !isNextRoomPlaceable(game.map, nextRoom)) {
                game.winner = 'infected';
            }
        }
    }

    return game;
};

const enterRoom = (gameModel, {row, column, unitId}) => {
    const game = gameModel.toObject();
    const [prevRow, prevColumn] = getRoomCoordsByUnitId(game.map, unitId);
    const {units} = game.map[prevRow][prevColumn];
    if (prevRow === row && prevColumn === column) {
        // moved in the same card
        if (ramda.contains(unitId, units)) {
            game.map[prevRow][prevColumn].units = units.filter(id => id !== unitId);
            game.map[prevRow][prevColumn].subRoomUnits.push(unitId);
        } else {
            game.map[prevRow][prevColumn].subRoomUnits = game.map[prevRow][prevColumn].subRoomUnits
                .filter(id => id !== unitId);
            game.map[prevRow][prevColumn].units.push(unitId);
        }
    } else {
        game.map[prevRow][prevColumn].units = game.map[prevRow][prevColumn].units
            .filter(id => id !== unitId);
        game.map[row][column].units.push(unitId);
    }

    return game;
};

module.exports = {
    setupGame,
    playCard,
    placeRoom,
    enterRoom,
    changeActivePlayer,
};
