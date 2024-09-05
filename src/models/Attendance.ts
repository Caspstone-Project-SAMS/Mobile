export interface Attendance {
  attendanceStatus: number;
  comments?: string;
  studentID: string;
  studentCode: string;
  studentName: string;
  email: string;
  isAuthenticated: boolean;
  avatar?: string;
}

export interface UpdateListAttendance {
  scheduleID: number;
  attendanceStatus: number;
  attendanceTime: string; //ISO string format
  studentID: string;
  comments?: string;
}

export interface AttendanceReport {
  studentCode: string;
  studentName: string;
  absencePercentage: number;
  attendanceRecords: AttendanceRecord[];
}

interface AttendanceRecord {
  date: string;
  slotNumber: number;
  status: number;
}
