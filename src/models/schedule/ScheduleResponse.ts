export interface ScheduleResponse {
  scheduleID: number;
  classID: number;
  classCode: string;
  date: string;
  startTime: string;
  endTime: string;
  roomName: string;
  slotNumber: number;
  subjectCode: string;
  status?: 'Past' | 'Current' | 'Upcoming'; //extend
}
