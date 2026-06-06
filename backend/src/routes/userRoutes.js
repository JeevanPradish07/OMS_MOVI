const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser, getMe, updateMe, getUserById, getStipendDueUsers } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

// Self-profile routes — must come BEFORE /:id to avoid collision
router.get('/me', getMe);
router.patch('/me', updateMe);

router.get('/stipend-due', authorize('hr', 'admin'), getStipendDueUsers);
router.get('/:id', authorize('hr', 'pmo', 'admin'), getUserById);
router.get('/', authorize('intern', 'hr', 'pmo', 'admin'), getUsers);
router.post('/', authorize('hr', 'admin'), createUser);
router.patch('/:id', authorize('admin'), updateUser);
router.delete('/:id', authorize('admin'), deleteUser);

module.exports = router;
