const lobbyReducerInitialState = {};

export default (state = lobbyReducerInitialState, action) => {
    switch (action.type) {
    case 'SET_CROWDED_ROOMS':
        return {
            ...state,
            crowdedRooms: action.crowdedRooms,
            roomsLoading: false
        };
    case 'GET_CROWDED_ROOMS':
        return {
            ...state,
            roomsLoading: true
        };
    default:
        return state;
    }
};
