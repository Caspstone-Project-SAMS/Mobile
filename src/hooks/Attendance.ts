import axios from 'axios';
import { ATTENDANCE_API } from '.';
import { Attendance } from '../models/Attendance';

const getAttendanceByScheduleId = async (scheduleID: string) => {
  const response = await axios.get(ATTENDANCE_API, {
    params: {
      scheduleID,
    },
  });
  return response.data as Attendance[];
};

export const AttendanceService = {
  getAttendanceByScheduleId,
};
