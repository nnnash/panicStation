const S_GET_GAME = 'socket/GET_GAME';
const getGame = (id, user) => ({
    type: S_GET_GAME,
    id,
    user,
});

const S_LEAVE_GAME = 'socket/LEAVE_GAME';
const leaveGame = (id, user) => ({
    type: S_LEAVE_GAME,
    id,
    user,
});

const S_START_GAME = 'socket/START_GAME';
const startGame = id => ({
    type: S_START_GAME,
    id,
});

const S_PLAY_CARD = 'socket/PLAY_CARD';
const playCard = (id, {username, card, roomId}) => ({
    type: S_PLAY_CARD,
    id,
    data: {
        username,
        card,
        roomId,
    },
});

const S_GET_CARD_FROM_DECK = 'socket/GET_CARD_FROM_DECK';
const getCardFromDeck = (id, username) => ({
    type: S_GET_CARD_FROM_DECK,
    id,
    username,
});

const S_PLACE_ROOM = 'socket/PLACE_ROOM';
const placeRoom = (id, row, column, upsideDown = false) => ({
    type: S_PLACE_ROOM,
    id,
    data: {
        row,
        column,
        upsideDown,
    },
});

const S_ENTER_ROOM = 'socket/ENTER_ROOM';
const enterRoom = (id, row, column, unitId) => ({
    type: S_ENTER_ROOM,
    id,
    data: {
        row,
        column,
        unitId,
    },
});

const S_PUT_ROOM_TO_BOTTOM = 'socket/PUT_ROOM_TO_BOTTOM';
const putRoomToBottom = (id, username) => ({
    type: S_PUT_ROOM_TO_BOTTOM,
    id,
    data: {username},
});


const GAME_RECIEVED = 'GAME_RECIEVED';
const gameRecieved = ({data}) => ({
    type: GAME_RECIEVED,
    data,
});

const USER_JOINED = 'USER_JOINED';
const userJoined = ({data}) => ({
    type: USER_JOINED,
    data,
});

const USER_LEFT = 'USER_LEFT';
const userLeft = ({data}) => ({
    type: USER_LEFT,
    data,
});

const GAME_STARTED = 'GAME_STARTED';
const gameStarted = ({data}) => ({
    type: GAME_STARTED,
    data,
});

const CANNOT_CONNECT = 'CANNOT_CONNECT';
const cannotConnect = ({data}) => ({
    type: CANNOT_CONNECT,
    data,
});

const TOAST = 'TOAST';
const toast = (msg, error) => ({
    type: TOAST,
    msg,
    error,
});

const ROOM_PLACED = 'ROOM_PLACED';
const roomPlaced = ({data}) => ({
    type: ROOM_PLACED,
    data,
});

const ROOM_ENTERED = 'ROOM_ENTERED';
const roomEntered = ({data}) => ({
    type: ROOM_ENTERED,
    data,
});

const ROOM_PUT_TO_BOTTOM = 'ROOM_PUT_TO_BOTTOM';
const roomPutToBottom = ({data}) => ({
    type: ROOM_PUT_TO_BOTTOM,
    data,
});

module.exports = {
    S_GET_GAME,
    getGame,
    S_LEAVE_GAME,
    leaveGame,
    S_START_GAME,
    startGame,
    S_PLAY_CARD,
    playCard,
    S_GET_CARD_FROM_DECK,
    getCardFromDeck,
    S_PLACE_ROOM,
    placeRoom,
    S_ENTER_ROOM,
    enterRoom,

    GAME_RECIEVED,
    gameRecieved,
    USER_JOINED,
    userJoined,
    USER_LEFT,
    userLeft,
    GAME_STARTED,
    gameStarted,
    CANNOT_CONNECT,
    cannotConnect,
    TOAST,
    toast,
    ROOM_PLACED,
    roomPlaced,
    ROOM_ENTERED,
    roomEntered,
};
