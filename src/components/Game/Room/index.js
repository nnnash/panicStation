import React from 'react';
import {connect} from 'react-redux';
import {compose, withProps} from 'recompose';
import {contains, propEq, find, propOr} from 'ramda';
import cn from 'classnames';

import * as actions from 'common/actions/game';
import {CARD_KEY, ROOM_SIDE_TYPE_WALL} from 'common/constants';
import {getYourself} from '../';

import css from './style.css';

const getUnitStyle = (unitId, users) => {
    const unitUser = find(({team}) => contains(unitId, [team.person.id, team.droid.id]), users);
    return css[unitUser.team.color];
};

const getUnitLetter = (unitId, users) => {
    const user = find(({team}) => contains(unitId, [team.person.id, team.droid.id]), users);
    return user.team.person.id === unitId ? 'H' : 'D';
};

const RoomPartBase = ({
    roomName,
    units,
    isEnterable,
    game,
    unitId,
    enterRoom,
    row,
    column,
}) => (
    <div className={css.roomPart}>
        {roomName && <div className={css.roomName}>{roomName}</div>}
        {units && units.length ? (
            <div className={css.units}>
                {units.map(unit => (
                    <div className={cn(css.unit, getUnitStyle(unit, game.users))} key={`unit-${unit}`}>
                        {getUnitLetter(unit, game.users)}
                    </div>
                ))}
            </div>
        ) : null}
        {isEnterable && (
            <button onClick={() => enterRoom(game.id, row, column, unitId)}>
                enter
            </button>
        )}
    </div>
);

const getActiveUnitId = (unit, player) => unit && player.team[unit].id;
const getIsEnterable = (unitId, room, player, isLockedPart) => {
    if (!player.isActive) return false;
    if (room.separated) {
        const hasKey = !find(propEq('name', CARD_KEY), propOr([], 'playedItems', player));
        if (isLockedPart) {
            return hasKey && contains(unitId, room.units);
        }
        if (contains(unitId, room.subRoomUnits) && hasKey) return true;
    }
    return room.isEnterable;
};

const RoomPart = compose(
    connect(state => ({
        game: state.game,
        player: getYourself(state),
    }), actions),
    withProps(ownProps => ({
        unitId: getActiveUnitId(ownProps.activeUnit, ownProps.player),
    })),
    withProps(({unitId, room, player, isLockedPart}) => ({
        isEnterable: getIsEnterable(unitId, room, player, isLockedPart),
    }))
)(RoomPartBase);

const Room = (props) => {
    const {room} = props;

    return (
        <div className={css.wrapper}>
            {room.separated ? (
                Object.keys(room.sides)
                    .filter(key => key % 2)
                    .map(sideKey => {
                        if (room.sides[sideKey].wall === ROOM_SIDE_TYPE_WALL) {
                            return (<RoomPart
                                key={`${room.id}-roomPart-${sideKey}`}
                                roomName={room.name}
                                isLockedPart
                                units={room.subRoomUnits}
                                {...props}
                            />);
                        }
                        return (<RoomPart
                            key={`${room.id}-room-${sideKey}`}
                            roomName="empty"
                            units={room.units}
                            {...props}
                        />);
                    })
            ) : (
                <RoomPart
                    roomName={room.name}
                    units={room.units}
                    {...props}
                />
            )}
        </div>
    );
};

export default Room;
