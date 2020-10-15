import {path} from 'ramda';
import {
    S_GET_GAME,
    GAME_RECIEVED,
    USER_JOINED,
    USER_LEFT,
    GAME_STARTED,
} from 'common/actions/game';

export default (state = {}, action) => {
    const game = path(['data', 'game'], action);
    if (game && game.__v && state.__v && state.__v > game.__v) return {...state};
    switch (action.type) {
        case S_GET_GAME:
            return {
                isLoading: true
            };
        case GAME_RECIEVED:
            return {
                ...state,
                ...game,
                isNew: action.data.isNew,
                isLoading: undefined,
            };
        case USER_JOINED:
        case USER_LEFT:
        case GAME_STARTED:
            return {
                ...state,
                ...game,
            };
        default:
            return {
                ...state,
                ...game,
            };
    }
};
