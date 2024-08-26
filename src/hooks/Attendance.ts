import axios from 'axios';
import { ATTENDANCE_API } from '.';
import { Attendance, UpdateListAttendance } from '../models/Attendance';

const getAttendanceByScheduleId = async (scheduleID: string) => {
  const response = await axios.get(ATTENDANCE_API, {
    params: {
      scheduleID,
      quantity: 50,
      startPage: 1,
      endPage: 5,
    },
  });
  return response.data as Attendance[];
};

const updateListAttendance = async (data: UpdateListAttendance[]) => {
  const response = await axios.put(
    ATTENDANCE_API + '/update-list-student-status',
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return response.data;
};

export const AttendanceService = {
  getAttendanceByScheduleId,
  updateListAttendance,
};
