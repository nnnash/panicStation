const {times, flatten, mergeAll, insert, head, repeat, contains} = require('ramda');
const matrix = require('array2d');
const r = require('./random');
const c = require('../../common/constants');
const {getOppositeSide} = require('../../common/helpers/room');

const rooms = {
    [c.ROOM_RUN]: [
        {walls: 'wdlw'},
        {walls: 'dddd', count: 2},
    ],
    [c.ROOM_TEAM_SEARCH]: [
        {walls: 'dwwd', count: 2},
        {walls: 'ddwl'},
        {walls: 'lwdw'},
    ],
    [c.ROOM_STORAGE]: [
        {walls: 'wddw'},
        {walls: 'wddd'},
    ],
    [c.ROOM_PARASITE]: [
        {walls: 'ddwd', count: 2},
        {walls: 'dddw'},
        {walls: 'wddw'},
    ],
    [c.ROOM_EMPTY]: [
        {walls: 'ddwd'},
        {walls: 'lldd'},
    ],
    [c.ROOM_TERMINAL]: [
        {walls: 'wwdw', separated: true}
    ],
    [c.ROOM_HEAL]: [
        {walls: 'wwdw', separated: true},
    ],
};

const specialRooms = {
    [c.ROOM_HIVE]: {walls: 'dwww'},
    [c.ROOM_REACTOR]: {walls: 'dddd'},
    [c.ROOM_TERMINAL]: {walls: 'wddd'},
};

const wallType = letter => ({
    d: c.ROOM_SIDE_TYPE_DOOR,
    l: c.ROOM_SIDE_TYPE_LOCKED,
    w: c.ROOM_SIDE_TYPE_WALL,
}[letter]);

const orthogonalsIndexesToSides = c.ORTHOGONALS_TO_SIDES;

let iterableId = 1;

const createRoom = ({
    id,
    name,
    explored = false,
    walls,
    separated = false,
}) => ({
    id: iterableId++,
    name,
    explored,
    walls: walls.split('')
        .map(wallType),
    separated,
});

const createRoomsDeck = () => {
    let deck = Object.keys(rooms)
        .reduce((acc, roomType) => {
            const room = rooms[roomType];
            const roomsOfType = room.map(roomItem =>
                times(() => createRoom({...roomItem, name: roomType}), roomItem.count || 1));

            return acc.concat(roomsOfType);
        }, []);

    deck = r.shuffle(flatten(deck));

    deck = insert(
        r.integer(Math.floor(deck.length / 2), deck.length),
        createRoom({...specialRooms.terminal, name: c.ROOM_TERMINAL}),
        deck
    );

    deck = insert(
        r.integer(deck.length - 2, deck.length),
        createRoom({...specialRooms.hive, name: c.ROOM_HIVE}),
        deck
    );

    return [createRoom({...specialRooms.reactor, name: c.ROOM_REACTOR}), ...deck];
};

const createMapRoom = (mapRoom, upsideDown = false, adjacent = {}) => {
    const sides = '1234'.split('')
        .map(Number)
        .map(number => ({
            [number]: {
                adjacentRoomId: adjacent[number] || null,
                wall: upsideDown ? mapRoom.walls[(number + 1) % 4] : mapRoom.walls[number - 1],
            }
        }));
    mapRoom.sides = mergeAll(sides);

    return mapRoom;
};

const getMapRoomById = (game, roomId) => {
    const coords = head(matrix.find(game.map, room => room && room.id === roomId));
    return game.map[coords[0]][coords[1]];
};

const getAdjacentRooms = (map, row, column) => {
    const adjacents = matrix.orthogonals(map, row, column);
    const adjacentRooms = {};
    adjacents.forEach((room, ind) => {
        adjacentRooms[orthogonalsIndexesToSides[ind]] = room
            ? room.id
            : null;
    });
    return adjacentRooms;
};

const addBlankEdges = (map, row, column) => {
    let newMap = matrix.clone(map);
    const edges = matrix.edges(newMap, row, column);
    edges.forEach(edge => {
        switch (edge) {
        case matrix.EDGES.TOP:
            newMap = matrix.upad(newMap, 1, null);
            break;
        case matrix.EDGES.BOTTOM:
            newMap = matrix.dpad(newMap, 1, null);
            break;
        case matrix.EDGES.RIGHT:
            newMap = matrix.rpad(newMap, 1, null);
            break;
        case matrix.EDGES.LEFT:
            newMap = matrix.lpad(newMap, 1, null);
            break;
        default:
            break;
        }
    });
    return newMap;
};

const getRoomByCoords = matrix.get;

const getRoomCoordsByUnitId = (map, unitId) =>
    matrix.find(map, cell => {
        if (!cell) return false;
        if (cell.units) {
            if (contains(unitId, cell.units)) return true;
        }
        if (cell.subRoomUnits) {
            if (contains(unitId, cell.subRoomUnits)) return true;
        }
        return false;
    })[0];

module.exports = {
    createRoomsDeck,
    createMapRoom,
    getMapRoomById,
    getAdjacentRooms,
    addBlankEdges,
    getOppositeSide,
    getRoomByCoords,
    getRoomCoordsByUnitId,
};
