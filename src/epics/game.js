import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';

import {
    GAME_RECIEVED,
    USER_JOINED,
    USER_LEFT,
    GAME_STARTED,
    CANNOT_CONNECT,
    TOAST,
    toast,
} from 'common/actions/game';

export const toastEpic = (action$, store, {toast}) =>
    action$.ofType(TOAST)
        .mergeMap(({msg, error}) => {
            if (msg) toast(msg);
            if (error) toast.error(error);
            return Observable.empty();
        });

export const gameRecievedEpic = (action$, store) =>
    action$.ofType(GAME_RECIEVED)
        .map(({data}) => toast(data.isNew ? 'Game created' : 'You joined the game'));

export const userJoinedEpic = (action$, store) =>
    action$.ofType(USER_JOINED)
        .map(({data: {username}}) => toast(`User ${username} has joined the game`));

export const userLeftEpic = (action$, store) =>
    action$.ofType(USER_LEFT)
        .map(({data: {username}}) => toast(`User ${username} has left the game`));

export const cannotConnectEpic = (action$, store) =>
    action$.ofType(CANNOT_CONNECT)
        .map(({data: {msg}}) => toast(null, msg));

export const gameStartedEpic = (action$, store) =>
    action$.ofType(GAME_STARTED)
        .map(() => toast('Game started'));
