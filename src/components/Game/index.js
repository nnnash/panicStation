import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {path, find, propEq} from 'ramda';
import {getGame, leaveGame, startGame} from 'common/actions/game';

import Map from './Map';

const Game = ({
    id,
    game,
    startGame,
    getGame,
    player,
    user,
}) => {
    const [state, setState] = useState({activeUnit: null, isAvailableRoomShown: false});
    const toggleAvailable = () => () => setState(({isAvailableRoomShown}) => ({
        isAvailableRoomShown: !isAvailableRoomShown,
        activeUnit: null,
    }));
    const activateUnit = unit => () => setState({
        isAvailableRoomShown: false,
        activeUnit: unit,
    });
    useEffect(() => {
        if (!game || !game.id) {
            getGame(id, user);
        }

        return () => {
            leaveGame(id, user);
        };
    }, []);

    return (
        <div>
            {game && game.users && (
                <div>
                    <ul>
                        {game.users.map((user) => (
                            <li key={user.username}>
                                {user.username}
                            </li>
                        ))}
                    </ul>
                    {game.status === 'new' ? (
                        <button
                            onClick={() => startGame(game.id)}
                            disabled={game.users.length < 2}
                        >
                            Start game
                        </button>
                    ) : (
                        <div>
                            {game.rooms.length && (
                                <div
                                    style={{
                                        padding: '20px',
                                        borderColor: 'white',
                                        margin: '5px',
                                        display: 'inline-block',
                                        borderTopWidth: game.rooms[0].walls[0] !== 'door' ? '5px' : '0',
                                        borderRightWidth: game.rooms[0].walls[1] !== 'door' ? '5px' : '0',
                                        borderBottomWidth: game.rooms[0].walls[2] !== 'door' ? '5px' : '0',
                                        borderLeftWidth: game.rooms[0].walls[3] !== 'door' ? '5px' : '0',
                                        borderTopStyle: game.rooms[0].walls[0] === 'wall' ? 'solid' : 'dotted',
                                        borderRightStyle: game.rooms[0].walls[1] === 'wall' ? 'solid' : 'dotted',
                                        borderBottomStyle: game.rooms[0].walls[2] === 'wall' ? 'solid' : 'dotted',
                                        borderLeftStyle: game.rooms[0].walls[3] === 'wall' ? 'solid' : 'dotted',
                                    }}
                                >
                                    {game.rooms[0].name}
                                </div>
                            )}
                            <Map
                                isAvailableShown={state.isAvailableRoomShown}
                                activeUnit={state.activeUnit}
                            />
                            {player.isActive && (
                                <div>
                                    {!!game.rooms.length && (
                                        <button onClick={toggleAvailable()}>
                                            Explore
                                        </button>
                                    )}
                                    <button onClick={activateUnit('person')}>
                                        Move Person
                                    </button>
                                    <button onClick={activateUnit('droid')}>
                                        Move Droid
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export const getYourself = ({game}) => {
    const users = game && game.users;
    if (!users) return {};
    return find(propEq('isYou', true), users);
};

export default connect(state => ({
    user: path(['auth', 'user'], state),
    game: state.game,
    player: getYourself(state),
}), {getGame, leaveGame, startGame})(Game);
