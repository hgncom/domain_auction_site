import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { BackendProvider } from './contexts/BackendContext';
import { WebSocketProvider } from './contexts/WebSocketContext';
import DomainAuctionSite from './pages/DomainAuctionSite';
import AdminPanel from './pages/AdminPanel';
import ProtectedRoute from './components/admin/ProtectedRoute';
import UserProfile from './pages/UserProfile';
import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import AuctionDetails from './pages/AuctionDetails';
import AuctionListings from './pages/AuctionListings';
import Navbar from './components/frontend/layout/Navbar';
import Footer from './components/frontend/layout/Footer';

const App: React.FC = () => {
  return (
    <BackendProvider>
      <WebSocketProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto p-4">
              <Routes>
                <Route path="/" element={<DomainAuctionSite />} />
                <Route path="/auctions" element={<AuctionListings />} />
                <Route path="/about" element={<AboutUs />} />
                <Route path="/contact" element={<ContactUs />} />
                <Route path="/profile" element={
                  <ProtectedRoute>
                    <UserProfile />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={
                  <ProtectedRoute requiredRole="moderator">
                    <AdminPanel />
                  </ProtectedRoute>
                } />
                <Route path="/auction/:id" element={<AuctionDetails />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </WebSocketProvider>
    </BackendProvider>
  );
};

export default App;