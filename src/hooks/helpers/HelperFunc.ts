import moment from 'moment';

interface WeekDay {
  weekday: string;
  date: Date;
}

const getWeekFromDate = (inputDate: Date): Date[] => {
  const startOfWeek = moment(inputDate).startOf('week');
  const week: Date[] = [];

  for (let i = 0; i < 7; i++) {
    const date = moment(startOfWeek).add(i, 'days').toDate();
    week.push(date);
  }

  return week;
};

const removeDuplicates = (arr: string[]): string[] => {
  const uniqueSet = new Set(arr);
  return Array.from(uniqueSet);
};

const emailChecker = (email: string): boolean => {
  const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return emailRegex.test(email);
};

const randomDelay = () => Math.floor(Math.random() * 550) + 200;

//Not receive string, spaces
const isNumber = (str: any) => {
  // !isNaN(str)
  if (typeof str === 'string' && str.trim() !== '') {
    return !isNaN(str) && Number.isInteger(Number(str));
  }
  return false;
};

const downloadFile = (blobFile, fileName: string) => {
  const href = URL.createObjectURL(blobFile);

  const link = document.createElement('a');
  link.href = href;
  link.setAttribute('download', fileName);
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

export const HelperService = {
  getWeekFromDate,
  removeDuplicates,
  emailChecker,
  randomDelay,
  isNumber,
  downloadFile,
};
