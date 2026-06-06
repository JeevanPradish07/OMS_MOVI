const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name:         { type: String, required: true },
  originalName: { type: String, required: true },
  mimetype:     { type: String },
  size:         { type: Number },
  // Optional for backward compatibility, but we primarily use fileData now
  filePath:     { type: String },
  fileData:     { type: Buffer }, // Stores the binary content
  contentType:  { type: String }, // Stores the MIME type
  // publicId is legacy when Cloudinary was used
  cloudinaryPublicId: { type: String },
  uploadedBy:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  category:     { type: String, enum: ['NDA', 'Offer Letter', 'ID Proof', 'Report', 'Other'], default: 'Other' },
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
