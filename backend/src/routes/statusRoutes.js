const express = require('express');
const router = express.Router();
const { getStatusUpdates, createStatusUpdate } = require('../controllers/statusController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getStatusUpdates);
router.post('/', authorize('intern'), createStatusUpdate);

module.exports = router;
