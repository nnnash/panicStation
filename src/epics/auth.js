import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {
    LOGIN,
    LOGIN_FULFILLED,
    LOGIN_HAS_ERRORED,
    CREATE_ACCOUNT,
    CREATE_ACCOUNT_HAS_ERRORED,
    START_LOGOUT,
    login,
    loginFulfilled,
    loginEnded,
    logout,
} from '../actions/auth';

export const loginEpic = (action$, store, {api, toast}) =>
    action$.ofType(LOGIN)
        .switchMap(({user}) =>
            api.post('/api/users/login', user)
                .map(({response}) => loginFulfilled(response))
                .catch(error => {
                    toast.error(error.response ? error.response.errmsg : 'error');
                    return Observable.of({
                        type: LOGIN_HAS_ERRORED,
                        bool: true,
                        error
                    });
                }));

export const loginFulfilledEpic = action$ =>
    action$.ofType(LOGIN_FULFILLED)
        .map(({user}) => {
            sessionStorage.setItem('user', JSON.stringify(user));
            return loginEnded(user);
        });

export const createAccountEpic = (action$, store, {api, toast}) =>
    action$.ofType(CREATE_ACCOUNT)
        .switchMap(({credentials}) =>
            api.post('/api/users', credentials)
                .map(() => login(credentials))
                .catch(error => {
                    toast.error(error.response.errmsg);
                    return Observable.of({
                        type: CREATE_ACCOUNT_HAS_ERRORED,
                        error
                    });
                }));

export const startLogoutEpic = (action$, store, {api}) =>
    action$.ofType(START_LOGOUT)
        .switchMap(
            () => api.delete('/api/users/me/token', {'x-auth': store.getState().auth.user.token})
                .map(() => {
                    sessionStorage.removeItem('user');
                    return logout();
                })
        );
