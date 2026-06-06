const express = require('express');
const router = express.Router();
const { getResources, createResource, deleteResource } = require('../controllers/resourceController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', getResources);
router.post('/', authorize('hr', 'pmo', 'admin'), createResource);
router.delete('/:id', authorize('hr', 'pmo', 'admin'), deleteResource);

module.exports = router;
