import React from 'react';

const ParentDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  
  return (
    <div className="parent-dashboard">
      <h2>Welcome, {user?.username || 'Parent'}</h2>
      <p>Your account has been successfully verified!</p>
      
      <div className="verification-info">
        <h3>Verification Status</h3>
        <p>Status: {user?.isVerified ? 'Verified ✓' : 'Not Verified'}</p>
        <p>Phone Number: {user?.parentPhoneNumber || 'Not provided'}</p>
      </div>
    </div>
  );
};

export default ParentDashboard;