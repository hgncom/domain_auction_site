import React from 'react';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Bell } from 'lucide-react';

interface NotificationsProps {
  notifications: { id: number; title: string; message: string }[];
  removeNotification: (id: number) => void;
}

const Notifications: React.FC<NotificationsProps> = ({ notifications, removeNotification }) => (
  <div className="mb-4">
    {notifications.map((note, index) => (
      <Alert key={index} onClose={() => removeNotification(note.id)}>
        <AlertTitle>{note.title}</AlertTitle>
        <AlertDescription>{note.message}</AlertDescription>
        <Bell className="h-4 w-4" />
      </Alert>
    ))}
  </div>
);

export default Notifications;