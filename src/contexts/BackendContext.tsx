import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { login, register } from '../utils/authUtils';
import { addDomain, updateDomain, removeDomain } from '../utils/domainUtils';
import { updateUser, removeUser, resetUserPassword } from '../utils/userUtils';
import { logActivity, getUserActivityLogs } from '../utils/activityLogUtils';
import { exportData } from '../utils/exportUtils';
import { addNotification, removeNotification } from '../utils/notificationUtils';

export interface Domain {
  id: number;
  name: string;
  currentBid: number;
  startingBid: number;
  endTime: Date;
  description: string;
  minimumBidIncrement: number;
  reservePrice: number | null;
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'moderator' | 'user';
  permissions: string[];
  isActive: boolean;
  lastLogin: Date;
  createdAt: Date;
}

export interface Bid {
  id: number;
  userId: number;
  domainId: number;
  amount: number;
  date: Date;
}

export interface Notification {
  id: number;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

export interface ActivityLog {
  id: number;
  userId: number;
  action: string;
  timestamp: Date;
}

interface BackendContextType {
  domains: Domain[];
  users: User[];
  bids: Bid[];
  currentUser: (User & { bids: Bid[] }) | null;
  notifications: Notification[];
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  placeBid: (domainId: number, amount: number) => Promise<boolean>;
  addNotification: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  removeNotification: (id: number) => void;
  addDomain: (domain: Omit<Domain, 'id'>) => Promise<Domain>;
  updateDomain: (id: number, updatedDomain: Partial<Domain>) => Promise<Domain>;
  removeDomain: (id: number) => Promise<boolean>;
  removeUser: (id: number) => Promise<boolean>;
  updateUser: (id: number, updates: Partial<User>) => Promise<User>;
  resetUserPassword: (userId: number) => Promise<void>;
  getUserActivityLogs: (userId: number) => Promise<ActivityLog[]>;
  getAuctionStatistics: () => Promise<{
    totalBids: number;
    averageBid: number;
    highestBid: number;
    mostActiveDomain: string;
    mostActiveUser: string;
  }>;
  exportData: (dataType: 'domains' | 'users' | 'bids') => Promise<string>;
  fetchUpdatedDomains: () => Promise<Domain[]>;
}

const BackendContext = createContext<BackendContextType | undefined>(undefined);

export const BackendProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [currentUser, setCurrentUser] = useState<(User & { bids: Bid[] }) | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    // Simulate fetching initial data
    setDomains([
      { id: 1, name: 'example.com', currentBid: 1000, startingBid: 1000, endTime: new Date(Date.now() + 86400000), description: 'A premium .com domain', minimumBidIncrement: 50, reservePrice: 1500 },
      { id: 2, name: 'mydomain.net', currentBid: 500, startingBid: 500, endTime: new Date(Date.now() + 172800000), description: 'Versatile .net domain', minimumBidIncrement: 25, reservePrice: null },
    ]);

    setUsers([
      { id: 1, name: 'John Doe', email: 'john@example.com', password: 'password123', role: 'admin', permissions: ['all'], isActive: true, lastLogin: new Date(), createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      { id: 2, name: 'Jane Smith', email: 'jane@example.com', password: 'password456', role: 'user', permissions: ['view_auctions', 'place_bids'], isActive: true, lastLogin: new Date(), createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000) },
    ]);

    setBids([
      { id: 1, userId: 2, domainId: 1, amount: 1000, date: new Date(Date.now() - 1000000) },
    ]);
  }, []);

  const addNotificationToState = useCallback((type: 'success' | 'error' | 'info', title: string, message: string) => {
    const newNotification = addNotification(notifications, type, title, message);
    setNotifications(prev => [...prev, newNotification]);
  }, [notifications]);

  const removeNotificationFromState = useCallback((id: number) => {
    setNotifications(prev => removeNotification(prev, id));
  }, []);

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    const user = login(users, email, password);
    if (user) {
      const updatedUser = { ...user, lastLogin: new Date() };
      setCurrentUser({ ...updatedUser, bids: bids.filter(b => b.userId === user.id) });
      updateUser(users, user.id, updatedUser);
      logActivity(activityLogs, user.id, 'User logged in');
      addNotificationToState('success', 'Login Successful', `Welcome back, ${user.name}!`);
      return true;
    }
    addNotificationToState('error', 'Login Failed', 'Invalid email or password.');
    return false;
  };

  const registerUser = async (name: string, email: string, password: string): Promise<boolean> => {
    if (users.some(u => u.email === email)) {
      addNotificationToState('error', 'Registration Failed', 'Email already in use.');
      return false;
    }
    const newUser = register(users, name, email, password);
    setUsers([...users, newUser]);
    setCurrentUser({ ...newUser, bids: [] });
    logActivity(activityLogs, newUser.id, 'User registered');
    addNotificationToState('success', 'Registration Successful', `Welcome, ${newUser.name}!`);
    return true;
  };

  const logoutUser = () => {
    if (currentUser) {
      logActivity(activityLogs, currentUser.id, 'User logged out');
      addNotificationToState('info', 'Logged Out', 'You have been successfully logged out.');
    }
    setCurrentUser(null);
  };

  const placeBidOnDomain = async (domainId: number, amount: number): Promise<boolean> => {
    if (!currentUser) {
      addNotificationToState('error', 'Bid Failed', 'You must be logged in to place a bid.');
      return false;
    }

    const domain = domains.find(d => d.id === domainId);
    if (!domain || amount <= domain.currentBid || amount < (domain.currentBid + domain.minimumBidIncrement)) {
      addNotificationToState('error', 'Bid Failed', 'Invalid bid amount.');
      return false;
    }

    const newBid: Bid = {
      id: bids.length + 1,
      userId: currentUser.id,
      domainId,
      amount,
      date: new Date()
    };

    setBids([...bids, newBid]);
    setDomains(domains.map(d =>
      d.id === domainId ? { ...d, currentBid: amount } : d
    ));

    setCurrentUser(user => {
      if (!user) return null;
      return {
        ...user,
        bids: [...user.bids, newBid]
      };
    });

    addNotificationToState('success', 'Bid Placed', `Your bid of $${amount} on ${domain.name} was successful!`);
    logActivity(activityLogs, currentUser.id, `Placed bid of $${amount} on domain ${domain.name}`);
    return true;
  };

  const addDomainToSystem = async (domain: Omit<Domain, 'id'>): Promise<Domain> => {
    const newDomain = addDomain(domains, domain);
    setDomains([...domains, newDomain]);
    logActivity(activityLogs, currentUser?.id || 0, `Added new domain: ${domain.name}`);
    addNotificationToState('success', 'Domain Added', `New domain ${domain.name} has been added to the system.`);
    return newDomain;
  };

  const updateDomainInSystem = async (id: number, updatedDomain: Partial<Domain>): Promise<Domain> => {
    const updated = updateDomain(domains, id, updatedDomain);
    setDomains(domains.map(d => d.id === id ? updated : d));
    logActivity(activityLogs, currentUser?.id || 0, `Updated domain: ${domains.find(d => d.id === id)?.name}`);
    addNotificationToState('success', 'Domain Updated', `Domain ${updated.name} has been updated.`);
    return updated;
  };

  const removeDomainFromSystem = async (id: number): Promise<boolean> => {
    const domainName = domains.find(d => d.id === id)?.name;
    setDomains(removeDomain(domains, id));
    logActivity(activityLogs, currentUser?.id || 0, `Removed domain: ${domainName}`);
    addNotificationToState('info', 'Domain Removed', `Domain ${domainName} has been removed from the system.`);
    return true;
  };

  const removeUserFromSystem = async (id: number): Promise<boolean> => {
    const userName = users.find(u => u.id === id)?.name;
    setUsers(removeUser(users, id));
    if (currentUser && currentUser.id === id) {
      setCurrentUser(null);
    }
    logActivity(activityLogs, currentUser?.id || 0, `Removed user: ${userName}`);
    addNotificationToState('info', 'User Removed', `User ${userName} has been removed from the system.`);
    return true;
  };

  const updateUserInSystem = async (id: number, updates: Partial<User>): Promise<User> => {
    const updated = updateUser(users, id, updates);
    setUsers(users.map(u => u.id === id ? updated : u));
    logActivity(activityLogs, currentUser?.id || 0, `Updated user: ${users.find(u => u.id === id)?.name}`);
    addNotificationToState('success', 'User Updated', `User ${updated.name} has been updated.`);
    return updated;
  };

  const resetUserPasswordInSystem = async (userId: number): Promise<void> => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const updated = resetUserPassword(users, userId);
      setUsers(users.map(u => u.id === userId ? updated : u));
      console.log(`Password reset for ${user.email}. New password: ${updated.password}`);
      logActivity(activityLogs, currentUser?.id || 0, `Reset password for user: ${user.name}`);
      addNotificationToState('success', 'Password Reset', `Password for ${user.name} has been reset.`);
    }
  };

  const getAuctionStatisticsFromSystem = async () => {
    const totalBids = bids.length;
    const averageBid = totalBids > 0 ? bids.reduce((sum, bid) => sum + bid.amount, 0) / totalBids : 0;
    const highestBid = totalBids > 0 ? Math.max(...bids.map(bid => bid.amount)) : 0;

    const domainBidCounts = bids.reduce((acc, bid) => {
      acc[bid.domainId] = (acc[bid.domainId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const userBidCounts = bids.reduce((acc, bid) => {
      acc[bid.userId] = (acc[bid.userId] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    const mostActiveDomainId = Object.entries(domainBidCounts).reduce((a, b) => a[1] > b[1] ? a : b, ['0', 0])[0];
    const mostActiveUserId = Object.entries(userBidCounts).reduce((a, b) => a[1] > b[1] ? a : b, ['0', 0])[0];

    const mostActiveDomain = domains.find(d => d.id === Number(mostActiveDomainId))?.name || '';
    const mostActiveUser = users.find(u => u.id === Number(mostActiveUserId))?.name || '';

    return {
      totalBids,
      averageBid,
      highestBid,
      mostActiveDomain,
      mostActiveUser
    };
  };

  const fetchUpdatedDomains = useCallback(async (): Promise<Domain[]> => {
    // In a real application, this would be an API call
    // For now, we'll just return the current domains
    return domains;
  }, [domains]);

  const checkAuctionUpdates = useCallback(() => {
    domains.forEach((domain) => {
      const userBid = bids.find((bid) => bid.domainId === domain.id && bid.userId === currentUser?.id);
      if (userBid && userBid.amount < domain.currentBid) {
        addNotificationToState('info', 'Outbid', `You've been outbid on ${domain.name}. Current bid is $${domain.currentBid}.`);
      }

      const timeLeft = new Date(domain.endTime).getTime() - Date.now();
      if (timeLeft <= 60000 && timeLeft > 0) { // Less than 1 minute left
        addNotificationToState('info', 'Auction Ending Soon', `The auction for ${domain.name} is ending in less than a minute!`);
      }
    });
  }, [domains, bids, currentUser, addNotificationToState]);

  useEffect(() => {
    const intervalId = setInterval(checkAuctionUpdates, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, [checkAuctionUpdates]);

  return (
    <BackendContext.Provider value={{
      domains,
      users,
      bids,
      currentUser,
      notifications,
      login: loginUser,
      register: registerUser,
      logout: logoutUser,
      placeBid: placeBidOnDomain,
      addNotification: addNotificationToState,
      removeNotification: removeNotificationFromState,
      addDomain: addDomainToSystem,
      updateDomain: updateDomainInSystem,
      removeDomain: removeDomainFromSystem,
      removeUser: removeUserFromSystem,
      updateUser: updateUserInSystem,
      resetUserPassword: resetUserPasswordInSystem,
      getUserActivityLogs: (userId) => Promise.resolve(getUserActivityLogs(activityLogs, userId)),
      getAuctionStatistics: getAuctionStatisticsFromSystem,
      exportData: (dataType) => Promise.resolve(exportData(dataType, domains, users, bids)),
      fetchUpdatedDomains,
    }}>
      {children}
    </BackendContext.Provider>
  );
};

export const useBackend = () => {
  const context = useContext(BackendContext);
  if (context === undefined) {
    throw new Error('useBackend must be used within a BackendProvider');
  }
  return context;
};