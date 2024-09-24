import { Notification } from '../contexts/BackendContext';

export const addNotification = (notifications: Notification[], userId: number, title: string, message: string): Notification => {
  const newNotification: Notification = {
    id: notifications.length + 1,
    userId,
    title,
    message,
    read: false,
    createdAt: new Date()
  };
  return newNotification;
};

export const removeNotification = (notifications: Notification[], id: number): Notification[] => {
  return notifications.filter(notif => notif.id !== id);
};

export const markNotificationAsRead = (notifications: Notification[], id: number): Notification[] => {
  return notifications.map(notif =>
    notif.id === id ? { ...notif, read: true } : notif
  );
};