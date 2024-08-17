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
