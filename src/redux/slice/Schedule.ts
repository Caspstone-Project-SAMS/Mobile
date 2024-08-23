import moment from 'moment';
import axios, { AxiosError } from 'axios';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { ScheduleResponse } from '../../models/schedule/ScheduleResponse';
import { ScheduleService } from '../../hooks/Schedule';
import {
  formatScheduleRepsonse,
  validateStatusSchedule,
} from '../../hooks/helpers/ScheduleHelper';

type Schedule = {
  data: ScheduleResponse[];
  todaySchedules: ScheduleResponse[];
  loading: boolean;
  error: string;
};

type ScheduleItem = {
  day: string;
  schedules: ScheduleResponse[];
};

const initialState: Schedule = {
  data: [],
  todaySchedules: [],
  loading: false,
  error: '',
};

const formatDate = (date: Date) => {
  const fmtData = moment(date).format('YYYY-MM-DD');
  return fmtData;
};

const serializeAxiosErr = (error: AxiosError) => {
  return {
    message: error.message,
    response: {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
    },
    config: error.config,
    code: error.code,
  };
};

const getTodaySchedule = createAsyncThunk(
  'schedule/today-schedule',
  async (
    arg: { lecturerId: string; semesterId: number },
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

const getScheduleByDay = createAsyncThunk(
  'schedule/scheduleByDay',
  async (
    arg: { lecturerId: string; semesterId: number; date: string },
    { rejectWithValue },
  ) => {
    const { lecturerId, semesterId, date } = arg;
    try {
      const getPromise = await ScheduleService.getScheduleByDay(
        lecturerId,
        semesterId,
        date, // startday & endday in one day - YYYY-MM-DD
        date,
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

const getScheduleByWeek = createAsyncThunk(
  'calendar/scheduleByWeek',
  async (
    arg: { lecturerID: string; semesterID: number; week: Date[] },
    { rejectWithValue },
  ) => {
    try {
      const { lecturerID, semesterID, week } = arg;
      let startDate;
      let endDate;
      if (week.length === 7) {
        startDate = formatDate(week[0]);
        endDate = formatDate(week[6]);
        const schedulePromise = await ScheduleService.getScheduleByWeek(
          lecturerID,
          semesterID,
          50,
          startDate,
          endDate,
        );
        // console.log('Schedule promise ', schedulePromise);
        return schedulePromise;
      }
      return rejectWithValue('Currently support get data in week view');
    } catch (error) {
      if (
        axios.isAxiosError(error) &&
        error.response?.data === 'Lecturer not have any Schedule'
      ) {
        console.log('No data');
      }
      console.log('Error when get schedule', error.response?.data);
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

      state.data = [];
      state.todaySchedules = [];
      payload.forEach((newItem: ScheduleResponse) => {
        //Calculate schedule status
        const formattedValue = formatScheduleRepsonse(newItem);
        state.data.push(formattedValue);
        state.todaySchedules.push(formattedValue);

        //Hold previous data and pushing new in array
        // const existingItemIndex = state.data.findIndex(
        //   (item) =>
        //     item.date === formattedValue.date &&
        //     item.slotNumber === formattedValue.slotNumber,
        // );
        // if (existingItemIndex !== -1) {
        //   state.data[existingItemIndex] = formattedValue;
        // } else {
        //   state.data.push(formattedValue);
        // }
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
    builder.addCase(getScheduleByDay.fulfilled, (state, { payload }) => {
      // console.log('Change her in schedule ', payload);
      state.loading = false;

      state.data = [];
      payload.forEach((newItem: ScheduleResponse) => {
        //Calculate schedule status
        const formattedValue = formatScheduleRepsonse(newItem);
        state.data.push(formattedValue);
      });
    });
    builder.addCase(getScheduleByDay.rejected, (state, { payload }) => {
      // console.log('Change her in schedule ', payload);
      state.loading = false;
      state.data = [];
    });

    builder.addCase(getScheduleByWeek.fulfilled, (state, { payload }) => {
      // console.log('Change her in schedule ', payload);
      state.loading = false;

      state.data = [];
      payload.forEach((newItem: ScheduleResponse) => {
        //Calculate schedule status
        const formattedValue = formatScheduleRepsonse(newItem);
        state.data.push(formattedValue);
      });
    });
    builder.addCase(getScheduleByWeek.rejected, (state, action) => {
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

export { getTodaySchedule, getScheduleByDay, getScheduleByWeek };

export default ScheduleSlice.reducer;
