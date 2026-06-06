const express = require('express');
const router = express.Router();
const { getTasks, createTask, updateTaskStatus, approveTask, rejectTask, deleteTask } = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getTasks);
router.post('/', authorize('pmo', 'admin'), createTask);
router.patch('/:id/status', updateTaskStatus);
router.patch('/:id/approve', authorize('pmo', 'admin'), approveTask);
router.patch('/:id/reject', authorize('pmo', 'admin'), rejectTask);
router.delete('/:id', authorize('pmo', 'admin'), deleteTask);

module.exports = router;
