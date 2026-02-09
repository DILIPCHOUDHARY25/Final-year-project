const Tesseract = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');

const verifyParentID = async (req, res) => {
  try {
    // Check if user is already verified
    if (req.user.isVerified) {
      return res.status(400).json({ message: 'User is already verified' });
    }

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const filePath = req.file.path;

    // Perform OCR on the uploaded image
    const result = await Tesseract.recognize(filePath, 'eng', {
      logger: m => console.log(m) // Optional: log progress
    });

    const extractedText = result.data.text;

    // Extract phone numbers using regex
    const phoneRegex = /\b\d{10}\b/g;
    const phoneNumbers = extractedText.match(phoneRegex);

    if (!phoneNumbers || phoneNumbers.length === 0) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'No phone number found in the ID card' });
    }

    // Use the first phone number found
    const extractedPhone = phoneNumbers[0];

    // Compare with user's registered parent phone number
    if (extractedPhone !== req.user.parentPhoneNumber) {
      // Clean up uploaded file
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: 'Phone number does not match registered parent phone number' });
    }

    // Update user verification status
    await User.findByIdAndUpdate(req.user._id, { isVerified: true });

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.json({ 
      message: 'Parent verification successful',
      isVerified: true,
      extractedPhoneNumber: extractedPhone
    });

  } catch (error) {
    console.error('Verification error:', error);
    
    // Clean up uploaded file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError);
      }
    }

    res.status(500).json({ 
      message: 'Verification failed',
      error: error.message 
    });
  }
};

module.exports = { verifyParentID };