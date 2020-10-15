import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
    GET_CROWDED_ROOMS,
    setCrowdedRooms
} from '../actions/lobby';

export const getCrowdedRoomsEpic = (action$, store, {api, toast}) =>
    action$.ofType(GET_CROWDED_ROOMS)
        .switchMap(() =>
            api.get('/api/rooms/crowded', {
                'x-auth': store.getState().auth.user.token
            })
                .map(({response}) => setCrowdedRooms(response))
                .catch(error => {
                    toast.error(error.response ? error.response.errmsg : error.message);
                    return Observable.of({
                        type: 'ERROR',
                        error
                    });
                }));
