export interface ModuleActivityBySchedule {
  title: string;
  result: ModuleActivity[];
}

export interface ModuleActivity {
  moduleActivityId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  isSuccess: boolean;
  errors: [];
  preparationTask?: PrepareTask;
  module: ModuleBySchedule;
}

interface PrepareTask {
  progress: number;
  preparedScheduleId: number;
  preparedSchedules: preparedSchedule[];
  totalFingers: number;
  uploadedFingers: number;
}

export interface ModuleBySchedule {
  moduleID: number;
  status: number;
  connectionStatus?: boolean;
  mode: number;
  autoPrepare: boolean;
}

export interface preparedSchedule {
  scheduleId: number;
  totalFingers: number;
  uploadedFingers: number;
}
