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
    
    <nav className="bg-indigo-600 p-4 text-white flex justify-between items-center">
      <div>
        <Link to="/" className="text-lg font-bold hover:underline">
          Form Builder
        </Link>
      </div>
      <div className="space-x-4">
        <Link to="/" className="hover:underline">
          Home
        </Link>
        {isAuthenticated ? (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>
            <Link to="/editor" className="hover:underline">
              Form Editor
            </Link>
            <button
              onClick={handleLogout}
              className="hover:underline focus:outline-none"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;