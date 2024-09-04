import axios from 'axios';
import { ATTENDANCE_API, CLASS_API } from '.';
import { ClassModel, ClassResponse } from '../models/Class';
import { HelperService } from './helpers/HelperFunc';
import { Toast } from 'react-native-toast-notifications';

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

const downloadReportExcel = async (classId: string, classCode: string) => {
  try {
    const response = await axios(`${ATTENDANCE_API}/attendance-report`, {
      params: {
        classId: classId,
        isExport: true,
      },
      responseType: 'blob',
    });

    const blobFile = response.data;
    HelperService.downloadFile(blobFile, `Class_Report_${classCode}`);
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 400) {
        Toast.show('No data available for export.', {
          type: 'warning',
          placement: 'top',
        });
      } else {
        Toast.show('Unknown error occured', {
          type: 'danger',
          placement: 'top',
        });
      }
    }
  }
};

export const ClassService = {
  getClassBySemester,
  getClassByID,
  downloadReportExcel,
};
