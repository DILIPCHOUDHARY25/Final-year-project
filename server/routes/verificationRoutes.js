const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { verifyParentID } = require('../controllers/verificationController');
const authenticate = require('../middleware/authenticate');

// Parent ID verification route
router.post('/verify-parent-id', authenticate, upload.single('idCard'), verifyParentID);

module.exports = router;