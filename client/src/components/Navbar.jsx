// client/src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/dashboard">Dashboard</Link> |{' '}
      <Link to="/login">Login</Link> | <Link to="/register">Register</Link> |{' '}
      <Link to="/editor">Form Editor</Link>
    </nav>
  );
}

export default Navbar;