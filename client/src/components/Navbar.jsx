// client/src/components/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/useAuthStore';

function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-purple-600 text-white shadow-lg fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-2">
          {/* Logo and Brand Name */}
          <div className="flex items-center space-x-3">
            <Link to="/" className="flex items-center">
              <img
                src="/logo.png" // Replace with your logo path
                alt="Form Builder Logo"
                className="h-12 w-12 sm:h-14 sm:w-14 rounded-full"
              />
              <span className="ml-2 text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
                Formify
              </span>
            </Link>
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white focus:outline-none focus:ring-2 focus:ring-white p-2"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div
            className={`${
              isOpen ? 'block' : 'hidden'
            } md:flex md:items-center md:space-x-6 absolute md:static top-16 left-0 w-full md:w-auto bg-purple-600 md:bg-transparent p-4 md:p-0 transition-all duration-300`}
          >
            <Link
              to="/"
              className="block md:inline-block text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              Home
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block md:inline-block text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Dashboard
                </Link>
                <Link
                  to="/editor"
                  className="block md:inline-block text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
                >
                  Form Editor
                </Link>
                <button
                  onClick={handleLogout}
                  className="block md:inline-block text-white hover:bg-purple-700 px-3 py-2 rounded-md text-1xl font-medium transition duration-200 focus:outline-none w-full md:w-auto"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block md:inline-block text-white hover:bg-purple-700 px-3 py-2 rounded-md text-1xl font-medium transition duration-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block md:inline-block text-white hover:bg-purple-700 px-3 py-2 rounded-md text-sm font-medium transition duration-200"
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