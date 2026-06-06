const express = require('express');
const router = express.Router();
const { getDocuments, uploadDocument, downloadDocument, deleteDocument } = require('../controllers/documentController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

router.use(protect);
router.get('/', getDocuments);
router.post('/', authorize('hr', 'admin', 'intern'), upload.single('file'), uploadDocument);
router.get('/:id/download', downloadDocument);
router.delete('/:id', authorize('hr', 'admin'), deleteDocument);

module.exports = router;
