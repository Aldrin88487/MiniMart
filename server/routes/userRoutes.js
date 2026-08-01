const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

// Auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Get current user profile (protected)
router.get('/me', protect, getMe);

module.exports = router;
