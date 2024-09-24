import React, { useEffect } from 'react';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { useBackend } from '../../contexts/BackendContext';

export const NotificationSystem: React.FC = () => {
  const { notifications, removeNotification } = useBackend();

  useEffect(() => {
    // Auto-remove notifications after 5 seconds
    const timer = setInterval(() => {
      if (notifications.length > 0) {
        removeNotification(notifications[0].id);
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [notifications, removeNotification]);

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <Alert
          key={notification.id}
          variant={notification.type === 'error' ? 'destructive' : 'default'}
          onClose={() => removeNotification(notification.id)}
        >
          <AlertTitle>{notification.title}</AlertTitle>
          <AlertDescription>{notification.message}</AlertDescription>
        </Alert>
      ))}
    </div>
  );
};