import React from 'react';
import { useBackend } from '../contexts/BackendContext';
import AuthTabs from '../components/frontend/AuthTabs';
import UserDashboard from '../components/frontend/UserDashboard';
import { NotificationSystem } from '../components/frontend/NotificationSystem';
import AuctionListing from './AuctionListings';

const DomainAuctionSite: React.FC = () => {
  const { currentUser } = useBackend();

  return (
    <div className="space-y-4">
      <NotificationSystem />
      {currentUser ? (
        <>
          <UserDashboard />
          <AuctionListing />
        </>
      ) : (
        <>
          <AuthTabs />
          <AuctionListing />
        </>
      )}
    </div>
  );
};

export default DomainAuctionSite;