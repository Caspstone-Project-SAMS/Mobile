import { createSlice } from '@reduxjs/toolkit';

//Not finished
const WebSocketSlice = createSlice({
  name: 'semester',
  initialState: {
    socket: null,
  },
  reducers: {
    connectWebSocket: (state, action) => {
      state.socket = action.payload;
    },
    disconnectWebSocket: (state) => {
      if (state.socket) {
        state.socket.close();
        state.socket = null;
      }
    },
  },
  extraReducers: (builder) => {},
});

export const { connectWebSocket, disconnectWebSocket } = WebSocketSlice.actions;
export default WebSocketSlice.reducer;
