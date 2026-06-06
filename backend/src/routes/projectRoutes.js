const express = require('express');
const router = express.Router();
const { getProjects, createProject, updateProject, getProjectProgress, getProjectById } = require('../controllers/projectController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.get('/', authorize('pmo', 'admin', 'hr'), getProjects);
router.get('/:id', authorize('pmo', 'admin', 'hr'), getProjectById);
router.post('/', authorize('pmo', 'admin'), createProject);
router.patch('/:id', authorize('pmo', 'admin'), updateProject);
router.get('/:id/progress', authorize('pmo', 'admin'), getProjectProgress);

module.exports = router;
