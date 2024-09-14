import { configureStore } from '@reduxjs/toolkit';

import Auth from './slice/Auth';
import Schedule from './slice/Schedule';
import Semester from './slice/Semester';
import Websocket from './slice/WebSocket';

const Store = configureStore({
  reducer: {
    auth: Auth,
    schedule: Schedule,
    semester: Semester,
    websocket: Websocket,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
