export interface Notification {
  notificationID: number;
  title: string;
  description: string;
  timeStamp: string;
  read: boolean;
  moduleId: number;
  moduleActivityId: number;
  scheduleID?: any;
  notificationType: {
    notificationTypeID: number;
    typeName?: any;
    typeDescription: string;
  };
  user?: any;
}
