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
  semesterId: number,
  startDate: string,
  endDate: string,
) => {
  const response = await axios.get(LECTURER_SCHEDULE_API, {
    params: {
      lecturerId,
      semesterId,
      startDate,
      endDate,
      startPage: 1,
      endPage: 10,
      quantity: 50,
    },
  });
  return response.data;
};

const getScheduleByWeek = async (
  lecturerId: string,
  semesterId: number,
  quantity: number,
  startDate: string,
  endDate: string,
) => {
  const response = await axios.get(LECTURER_SCHEDULE_API, {
    params: {
      lecturerId,
      semesterId,
      quantity,
      startDate,
      endDate,
    },
  });
  return response.data;
};

export const ScheduleService = {
  getScheduleByDay,
  getScheduleByWeek,
};
