// client/src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Dashboard from './pages/Herodashboard.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import FormEditor from './pages/FormEditor.jsx';
import FormSubmit from './pages/FormSubmit.jsx';

function App() {
  return (
    <div >
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/editor" element={<FormEditor />} />
        <Route path="/submit/:formId" element={<FormSubmit />} />
      </Routes>
    </div>
  );
}

export default App;