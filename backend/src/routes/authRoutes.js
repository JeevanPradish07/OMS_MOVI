const express = require('express');
const router = express.Router();
const { login, getMe, register } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/auth');

router.post('/login', login);        // public ✅
router.post('/register', register); // public ✅
router.get('/me', protect, getMe);  // protected ✅

module.exports = router;
