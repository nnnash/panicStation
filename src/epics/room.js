import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  SEND_MESSAGE,
  INITIAL_LOAD,
  roomHasLoaded
} from '../actions/room';

export const sendMessageEpic = (action$, store, {webSocket}) =>
  action$.ofType(SEND_MESSAGE)
    .do(({payload}) => {
      const {socket, message, room} = payload;
      socket.emit('createMessage', message, room, () => console.log(arguments));
    });

export const initialLoadEpic = (action$, store, {api, toast}) =>
  action$.ofType(INITIAL_LOAD)
    .map(() => roomHasLoaded());
