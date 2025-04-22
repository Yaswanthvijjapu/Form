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
import ViewForm from './pages/ViewForm.jsx'; // Add this import
import PrivateRoute from './components/PrivateRoute'; // Add this import

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/editor"
          element={
            <PrivateRoute>
              <FormEditor />
            </PrivateRoute>
          }
        />
        <Route path="/submit/:formId" element={<FormSubmit />} /> {/* Consistent path */}
        <Route path="/forms/:id" element={<ViewForm />} /> {/* Add this route */}
      </Routes>
    </div>
  );
}

export default App;