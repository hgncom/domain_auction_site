import { ActivityLog } from '../contexts/BackendContext';

export const logActivity = (activityLogs: ActivityLog[], userId: number, action: string): ActivityLog => {
  const newLog: ActivityLog = {
    id: activityLogs.length + 1,
    userId,
    action,
    timestamp: new Date(),
  };
  return newLog;
};

export const getUserActivityLogs = (activityLogs: ActivityLog[], userId: number): ActivityLog[] => {
  return activityLogs.filter(log => log.userId === userId);
};