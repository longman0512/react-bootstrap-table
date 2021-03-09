import io from 'socket.io-client';
let socket = null;

export const setSocket = () => {
  // socket = io("http://127.0.0.1:4001");
}

export const socketClient = io("http://127.0.0.1:4001");

export const onUserChange = (callback) => {
  socket.on('users_list_changed', (data) => callback(data));
}

export const onMessageReceived = (socketListenId, callback) => {
  socket.on(socketListenId, (data, modify) => callback(data, modify));
}

export const emitEvent = (event, data) => {
    socket.emit(event, data);
}

export const disconnect = () => {
    socket.disconnect()
}