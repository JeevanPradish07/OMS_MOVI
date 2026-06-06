const Document = require('../models/Document');
const logger = require('../utils/logger');

// @route GET /api/documents
exports.getDocuments = async (req, res) => {
  const filter = {};
  if (req.user.role === 'intern') {
    filter.user = req.user._id;
  } else if (req.query.userId) {
    filter.user = req.query.userId;
  }
  if (req.query.category) filter.category = req.query.category;

  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 50);
  const skip  = (page - 1) * limit;

  const [docs, total] = await Promise.all([
    Document.find(filter)
      .select('-fileData') // Exclude heavy binary data from list view
      .populate('user', 'name email')
      .populate('uploadedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Document.countDocuments(filter),
  ]);

  res.json({ success: true, count: docs.length, total, page, pages: Math.ceil(total / limit), data: docs });
};

// @route POST /api/documents
exports.uploadDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No file uploaded' });
  }

  const doc = await Document.create({
    user:               req.body.userId || req.user._id,
    name:               req.body.name   || req.file.originalname,
    originalName:       req.file.originalname,
    mimetype:           req.file.mimetype,
    size:               req.file.size,
    fileData:           req.file.buffer, // Binary data in MongoDB
    contentType:        req.file.mimetype,
    uploadedBy:         req.user._id,
    category:           req.body.category || 'Other',
  });

  await doc.populate('user', 'name email');
  await doc.populate('uploadedBy', 'name');
  
  logger.info(`Document stored in MongoDB: ${doc.name} by ${req.user.email}`);
  
  // Return the doc WITHOUT the binary data to save bandwidth
  const resDoc = doc.toObject();
  delete resDoc.fileData;
  res.status(201).json({ success: true, data: resDoc });
};

// @route GET /api/documents/:id/download
exports.downloadDocument = async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

  if (req.user.role === 'intern' && doc.user.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized to download this document' });
  }

  if (!doc.fileData) {
    return res.status(410).json({ success: false, message: 'File content no longer exists in binary storage' });
  }

  // Set the correct Content-Type and serve the Buffer
  res.set({
    'Content-Type': doc.contentType || 'application/octet-stream',
    'Content-Disposition': `attachment; filename="${encodeURIComponent(doc.originalName)}"`,
    'Content-Length': doc.fileData.length,
  });

  return res.send(doc.fileData);
};

// @route DELETE /api/documents/:id
exports.deleteDocument = async (req, res) => {
  const doc = await Document.findById(req.params.id);
  if (!doc) return res.status(404).json({ success: false, message: 'Document not found' });

  // No external Cloudinary deletion needed now
  await doc.deleteOne();
  res.json({ success: true, message: 'Document deleted successfully from MongoDB' });
};
