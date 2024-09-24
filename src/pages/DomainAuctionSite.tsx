import React, { useState, useEffect } from 'react';
import { useBackend } from '../contexts/BackendContext';
import AuthTabs from '../components/frontend/AuthTabs';
import UserDashboard from '../components/frontend/UserDashboard';
import { NotificationSystem } from '../components/frontend/NotificationSystem';
import { useRealTimeUpdates } from '../hooks/useRealTimeUpdates';

const DomainAuctionSite: React.FC = () => {
  const { currentUser } = useBackend();
  const updatedDomains = useRealTimeUpdates();
  const [, setRender] = useState({});

  useEffect(() => {
    setRender({}); // Force re-render on user change
  }, [currentUser]);

  return (
    <div className="p-4">
      <NotificationSystem />
      {currentUser ? (
        <UserDashboard updatedDomains={updatedDomains} />
      ) : (
        <AuthTabs />
      )}
    </div>
  );
};

export default DomainAuctionSite;