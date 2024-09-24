import { User } from '../contexts/BackendContext';

export const login = (users: User[], email: string, password: string): User | undefined => {
  return users.find(u => u.email === email && u.password === password);
};

export const register = (users: User[], name: string, email: string, password: string): User => {
  const newUser: User = {
    id: users.length + 1,
    name,
    email,
    password,
    role: 'user',
    permissions: ['view_auctions', 'place_bids'],
    isActive: true,
    lastLogin: new Date(),
    createdAt: new Date()
  };
  return newUser;
};