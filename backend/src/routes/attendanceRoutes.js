const express = require('express');
const router = express.Router();
const { getAttendance, markAttendance, updateAttendance } = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getAttendance);
router.post('/', authorize('hr', 'admin'), markAttendance);
router.patch('/:id', authorize('hr', 'admin'), updateAttendance);

module.exports = router;
