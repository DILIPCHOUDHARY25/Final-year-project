import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  return (
    <div className="sidebar">
      <h3>Parent Portal</h3>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          {user && user.role === 'parent' && (
            <li>
              {user.isVerified ? (
                <Link to="/parent-dashboard">Dashboard</Link>
              ) : (
                <Link to="/verify-parent">Verify ID</Link>
              )}
            </li>
          )}
          <li>
            <Link to="/profile">Profile</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;