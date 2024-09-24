import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';

interface Notification {
  id: number;
  type: 'success' | 'error';
  message: string;
}

interface NotificationsProps {
  notifications: Notification[];
  removeNotification: (id: number) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, removeNotification }) => (
  <div className="mb-4">
    {notifications.map((notification) => (
      <Alert
        key={notification.id}
        className={`mb-4 ${notification.type === 'error' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}
        onClose={() => removeNotification(notification.id)}
      >
        <AlertTitle>{notification.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
        <AlertDescription>{notification.message}</AlertDescription>
      </Alert>
    ))}
  </div>
);

export default Notifications;