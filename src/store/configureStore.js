import {createStore, combineReducers, applyMiddleware} from 'redux';
import {combineEpics, createEpicMiddleware} from 'redux-observable';
import {ajax} from 'rxjs/observable/dom/ajax';
import {composeWithDevTools} from 'redux-devtools-extension';
import {toast} from 'react-toastify';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';

import * as authEpics from '../epics/auth';
import * as lobbyEpics from '../epics/lobby';
import * as gameEpics from '../epics/game';

import authReducer from '../reducers/auth';
import gameReducer from '../reducers/game';
import lobbyReducer from '../reducers/lobby';

const composeEnhancers = composeWithDevTools({});

const socket = io('http://localhost:3000');
const socketIoMiddleware = createSocketIoMiddleware(socket, 'socket/');

const epics = [authEpics, lobbyEpics, gameEpics]
    .reduce((acc, epic) => {
        const epics = Object.values(epic);
        return acc.concat(epics);
    }, []);

export default () => createStore(
    combineReducers({
        auth: authReducer,
        game: gameReducer,
        lobby: lobbyReducer,
    }),
    composeEnhancers(
        applyMiddleware(socketIoMiddleware,
            createEpicMiddleware(
                combineEpics(...epics),
                {
                    dependencies: {
                        api: ajax,
                        toast
                    }
                }
            )
        )
    )
);
