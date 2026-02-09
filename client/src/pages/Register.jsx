import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'parent',
    parentPhoneNumber: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Redirect to verification if parent
      if (formData.role === 'parent') {
        navigate('/verify-parent');
      } else {
        navigate('/parent-dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input 
            type="text" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
            required
          />
        </div>

        <div>
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={formData.email} 
            onChange={handleChange} 
            required
          />
        </div>

        <div>
          <label>Password:</label>
          <input 
            type="password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
            required
          />
        </div>

        <div>
          <label>Role:</label>
          <select 
            name="role" 
            value={formData.role} 
            onChange={handleChange}
          >
            <option value="parent">Parent</option>
            <option value="student">Student</option>
          </select>
        </div>

        {formData.role === 'parent' && (
          <div>
            <label>Phone Number:</label>
            <input 
              type="tel" 
              name="parentPhoneNumber" 
              value={formData.parentPhoneNumber} 
              onChange={handleChange} 
              required
              placeholder="10-digit phone number"
            />
          </div>
        )}

        <button type="submit">Register</button>
      </form>

      <p>Already have an account? <a href="/">Login</a></p>
    </div>
  );
};

export default Register;