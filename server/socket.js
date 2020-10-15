const socketIO = require('socket.io');
const {propEq, find, path} = require('ramda');
const {Game} = require('./models/game');
const {
    S_GET_GAME,
    S_LEAVE_GAME,
    S_START_GAME,
    S_PLAY_CARD,
    S_GET_CARD_FROM_DECK,
    S_PLACE_ROOM,
    S_ENTER_ROOM,
    S_PUT_ROOM_TO_BOTTOM,
    GAME_RECIEVED,
    USER_JOINED,
    USER_LEFT,
    GAME_STARTED,
    CANNOT_CONNECT,
    ROOM_PLACED,
    ROOM_ENTERED,
    ROOM_PUT_TO_BOTTOM,
} = require('../common/actions/game');

module.exports = function (server) {
    const io = socketIO(server);

    io.sendToPlayers = function (game, type, data = {}) {
        game.users.filter(propEq('connected', true))
            .forEach(user => {
                io.to(user.socketId)
                    .emit('action', {
                        type,
                        data: {
                            ...data,
                            game: game.client(user.username),
                        },
                    });
            });
    };

    io.sendToOtherPlayers = function (game, type, username, data = {}) {
        game.users.filter(propEq('connected', true))
            .forEach(user => {
                if (username === user.username) return;
                io.to(user.socketId)
                    .emit('action', {
                        type,
                        data: {
                            ...data,
                            game: game.client(user.username),
                        },
                    });
            });
    };

    io.on('connection', (socket) => {
        console.log('connected', socket.id);
        socket.on('disconnect', async () => {
            console.log('disconnect', socket.id);
            const game = await Game.findOne({
                users: {$elemMatch: {socketId: socket.id}}
            });
            if (!game) return;
            const {username} = find(propEq('socketId', socket.id), game.users);
            game.onUserLeave(username);
            io.sendToPlayers(game, USER_LEFT, {username});
        });

        socket.on('action', async (action) => {
            const {id: gameId} = action;
            const game = await Game.findOne({id: gameId});
            const username = path(['user', 'username'], action) || find(propEq('socketId', socket.id), game.users);

            switch (action.type) {
                case S_GET_GAME:
                    if (!username || !gameId) {
                        console.log(gameId);
                        throw new Error('got empty user or id');
                    }
                    let newGame;
                    if (!game) {
                        newGame = new Game({id: gameId, users: [{username, socketId: socket.id}]});
                        newGame.save();
                        socket.join(gameId);
                    } else {
                        const canConnect = game.addUser(username, socket.id);
                        if (!canConnect) {
                            socket.emit('action', {
                                type: CANNOT_CONNECT,
                                data: {
                                    msg: 'Game already started',
                                },
                            });
                            break;
                        }
                        socket.join(gameId);
                        io.sendToOtherPlayers(game, USER_JOINED, username, {username});
                    }
                    socket.emit('action', {
                        type: GAME_RECIEVED,
                        data: {
                            game: (game || newGame).client(username),
                            isNew: !!newGame,
                        },
                    });
                    break;

                case S_LEAVE_GAME:
                    socket.leave(gameId, () => {
                        if (game) {
                            game.onUserLeave(username);
                            io.sendToPlayers(game, USER_LEFT, {username});
                        }
                    });
                    break;

                case S_START_GAME:
                    if (game) {
                        game.start()
                            .then(() => io.sendToPlayers(game, GAME_STARTED));
                    }
                    break;

                case S_PLAY_CARD:
                    if (game) {
                        game.playCard(action.data)
                            .then(() => io.sendToPlayers(game, 'cardPlayed'))
                            .catch(err => {
                                console.log(err);
                                if (err.name === 'VersionError') {
                                    setTimeout(() => game.gameplayAction('playCard', action.data)
                                        .then(io.sendToPlayers(game, 'cardPlayed')), 1000);
                                }
                            });
                    }
                    break;

                case S_GET_CARD_FROM_DECK:
                    io.sendToPlayers(game, 'cardTook');
                    break;

                case S_PLACE_ROOM:
                    console.log('game', game);
                    if (game) {
                        game.gameplayAction('placeRoom', action.data)
                            .then(() => console.log(game) || io.sendToPlayers(game, ROOM_PLACED));
                    }
                    break;

                case S_ENTER_ROOM:
                    if (game) {
                        game.gameplayAction('enterRoom', action.data)
                            .then(() => io.sendToPlayers(game, ROOM_ENTERED));
                    }
                    break;

                case S_PUT_ROOM_TO_BOTTOM:
                    if (game) {
                        game.gameplayAction('putRoomToBottom', action.data)
                            .then(() => io.sendToPlayers(game, ROOM_PUT_TO_BOTTOM));
                    }
                    break;

                default:
                    break;
            }
        });
    });

    return io;
};
