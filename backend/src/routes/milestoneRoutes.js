const express = require('express');
const router = express.Router();
const { getMilestones, createMilestone, updateMilestone, deleteMilestone } = require('../controllers/milestoneController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getMilestones);
router.post('/', authorize('pmo', 'admin'), createMilestone);
router.patch('/:id', authorize('pmo', 'admin'), updateMilestone);
router.delete('/:id', authorize('pmo', 'admin'), deleteMilestone);

module.exports = router;
