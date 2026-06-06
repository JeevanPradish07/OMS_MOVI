const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  internId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true, min: 0 },
  description: { type: String, trim: true, default: 'Internship Stipend' },
  status: { type: String, enum: ['pending', 'paid', 'rejected'], default: 'pending' },
  slipUrl: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  paidAt: { type: Date },
}, { timestamps: true });

paymentSchema.index({ internId: 1, status: 1 });

module.exports = mongoose.model('Payment', paymentSchema);
