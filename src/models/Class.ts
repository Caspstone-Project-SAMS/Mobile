export interface ClassResponse {
  title: string;
  result: ClassModel[];
}

export interface ClassModel {
  classID: number;
  classCode: string;
  classStatus: number;
  slotType: SlotType;
  semester: Semester;
  room: Room;
  subject: Subject;
  lecturer: Lecturer;
  students?: Student[];
  schedules?: any[];
}

export interface Student {
  id: string;
  displayName: string;
  avatar?: string;
  email: string;
  studentCode: string;
  absencePercentage: number;
}

interface SlotType {
  slotTypeID: number;
  typeName: string;
  description: string;
  status: number;
  sessionCount: number;
}

interface Semester {
  semesterID: number;
  semesterCode: string;
  semesterStatus: number;
  startDate: string;
  endDate: string;
}

interface Room {
  roomID: number;
  roomName: string;
  roomDescription: string;
  roomStatus: number;
}

interface Subject {
  subjectID: number;
  subjectCode: string;
  subjectName: string;
  subjectStatus: number;
}

interface Lecturer {
  id: string;
  displayName: string;
  avatar: string;
  email: string;
  department?: string;
}
