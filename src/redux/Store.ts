import { configureStore } from '@reduxjs/toolkit';

import Auth from './slice/Auth';
import Schedule from './slice/Schedule';
import Semester from './slice/Semester';

const Store = configureStore({
  reducer: {
    auth: Auth,
    schedule: Schedule,
    semester: Semester,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
