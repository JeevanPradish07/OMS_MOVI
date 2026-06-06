const express = require('express');
const router = express.Router();
const { getPerformance, createPerformance, updatePerformance } = require('../controllers/performanceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getPerformance);
router.post('/', authorize('hr', 'pmo', 'admin'), createPerformance);
router.patch('/:id', authorize('hr', 'pmo', 'admin'), updatePerformance);

module.exports = router;
