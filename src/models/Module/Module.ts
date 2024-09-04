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

export interface ModuleConfig {
  preparedTime: string;
  attendanceDurationMinutes: number; // setting time for module to scan fingerprint since class start
  connectionLifeTimeSeconds: number; // setting for holding connection after connect
  connectionSoundDurationMs: number; // Settings sound duration
  attendanceSoundDurationMs: number;
}
