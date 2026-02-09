import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ParentVerification = () => {
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('idCard', file);

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/auth/verify-parent-id', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setSuccess(true);
      setIsLoading(false);
      
      // Redirect to parent dashboard after successful verification
      setTimeout(() => {
        navigate('/parent-dashboard');
      }, 2000);

    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <div className="parent-verification-container">
      <h2>Parent ID Verification</h2>
      <p>Upload a photo of your government-issued ID card for verification.</p>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Verification successful! Redirecting...</div>}

      <form onSubmit={handleSubmit}>
        <div className="file-upload">
          <input 
            type="file" 
            id="idCard" 
            name="idCard"
            accept=".jpg,.jpeg,.png"
            onChange={handleFileChange}
            required
          />
          <label htmlFor="idCard">Choose ID Card Image</label>
        </div>

        <button type="submit" disabled={isLoading || !file}>
          {isLoading ? 'Scanning...' : 'Verify ID'}
        </button>
      </form>

      <div className="instructions">
        <h4>Instructions:</h4>
        <ul>
          <li>Upload a clear photo of your government ID</li>
          <li>Ensure the phone number on your ID is visible</li>
          <li>Supported formats: JPG, JPEG, PNG</li>
          <li>Maximum file size: 5MB</li>
        </ul>
      </div>
    </div>
  );
};

export default ParentVerification;