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

export const dashboardCalculator = () => {
  //Upcoming class - Tinh toan thoi gian hien tai ->
  // Cap nhat slot tiep theo gan nhat

  //Today class - Tinh toan nhung slot trong ngay co status past
  
  // Subject prepare - Tinh toan nhung mon day co trog ngay,
  // nhung mon hoc da co trang thai past se duoc filter
};
