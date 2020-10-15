const mongoose = require('mongoose');
const {uniqBy, prop, pick, reject, propEq, find, omit} = require('ramda');
const c = require('../../common/constants');

const gameLogic = require('../game');

const CardSchema = new mongoose.Schema({
    name: String,
    color: String,
    playable: Boolean,
    played: Boolean,
    useNumber: Number,
    costsActionPoint: Boolean,
    immediatelyPlayed: Boolean,
});

const SideSchema = new mongoose.Schema({
    wall: {
        type: String,
        enum: [c.ROOM_SIDE_TYPE_WALL, c.ROOM_SIDE_TYPE_DOOR, c.ROOM_SIDE_TYPE_LOCKED],
    },
    adjacentRoomId: Number,
});

const RoomSchema = new mongoose.Schema({
    id: Number,
    name: String,
    explored: Boolean,
    walls: [{
        type: String,
        enum: [c.ROOM_SIDE_TYPE_WALL, c.ROOM_SIDE_TYPE_DOOR, c.ROOM_SIDE_TYPE_LOCKED],
    }],
    separated: Boolean,
    sides: {
        1: SideSchema,
        2: SideSchema,
        3: SideSchema,
        4: SideSchema,
    },
    units: [Number],
    subRoomUnits: [Number],
    parasites: [Number],
});

const ParasiteSchema = new mongoose.Schema({
    id: Number,
    health: Number,
    color: String,
});

const UnitSchema = new mongoose.Schema({
    id: Number,
    health: Number,
});

const PlayerSchema = new mongoose.Schema({
    username: {type: String},
    socketId: {type: String},
    connected: {
        type: Boolean,
        default: true,
    },
    team: {
        id: Number,
        name: String,
        color: String,
        person: UnitSchema,
        droid: UnitSchema,
    },
    playedItems: [CardSchema],
    cards: [CardSchema],
    isFirst: Boolean,
    isActive: Boolean,
    isInfected: Boolean,
});

const GameSchema = new mongoose.Schema({
    id: {
        type: String,
        unique: true,
    },
    active: {
        user: String,
        actionsLeft: Number,
    },
    users: [PlayerSchema],
    deck: [CardSchema],
    discardPile: [CardSchema],
    rooms: [RoomSchema],
    map: [[mongoose.Schema.Types.Mixed]],
    status: {
        type: String,
        enum: [c.GAME_STATUS_NEW, c.GAME_STATUS_STARTED, c.GAME_STATUS_ENDED],
        default: 'new',
    },
    parasitesPile: {
        gray: [ParasiteSchema],
        black: [ParasiteSchema],
    },
    winner: String,
});

GameSchema.methods.addUser = function (username, socketId) {
    if (this.status === c.GAME_STATUS_NEW) {
        this.users = uniqBy(prop('username'), [...this.users, {username, socketId}]);
    } else {
        const user = find(propEq('username', username), this.users);
        if (!user) return false;
        user.connected = true;
        user.socketId = socketId;
    }

    return this.save();
};

GameSchema.methods.onUserLeave = function (username) {
    if (this.status === c.GAME_STATUS_NEW) {
        this.users = reject(propEq('username', username), this.users);
    } else {
        const user = find(propEq('username', username), this.users);
        if (user) user.connected = false;
    }

    return this.save();
};

GameSchema.methods.client = function (username) {
    return {
        // ...pick(['id', 'status', 'deck', 'rooms', 'map', 'parasites'], this),
        ...this.toObject(),
        users: this.users.map(({
            username: name,
            team,
            cards,
            connected,
            isFirst,
            isActive,
            isInfected,
        }) => ({
            username: name,
            team,
            cards: username === name ? cards : {length: cards.length},
            isYou: username === name,
            connected,
            isFirst,
            isActive,
            isInfected: username === name ? isInfected : undefined,
        })),
    };
};

GameSchema.methods.start = function () {
    this.status = c.GAME_STATUS_STARTED;
    Object.assign(this, gameLogic.setupGame(this));

    return this.save();
};

GameSchema.methods.gameplayAction = function (action, data) {
    Object.assign(this, gameLogic[action](this, data));
    this.active.actionsLeft--;

    if (this.active.actionsLeft === 0) {
        Object.assign(this, gameLogic.changeActivePlayer(this.toObject()));
    }

    return this.save();
};

const Game = mongoose.model('Game', GameSchema);

module.exports = {Game};
