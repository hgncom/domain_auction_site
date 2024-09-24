import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';

const Navbar: React.FC = () => {
  const { isAuthenticated, isAdmin, isModerator, user } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex space-x-4">
            <NavLink to="/">Home</NavLink>
            <Link to="/auctions" className="hover:text-gray-300">Auctions</Link>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            {isAuthenticated && (
              <>
                <NavLink to="/profile">Profile</NavLink>
                {(isAdmin || isModerator) && (
                  <NavLink to="/admin">Admin Panel</NavLink>
                )}
              </>
            )}
          </div>
          <div>
            {isAuthenticated ? (
              <span className="text-gray-600">Welcome, <span className="font-semibold">{user?.name}</span></span>
            ) : (
              <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                Login / Register
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link
    to={to}
    className="text-gray-600 hover:text-blue-600 font-medium transition duration-300"
  >
    {children}
  </Link>
);

export default Navbar;