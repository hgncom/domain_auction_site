import { useState, useEffect } from 'react';
import { useBackend } from '../contexts/BackendContext';

interface Notification {
  id: number;
  type: 'success' | 'error';
  message: string;
}

export const useAdminPanel = () => {
  const {
    domains,
    users,
    addDomain,
    updateDomain,
    removeDomain,
    removeUser,
    updateUser,
    resetUserPassword,
    getUserActivityLogs,
    getAuctionStatistics,
    exportData
  } = useBackend();

  const [activeTab, setActiveTab] = useState('domains');
  const [newDomain, setNewDomain] = useState({ name: '', currentBid: '', description: '', minimumBidIncrement: '', reservePrice: '' });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [domainPage, setDomainPage] = useState(1);
  const [userPage, setUserPage] = useState(1);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [statistics, setStatistics] = useState<any>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    const stats = await getAuctionStatistics();
    setStatistics(stats);
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { ...notification, id }]);
    setTimeout(() => removeNotification(id), 5000);
  };

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const handleUpdateUser = async (id: number, updates: Partial<typeof users[0]>) => {
    try {
      await updateUser(id, updates);
      addNotification({ type: 'success', message: 'User updated successfully' });
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to update user' });
    }
  };

  const handleResetPassword = async (userId: number) => {
    try {
      await resetUserPassword(userId);
      addNotification({ type: 'success', message: 'Password reset email sent' });
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to reset password' });
    }
  };

  const handleAddDomain = async () => {
    try {
      await addDomain({
        name: newDomain.name,
        currentBid: parseFloat(newDomain.currentBid),
        startingBid: parseFloat(newDomain.currentBid),
        description: newDomain.description,
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        minimumBidIncrement: parseFloat(newDomain.minimumBidIncrement),
        reservePrice: newDomain.reservePrice ? parseFloat(newDomain.reservePrice) : null,
      });
      setNewDomain({ name: '', currentBid: '', description: '', minimumBidIncrement: '', reservePrice: '' });
      addNotification({ type: 'success', message: 'Domain added successfully' });
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to add domain' });
    }
  };

  const handleUpdateDomain = async (id: number, updates: Partial<typeof domains[0]>) => {
    try {
      await updateDomain(id, updates);
      addNotification({ type: 'success', message: 'Domain updated successfully' });
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to update domain' });
    }
  };

  const handleRemoveDomain = async (id: number) => {
    try {
      await removeDomain(id);
      addNotification({ type: 'success', message: 'Domain removed successfully' });
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to remove domain' });
    }
  };

  const handleRemoveUser = async (id: number) => {
    try {
      await removeUser(id);
      addNotification({ type: 'success', message: 'User removed successfully' });
    } catch (error) {
      addNotification({ type: 'error', message: 'Failed to remove user' });
    }
  };

  const handleExportData = async (dataType: 'domains' | 'users' | 'bids') => {
    try {
      const data = await exportData(dataType);
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${dataType}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      addNotification({ type: 'error', message: `Failed to export ${dataType} data` });
    }
  };

  return {
    activeTab,
    setActiveTab,
    newDomain,
    setNewDomain,
    notifications,
    setNotifications,
    domainPage,
    setDomainPage,
    userPage,
    setUserPage,
    activityLogs,
    setActivityLogs,
    statistics,
    setStatistics,
    handleUpdateUser,
    handleResetPassword,
    handleAddDomain,
    handleUpdateDomain,
    handleRemoveDomain,
    handleRemoveUser,
    handleExportData,
    getUserActivityLogs,
  };
};