import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ParentVerification from './components/ParentVerification';
import Sidebar from './components/Sidebar';
import ParentDashboard from './pages/ParentDashboard';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-parent" element={<ParentVerification />} />
            <Route path="/parent-dashboard" element={<ParentDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;