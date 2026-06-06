const express = require('express');
const router = express.Router();
const { getAnnouncements, createAnnouncement } = require('../controllers/announcementController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getAnnouncements);
router.post('/', authorize('hr', 'admin'), createAnnouncement);

module.exports = router;
