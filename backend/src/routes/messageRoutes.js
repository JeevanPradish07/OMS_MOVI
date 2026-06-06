const express = require('express');
const router = express.Router();
const { getMessages, sendMessage, markRead } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);
// Specific routes MUST be declared before wildcard param routes
router.patch('/:id/read', markRead);
router.get('/:userId', getMessages);
router.get('/', getMessages);
router.post('/', sendMessage);

module.exports = router;
