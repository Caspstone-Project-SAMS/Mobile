import axios from 'axios';
import { SEMESTER_API } from '.';
import { SemesterDetail } from '../models/Semester';

const getAllSemester = async () => {
  return await axios.get(SEMESTER_API);
};

const getSemesterByID = async (
  semesterID: number,
): Promise<SemesterDetail | null> => {
  console.log(typeof semesterID);
  try {
    const response = await axios.get(`${SEMESTER_API}/${semesterID}`, {
      headers: {
        accept: '*/*',
      },
    });
    return response.data as SemesterDetail;
  } catch (error) {
    console.error('Error on get Semester by ID: ', error);
    return null;
  }
};

export const SemesterService = {
  getAllSemester,
  getSemesterByID,
};
