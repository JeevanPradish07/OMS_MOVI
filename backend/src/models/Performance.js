const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
}, { _id: false });

const performanceSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  evaluatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  period: { type: String, required: true },
  technicalScore: { type: Number, min: 0, max: 10, default: 0 },
  communicationScore: { type: Number, min: 0, max: 10, default: 0 },
  punctualityScore: { type: Number, min: 0, max: 10, default: 0 },
  overallScore: { type: Number, min: 0, max: 10, default: 0 },
  feedback: { type: String },
  goals: [goalSchema],
}, { timestamps: true });

module.exports = mongoose.model('Performance', performanceSchema);
