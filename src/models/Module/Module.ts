export interface Module {
  attendanceDurationMinutes: number;
  attendanceSound: boolean;
  attendanceSoundDurationMs: number;
  autoPrepare: boolean;
  connectionLifeTimeSeconds: number;
  connectionSound: boolean;
  connectionSoundDurationMs: number;
  connectionStatus: number;
  employee: Employee[];
  mode: number;
  moduleActivities: any[];
  moduleID: number;
  preparedTime: string;
  status: number;
}

interface Employee {
  userId: string;
  employeeID: string;
  displayName: string;
  avatar: string;
  email: string;
  phoneNumber: string;
  department: string;
}
