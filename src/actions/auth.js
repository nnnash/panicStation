export const LOGIN = 'LOGIN';
export const login = user => ({
    type: LOGIN,
    user
});

export const LOGIN_FULFILLED = 'LOGIN_FULFILLED';
export const loginFulfilled = user => ({
    type: LOGIN_FULFILLED,
    user
});

export const LOGIN_ENDED = 'LOGIN_ENDED';
export const loginEnded = user => ({
    type: LOGIN_ENDED,
    user
});

export const LOGIN_HAS_ERRORED = 'LOGIN_HAS_ERRORED';
export const loginHasErrored = (bool, err) => ({
    type: LOGIN_HAS_ERRORED,
    bool,
    error: err
});

export const LOGOUT = 'LOGOUT';
export const logout = () => ({
    type: LOGOUT
});

export const START_LOGOUT = 'START_LOGOUT';
export const startLogout = () => ({
    type: START_LOGOUT
});

export const CREATE_ACCOUNT = 'CREATE_ACCOUNT';
export const createAccount = credentials => ({
    type: CREATE_ACCOUNT,
    credentials
});

export const CREATE_ACCOUNT_HAS_ERRORED = 'CREATE_ACCOUNT_HAS_ERRORED';
export const createAccountHasErrored = () => ({
    type: CREATE_ACCOUNT_HAS_ERRORED,
});
