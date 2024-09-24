import React from 'react';
import { Navigate } from 'react-router-dom';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import Notifications from '../components/admin/Notifications';
import DomainManagement from '../components/admin/DomainManagement';
import UserManagement from '../components/admin/UserManagement';
import AuctionStatistics from '../components/admin/AuctionStatistics';
import { useAdminPanel } from '../hooks/adminHooks';
import { useBackend } from '../contexts/BackendContext';
import { useAuth } from '../hooks/useAuth';
import { Domain } from '../contexts/BackendContext';

interface NewDomainString {
  name: string;
  currentBid: string;
  description: string;
  minimumBidIncrement: string;
  reservePrice: string;
  category: string;
}

interface NewDomain {
  name: string;
  currentBid: number;
  description: string;
  minimumBidIncrement: number;
  reservePrice: number | null;
  category: string;
}

const AdminPanel: React.FC = () => {
  const { isAuthenticated, isAdmin, isModerator, hasPermission } = useAuth();
  const {
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
    handleUpdateUser,
    handleResetPassword,
    handleAddDomain,
    handleUpdateDomain,
    handleRemoveDomain,
    handleRemoveUser,
    handleExportData,
    getUserActivityLogs,
  } = useAdminPanel();
  const { domains, users } = useBackend();

  if (!isAuthenticated || (!isAdmin && !isModerator)) {
    return <Navigate to="/" replace />;
  }

  const removeNotification = (id: number) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const convertToNewDomain = (domain: NewDomainString): NewDomain => ({
    name: domain.name,
    currentBid: parseFloat(domain.currentBid) || 0,
    description: domain.description,
    minimumBidIncrement: parseFloat(domain.minimumBidIncrement) || 0,
    reservePrice: domain.reservePrice ? parseFloat(domain.reservePrice) : null,
    category: domain.category,
  });

  const handleSetNewDomain = (value: React.SetStateAction<NewDomain>) => {
    if (typeof value === 'function') {
      setNewDomain((prev: NewDomainString) => {
        const converted = convertToNewDomain(prev);
        const result = value(converted);
        return {
          name: result.name,
          currentBid: result.currentBid.toString(),
          description: result.description,
          minimumBidIncrement: result.minimumBidIncrement.toString(),
          reservePrice: result.reservePrice ? result.reservePrice.toString() : '',
          category: result.category,
        };
      });
    } else {
      setNewDomain({
        name: value.name,
        currentBid: value.currentBid.toString(),
        description: value.description,
        minimumBidIncrement: value.minimumBidIncrement.toString(),
        reservePrice: value.reservePrice ? value.reservePrice.toString() : '',
        category: value.category,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      <Notifications notifications={notifications} removeNotification={removeNotification} />
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="domains">Domains</TabsTrigger>
          {isAdmin && <TabsTrigger value="users">Users</TabsTrigger>}
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
        </TabsList>
        <TabsContent value="domains">
          <DomainManagement
            domains={domains}
            newDomain={convertToNewDomain(newDomain)}
            setNewDomain={handleSetNewDomain}
            domainPage={domainPage}
            setDomainPage={setDomainPage}
            handleAddDomain={handleAddDomain}
            handleUpdateDomain={handleUpdateDomain}
            handleRemoveDomain={handleRemoveDomain}
            handleExportData={handleExportData}
            isAdmin={isAdmin}
            canAddDomain={hasPermission('add_domain')}
            canUpdateDomain={hasPermission('update_domain')}
            canRemoveDomain={hasPermission('remove_domain')}
          />
        </TabsContent>
        {isAdmin && (
          <TabsContent value="users">
            <UserManagement
              users={users}
              userPage={userPage}
              setUserPage={setUserPage}
              handleUpdateUser={handleUpdateUser}
              handleResetPassword={handleResetPassword}
              handleRemoveUser={handleRemoveUser}
              handleExportData={handleExportData}
              activityLogs={activityLogs}
              setActivityLogs={setActivityLogs}
              getUserActivityLogs={getUserActivityLogs}
            />
          </TabsContent>
        )}
        <TabsContent value="statistics">
          <AuctionStatistics statistics={statistics} handleExportData={handleExportData} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPanel;