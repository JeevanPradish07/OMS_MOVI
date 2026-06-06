const express = require('express');
const router = express.Router();
const { getKPIs, getAnalytics } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect, authorize('admin'));
router.get('/kpis', getKPIs);
router.get('/analytics', getAnalytics);

module.exports = router;
