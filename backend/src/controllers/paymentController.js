const Payment = require('../models/Payment');

// @route GET /api/payments/my  — intern's own payments
exports.getMyPayments = async (req, res) => {
  const payments = await Payment.find({ internId: req.user._id })
    .populate('internId', 'name email')
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: payments.length, data: payments });
};

// @route GET /api/payments  — admin/pmo can see all; filter by internId if provided
exports.getAllPayments = async (req, res) => {
  const filter = {};
  if (req.query.internId) filter.internId = req.query.internId;
  if (req.query.status) filter.status = req.query.status;
  const payments = await Payment.find(filter)
    .populate('internId', 'name email college')
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 });
  res.json({ success: true, count: payments.length, data: payments });
};

// @route POST /api/payments  — admin/pmo creates invoice
exports.createPayment = async (req, res) => {
  const { internId, amount, description } = req.body;
  if (!internId || !amount) {
    return res.status(400).json({ success: false, message: 'internId and amount are required' });
  }
  const payment = await Payment.create({ internId, amount, description, createdBy: req.user._id });
  await payment.populate('internId', 'name email');
  await payment.populate('createdBy', 'name email role');
  res.status(201).json({ success: true, message: 'Payment invoice created', data: payment });
};

// @route PATCH /api/payments/:id  — mark paid / rejected, optionally attach slipUrl
exports.updatePayment = async (req, res) => {
  const allowed = ['status', 'slipUrl', 'amount', 'description'];
  const updates = {};
  allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });

  if (updates.status === 'paid' && !updates.paidAt) updates.paidAt = new Date();

  const payment = await Payment.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true })
    .populate('internId', 'name email')
    .populate('createdBy', 'name email role');

  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
  res.json({ success: true, message: 'Payment updated', data: payment });
};

// @route DELETE /api/payments/:id  — admin only
exports.deletePayment = async (req, res) => {
  const payment = await Payment.findByIdAndDelete(req.params.id);
  if (!payment) return res.status(404).json({ success: false, message: 'Payment not found' });
  res.json({ success: true, message: 'Payment deleted' });
};
