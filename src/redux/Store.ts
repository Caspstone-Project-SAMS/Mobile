import { configureStore } from '@reduxjs/toolkit';

import Auth from './slice/Auth';
import Schedule from './slice/Schedule';

const Store = configureStore({
  reducer: {
    auth: Auth,
    schedule: Schedule,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
