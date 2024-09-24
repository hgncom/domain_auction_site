import { Notification } from '../contexts/BackendContext';

export const addNotification = (notifications: Notification[], type: 'success' | 'error' | 'info', title: string, message: string): Notification => {
  const newNotification: Notification = {
    id: Date.now(),
    type,
    title,
    message
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