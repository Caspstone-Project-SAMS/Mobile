import moment from 'moment';

interface WeekDay {
  weekday: string;
  date: Date;
}

const getWeekFromDate = (inputDate: Date): WeekDay[] => {
  const startOfWeek = moment(inputDate).startOf('week');
  const week: WeekDay[] = [];

  for (let i = 0; i < 7; i++) {
    const date = moment(startOfWeek).add(i, 'days').toDate();
    week.push({
      weekday: moment(date).format('ddd'),
      date: date,
    });
  }

  return week;
};

const removeDuplicates = (arr: string[]): string[] => {
  const uniqueSet = new Set(arr);
  return Array.from(uniqueSet);
};

export const HelperService = {
  getWeekFromDate,
  removeDuplicates,
};
