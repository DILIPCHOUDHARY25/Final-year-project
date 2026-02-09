const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // In a real app, you would validate credentials against database
    // For this demo, we'll create a mock user
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate token
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.json({ 
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        parentPhoneNumber: user.parentPhoneNumber
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Register route
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, role, parentPhoneNumber } = req.body;
    
    const user = new User({
      username,
      email,
      password, // In production, hash this!
      role: role || 'student',
      parentPhoneNumber: role === 'parent' ? parentPhoneNumber : undefined
    });

    await user.save();

    // Generate token
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });

    res.status(201).json({ 
      token,
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        parentPhoneNumber: user.parentPhoneNumber
      }
    });
  } catch (error) {
    res.status(400).json({ message: 'Registration failed', error: error.message });
  }
});

module.exports = router;