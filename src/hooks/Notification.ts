import axios from 'axios';
import { NOTIFICATION_API } from '.';
import { Notification } from '../models/Notification';

const getNotificationsById = async (userId: string) => {
  const promise = await axios.get(NOTIFICATION_API, {
    params: {
      startPage: 1,
      endPage: 10,
      quantity: 50,
      userId,
    },
  });
  return promise.data.result as Notification[];
};

const updateReadedNotification = async (notificationID: number) => {
  const promise = await axios.put(NOTIFICATION_API + '/read', [notificationID]);
  return promise.data;
};

export const NotificationService = {
  getNotificationsById,
  updateReadedNotification,
};
