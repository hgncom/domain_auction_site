import { User } from '../contexts/BackendContext';

export const updateUser = (users: User[], id: number, updates: Partial<User>): User => {
  const updatedUsers = users.map(user =>
    user.id === id ? { ...user, ...updates } : user
  );
  return updatedUsers.find(u => u.id === id)!;
};

export const removeUser = (users: User[], id: number): User[] => {
  return users.filter(user => user.id !== id);
};

export const resetUserPassword = (users: User[], id: number): User => {
  const newPassword = Math.random().toString(36).slice(-8);
  return updateUser(users, id, { password: newPassword });
};