import React from 'react';
import {connect} from 'react-redux';
import {compose, mapProps} from 'recompose';
import {path, head, contains, forEachObjIndexed, propEq, find, propOr, clone} from 'ramda';
import matrix from 'array2d';
import cn from 'classnames';

import * as actions from 'common/actions/game';
import {
    ROOM_SIDE_TYPE_WALL,
    ROOM_SIDE_TYPE_LOCKED,
    ROOM_SIDE_TYPE_DOOR,
    CARD_KEY,
    SIDES,
} from 'common/constants';
import {getPlaceableMap, getNextRoomCoordsBySide} from 'common/helpers/room';
import {getYourself} from '../';

import Room from '../Room';

import css from './style.css';

const getItemBorders = item => {
    if (!item || !item.sides) return '';
    return Object.keys(item.sides)
        .map(key => {
            if (item.sides[key].wall === ROOM_SIDE_TYPE_DOOR) return '';
            return css[`${SIDES[key]}-${item.sides[key].wall}`];
        });
};

const Map = ({
    map,
    game,
    player,
    isAvailableShown,
    placeRoom,
    activeUnit,
    enterRoom,
}) => (
    <table className={css.map}>
        <tbody>
            {map && map.map((row, ind) => (
                <tr key={`map-row-${ind}`}>
                    {row.map((item, ind2) => (
                        <td
                            key={`map-column-${ind2}`}
                            className={cn(getItemBorders(item))}
                        >
                            <div className={css.wrapper}>
                                {item ? (
                                    <div>
                                        {item.id && (
                                            <Room
                                                room={item}
                                                row={ind}
                                                column={ind2}
                                                activeUnit={activeUnit}
                                            />
                                        )}
                                        {item.assignOptions && (
                                            <div>
                                                {item.assignOptions.up && (
                                                    <button onClick={() => placeRoom(game.id, ind, ind2)}>
                                                        up
                                                    </button>
                                                )}
                                                {item.assignOptions.down && (
                                                    <button onClick={() => placeRoom(game.id, ind, ind2, true)}>
                                                        down
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className={css.empty}>vacant</div>
                                )}
                            </div>
                        </td>
                    ))}
                </tr>
            ))}
        </tbody>
    </table>
);

const getExitableOption = (side, keyPlayed) => {
    if (!side.adjacentRoomId) return false;
    if (side.wall === ROOM_SIDE_TYPE_WALL) return false;
    if (side.wall === ROOM_SIDE_TYPE_LOCKED) return keyPlayed;
    return true;
};

const getEnterableOption = (room, sideNumber, keyPlayed) => {
    const side = ((+sideNumber + 1) % 4) + 1;
    return room.sides[side].wall === ROOM_SIDE_TYPE_DOOR || keyPlayed;
};

const getMovableMap = (map, unitType, player) => {
    let newMap = matrix.clone(map);
    const unitRoomCoords = matrix.find(newMap, cell => {
        if (!cell || !cell.units || !cell.units.length) return false;
        return contains(player.team[unitType].id, cell.units);
    })[0];
    if (!unitRoomCoords) return newMap;
    const keyPlayed = !!find(propEq('name', CARD_KEY), propOr([], 'playedItems', player));
    const room = matrix.get(newMap, ...unitRoomCoords);
    forEachObjIndexed((side, key) => {
        const isExitable = getExitableOption(side, keyPlayed);
        if (!isExitable) return;
        const nextRoomCoords = getNextRoomCoordsBySide(...unitRoomCoords, +key);
        const nextRoom = matrix.get(newMap, ...nextRoomCoords);
        const isEnterable = getEnterableOption(nextRoom, +key, keyPlayed);
        if (!isEnterable) return;

        newMap = matrix.set(newMap, ...nextRoomCoords, {
            ...nextRoom,
            isEnterable: true
        });
    }, room.sides);

    return newMap;
};

export default compose(
    connect(state => ({
        map: path(['game', 'map'], state),
        game: state.game,
        nextCard: head(path(['game', 'rooms'], state)),
        player: getYourself(state),
    }), actions),
    mapProps(ownProps => {
        let map = clone(ownProps.map);
        if (ownProps.isAvailableShown && ownProps.player.isActive && ownProps.game.rooms.length) {
            map = getPlaceableMap(ownProps.map, ownProps.nextCard, ownProps.player.team);
        }
        if (ownProps.activeUnit && ownProps.player.isActive) {
            map = getMovableMap(ownProps.map, ownProps.activeUnit, ownProps.player);
        }
        return {
            ...ownProps,
            map,
        };
    })
)(Map);
