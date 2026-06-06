const mongoose = require('mongoose');

const statusUpdateSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  type: { type: String, enum: ['daily', 'weekly'], default: 'daily' },
  week: { type: Number },
  blockers: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('StatusUpdate', statusUpdateSchema);
