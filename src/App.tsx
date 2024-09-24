import React from 'react';
import { BackendProvider } from './contexts/BackendContext';
import DomainAuctionSite from './pages/DomainAuctionSite';
import AdminPanel from './pages/AdminPanel';
import ErrorBoundary from './ErrorBoundary';
import { useAuth } from './hooks/useAuth';

const AppContent: React.FC = () => {
  const { isAdmin, isModerator, isAuthenticated } = useAuth();
  const [showAdminPanel, setShowAdminPanel] = React.useState(false);

  const canAccessAdminPanel = isAuthenticated && (isAdmin || isModerator);

  const toggleView = () => {
    if (canAccessAdminPanel) {
      setShowAdminPanel(!showAdminPanel);
    } else {
      alert("You don't have permission to access the Admin Panel.");
    }
  };

  return (
    <div className="app-container">
      {showAdminPanel && canAccessAdminPanel ? <AdminPanel /> : <DomainAuctionSite />}
      {canAccessAdminPanel && (
        <button onClick={toggleView} className="toggle-view-btn">
          {showAdminPanel ? 'Switch to User View' : 'Switch to Admin View'}
        </button>
      )}
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <BackendProvider>
        <AppContent />
      </BackendProvider>
    </ErrorBoundary>
  );
};

export default App;