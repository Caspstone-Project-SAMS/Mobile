import axios from 'axios';
import { ATTENDANCE_API, CLASS_API } from '.';
import { ClassModel, ClassResponse } from '../models/Class';
import { AttendanceReport } from '../models/Attendance';

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

const getClassByID = async (classID: number) => {
  const response = await axios.get(CLASS_API + `/${classID}`);
  return response.data.result as ClassModel;
};

const getClassAttendanceReport = async (classId: string) => {
  const response = await axios.get(ATTENDANCE_API + '/attendance-report', {
    params: {
      classId,
      isExport: false,
    },
  });
  return response.data as AttendanceReport[];
};

export const ClassService = {
  getClassBySemester,
  getClassByID,
  getClassAttendanceReport,
};
