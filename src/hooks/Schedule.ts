import axios from 'axios';
import { LECTURER_SCHEDULE_API } from '.';

type DateString = string & { __brand: 'DateString' };

const createDateString = (value: string): DateString => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(value)) {
    throw new Error('Invalid date format. Please use YYYY-MM-DD.');
  }
  return value as DateString;
};

const getScheduleByDay = async (
  lecturerId: string,
  semesterId: string,
  startDate: string,
  endDate: string,
) => {
  const response = await axios.get(LECTURER_SCHEDULE_API, {
    params: {
      lecturerId,
      semesterId,
      startDate,
      endDate,
    },
  });
  return response.data;
};

export const ScheduleService = {
  getScheduleByDay,
};
