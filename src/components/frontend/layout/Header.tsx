import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-3xl font-extrabold tracking-tight">
          HGN<span className="text-yellow-400">.com</span>
        </Link>
        <div className="text-right">
          <h1 className="text-2xl font-semibold">High-Grade Names</h1>
          <p className="text-sm text-blue-200">Premium Domain Auction Platform</p>
        </div>
      </div>
    </header>
  );
};

export default Header;