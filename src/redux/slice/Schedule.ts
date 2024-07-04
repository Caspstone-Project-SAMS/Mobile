import moment from 'moment';
import axios, { AxiosError } from 'axios';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ScheduleResponse } from '../../models/schedule/ScheduleResponse';
import { ScheduleService } from '../../hooks/Schedule';
import { validateStatusSchedule } from '../../hooks/helpers/ScheduleHelper';

type Schedule = {
  data: ScheduleResponse[];
  loading: boolean;
  error: string;
};

type ScheduleItem = {
  day: string;
  schedules: ScheduleResponse[];
};

const initialState: Schedule = {
  data: [],
  loading: false,
  error: '',
};

const serializeAxiosErr = (error: AxiosError) => {
  return {
    message: error.message,
    response: {
      status: error.response.status,
      data: error.response.data,
      headers: error.response.headers,
    },
    config: error.config,
    code: error.code,
  };
};

const getTodaySchedule = createAsyncThunk(
  'schedule/today-schedule',
  async (
    arg: { lecturerId: string; semesterId: string },
    { rejectWithValue },
  ) => {
    const { lecturerId, semesterId } = arg;
    try {
      const currentDay = moment().format('YYYY-MM-DD');
      const getPromise = await ScheduleService.getScheduleByDay(
        lecturerId,
        semesterId,
        currentDay, // startday & endday in one day
        currentDay,
      );
      return getPromise;
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        const errorRsp = serializeAxiosErr(error);
        return rejectWithValue(JSON.stringify(errorRsp));
      }
      return rejectWithValue(error.message.data);
    }
  },
);

const ScheduleSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    //
  },
  extraReducers: (builder) => {
    builder.addCase(getTodaySchedule.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getTodaySchedule.fulfilled, (state, action) => {
      state.loading = false;
      const { payload } = action;

      payload.forEach((newItem: ScheduleResponse) => {
        //Calculate schedule status
        const dateArr = newItem.date.split('-');
        const startArr = newItem.startTime.split(':');
        const endArr = newItem.endTime.split(':');

        const formatTime = {
          year: Number(dateArr[0]),
          month: Number(dateArr[1]),
          day: Number(dateArr[2]),
          startHour: Number(startArr[0]),
          startMin: Number(startArr[1]),
          endHour: Number(endArr[0]),
          endMin: Number(endArr[1]),
        };
        const status = validateStatusSchedule(
          new Date(
            formatTime.year,
            formatTime.month - 1,
            formatTime.day,
            formatTime.startHour,
            formatTime.startMin,
          ),
          new Date(
            formatTime.year,
            formatTime.month - 1,
            formatTime.day,
            formatTime.endHour,
            formatTime.endMin,
          ),
        );
        console.log(
          'Time start: ',
          formatTime.year,
          formatTime.month - 1,
          formatTime.day,
          formatTime.startHour,
          formatTime.startMin,
        );
        newItem.status = status;
        console.log('After changed', newItem);
        const existingItemIndex = state.data.findIndex(
          (item) =>
            item.date === newItem.date &&
            item.slotNumber === newItem.slotNumber,
        );
        if (existingItemIndex !== -1) {
          state.data[existingItemIndex] = newItem;
        } else {
          state.data.push(newItem);
        }
      });
    });
    builder.addCase(getTodaySchedule.rejected, (state, action) => {
      const { payload } = action;
      const errorResponse = JSON.parse(String(payload));
      const errMsg = errorResponse.response.data;

      //   console.log('Got error here ', errorResponse);
      state.loading = false;
      if (errMsg) {
        state.error = errMsg;
      }
    });
  },
});

export { getTodaySchedule };

export default ScheduleSlice.reducer;
