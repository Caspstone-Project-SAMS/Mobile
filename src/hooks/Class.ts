import axios from 'axios';
import { CLASS_API } from '.';
import { ClassResponse } from '../models/Class';

const getClassBySemester = async (lecturerId: string, semesterId: number) => {
  const response = await axios.get(CLASS_API, {
    params: {
      lecturerId,
      semesterId,
      startPage: 1,
      endPage: 10,
      quantity: 50,
    },
  });
  return response.data as ClassResponse;
};

export const ClassService = {
  getClassBySemester,
};
