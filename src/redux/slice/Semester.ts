import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Semester } from '../../models/Semester';
import { SemesterService } from '../../hooks/Semester';

const initialSemester: Semester[] = [];

const initialState = {
  data: initialSemester,
};

const getAllSemester = createAsyncThunk('semester/getAllSemester', async () => {
  try {
    const promise = await SemesterService.getAllSemester();
    return promise.data;
  } catch (error) {
    console.log('err when getSemester');
  }
});

const SemesterSlice = createSlice({
  name: 'semester',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllSemester.fulfilled, (state, action) => {
      const { payload } = action;

      return {
        ...state,
        data: payload,
      };
    });
  },
});

export { getAllSemester };

export default SemesterSlice.reducer;
