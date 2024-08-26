import { ScheduleResponse } from '../../models/schedule/ScheduleResponse';

type ScheduleStatus = 'Past' | 'Current' | 'Upcoming';

export const validateStatusSchedule = (
  startTime: Date,
  endTime: Date,
): ScheduleStatus => {
  const currentTime = new Date();
  //future/current event
  if (currentTime.valueOf() - endTime.valueOf() <= 0) {
    if (currentTime.valueOf() - startTime.valueOf() >= 0) {
      return 'Current';
    }
    return 'Upcoming';
  } else {
    return 'Past';
  }
};

export const formatScheduleRepsonse = (schedule: ScheduleResponse) => {
  const dateArr = schedule.date.split('-');
  const startArr = schedule.startTime.split(':');
  const endArr = schedule.endTime.split(':');

  const formatTime = {
    year: Number(dateArr[0]),
    month: Number(dateArr[1]),
    day: Number(dateArr[2]),
    startHour: Number(startArr[0]),
    startMin: Number(startArr[1]),
    endHour: Number(endArr[0]),
    endMin: Number(endArr[1]),
  };
  const status = validateStatusSchedule(
    new Date(
      formatTime.year,
      formatTime.month - 1,
      formatTime.day,
      formatTime.startHour,
      formatTime.startMin,
    ),
    new Date(
      formatTime.year,
      formatTime.month - 1,
      formatTime.day,
      formatTime.endHour,
      formatTime.endMin,
    ),
  );

  schedule.status = status;
  return schedule;
};

export const dashboardCalculator = () => {
  //Upcoming class - Tinh toan thoi gian hien tai ->
  // Cap nhat slot tiep theo gan nhat
  //Today class - Tinh toan nhung slot trong ngay co status past
  // Subject prepare - Tinh toan nhung mon day co trog ngay,
  // nhung mon hoc da co trang thai past se duoc filter
};
