export const NEW_MESSAGE = 'NEW_MESSAGE';
export const newMessage = message => ({
  type: NEW_MESSAGE,
  message
});

export const SEND_MESSAGE = 'SEND_MESSAGE';
export const sendMessage = (message, roomName, socket) => ({
  type: SEND_MESSAGE,
  payload: {message, roomName, socket}
});

//export const setNewMessage = (socket, message, roomName) => (dispatch) => {
//  socket.emit('createMessage', message, roomName, () => {});
//};

export const INITIAL_LOAD = 'INITIAL_LOAD';
export const initialLoad = room => ({
  type: INITIAL_LOAD,
  room
});

export const ROOM_HAS_LOADED = 'ROOM_HAS_LOADED';
export const roomHasLoaded = () => ({
  type: ROOM_HAS_LOADED,
  isLoaded: true
});

export const UPDATE_USER_LIST = 'UPDATE_USER_LIST';
export const updateUserList = userList => ({
  type: UPDATE_USER_LIST,
  userList
});

export const NEW_USER_IN_ROOM = 'socket/NEW_USER_IN_ROOM';
export const newUserInRoom = user => ({
  type: NEW_USER_IN_ROOM,
  user
});

export const USER_LEFT_ROOM = 'USER_LEFT_ROOM';
export const userLeftRoom = username => ({
  type: USER_LEFT_ROOM,
  username
});

export const CLEAR_ROOM = 'CLEAR_ROOM';
export const clearRoom = () => ({
  type: CLEAR_ROOM
});
