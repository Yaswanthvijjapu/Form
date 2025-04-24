// client/src/components/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-purple-600 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo and Brand Name */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center">
              <img
                src="https://via.placeholder.com/40x40.png?text=FB"
                alt="Form Builder Logo"
                className="h-10 w-10 rounded-full"
              />
              <span className="ml-2 text-xl font-bold tracking-tight">
                Form Builder
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/editor"
                  className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Form Editor
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200 focus:outline-none"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;