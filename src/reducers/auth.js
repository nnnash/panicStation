export default (state = {}, action) => {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isLoading: true
            };
        case 'LOGIN_FULFILLED':
            return {
                ...state,
                isLoading: false
            };
        case 'LOGIN_ENDED':
            return {
                ...state,
                user: action.user
            };
        case 'LOGIN_HAS_ERRORED':
            return {
                ...state,
                hasErrored: action.bool,
                error: action.error
            };
        case 'CREATE_ACCOUNT':
            return {
                ...state,
                accountCreating: true
            };
        case 'CREATE_ACCOUNT_HAS_ERRORED':
            return {
                ...state,
                accountCreating: false,
                error: action.error
            };
        case 'LOGOUT':
            return {};
        default:
            return state;
    }
};
