const {path, head, contains, forEachObjIndexed, propEq, find, propOr} = require('ramda');
const matrix = require('array2d');

const {
  ROOM_SIDE_TYPE_WALL,
  ORTHOGONALS_TO_SIDES,
} = require('../constants');

const getOppositeSide = number => ((+number + 1) % 4) + 1;

const wallsAreAssignable = (nextCardWall, adjacentRoomWall) =>
  nextCardWall === ROOM_SIDE_TYPE_WALL
    ? adjacentRoomWall === ROOM_SIDE_TYPE_WALL
    : adjacentRoomWall !== ROOM_SIDE_TYPE_WALL;

const getAssignCardToSideOptions = (card, side, sideKey) => {
  if (side.adjacentRoomId || side.wall === ROOM_SIDE_TYPE_WALL) return null;
  return {
    up: card.walls[(sideKey + 1) % 4] !== ROOM_SIDE_TYPE_WALL,
    down: card.walls[(sideKey + 3) % 4] !== ROOM_SIDE_TYPE_WALL,
  };
};

const getNextRoomCoordsBySide = (roomRow, roomCol, sideKey) => {
  switch (+sideKey) {
    case 1:
      return [roomRow - 1, roomCol];
    case 2:
      return [roomRow, roomCol + 1];
    case 3:
      return [roomRow + 1, roomCol];
    case 4:
      return [roomRow, roomCol - 1];
    default:
      return [roomRow, roomCol];
  }
};

const getPlaceableMap = (map, nextCard, team) => {
  let newMap = matrix.clone(map);
  const playerRoomsCoords = matrix.find(newMap, cell => {
    if (!cell) return false;
    if (team) {
      if (!cell.units || !cell.units.length) return false;
      return contains(team.person.id, cell.units) || contains(team.droid.id, cell.units);
    }
    return true;
  });
  playerRoomsCoords.forEach(([row, col]) => {
    const room = matrix.get(newMap, row, col);
    forEachObjIndexed((side, key) => {
      let assignOptions = getAssignCardToSideOptions(nextCard, side, +key);
      if (!assignOptions || !(assignOptions.up || assignOptions.down)) return;
      const nextRoomCoords = getNextRoomCoordsBySide(row, col, +key);
      const adjacentToNext = matrix.orthogonals(newMap, ...nextRoomCoords);
      if (adjacentToNext.filter(Boolean).length > 1) {
        adjacentToNext.forEach((adjacentRoom, ind) => {
          if (!adjacentRoom
            || adjacentRoom.id === room.id
            || !adjacentRoom.id
            || !assignOptions) return;
          const adjacentRoomSide = adjacentRoom.sides[getOppositeSide(ORTHOGONALS_TO_SIDES[ind])];
          if (assignOptions.up) {
            assignOptions.up = wallsAreAssignable(
              nextCard.walls[ORTHOGONALS_TO_SIDES[ind] - 1],
              adjacentRoomSide.wall
            );
          }
          if (assignOptions.down) {
            assignOptions.down = wallsAreAssignable(
              nextCard.walls[getOppositeSide(ORTHOGONALS_TO_SIDES[ind]) - 1],
              adjacentRoomSide.wall
            );
          }
          if (!assignOptions.up && !assignOptions.down) {
            assignOptions = null;
          }
        });
      }
      if (assignOptions) newMap = matrix.set(newMap, ...nextRoomCoords, {assignOptions});
    }, room.sides);
  });

  return newMap;
};

const isNextRoomPlaceable = (map, nextRoom) => {
  const placeableMap = getPlaceableMap(map, nextRoom);

  return matrix.flatten(placeableMap).some(cell => cell && cell.assignOptions);
};

module.exports = {
  getOppositeSide,
  getPlaceableMap,
  isNextRoomPlaceable,
  getNextRoomCoordsBySide,
};
