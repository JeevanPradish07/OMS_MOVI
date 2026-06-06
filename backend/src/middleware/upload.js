const multer  = require('multer');
const path    = require('path');

// ─── Memory Storage ───────────────────────────────────────────────────────────
// We no longer use Cloudinary or local disks. Files are buffered in memory and 
// passed directly to the controller for storage in MongoDB.
const storage = multer.memoryStorage();

// ─── File type filter ──────────────────────────────────────────────────────────
const fileFilter = (req, file, cb) => {
  const allowed = /^(pdf|doc|docx|png|jpg|jpeg|xlsx|csv)$/i;
  const ext = path.extname(file.originalname).slice(1); // strip leading dot
  if (allowed.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('File type not supported. Allowed: pdf, doc, docx, png, jpg, jpeg, xlsx, csv'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

module.exports = { upload };
