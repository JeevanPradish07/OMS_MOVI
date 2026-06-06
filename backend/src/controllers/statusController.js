const StatusUpdate = require('../models/StatusUpdate');

// @route GET /api/status-updates
exports.getStatusUpdates = async (req, res) => {
  const filter = {};
  if (req.user.role === 'intern') filter.user = req.user._id;
  else if (req.query.userId) filter.user = req.query.userId;

  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const skip  = (page - 1) * limit;

  const [updates, total] = await Promise.all([
    StatusUpdate.find(filter)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    StatusUpdate.countDocuments(filter),
  ]);

  res.json({ success: true, count: updates.length, total, page, pages: Math.ceil(total / limit), data: updates });
};

// @route POST /api/status-updates
exports.createStatusUpdate = async (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ success: false, message: 'Content is required' });
  }
  const update = await StatusUpdate.create({ ...req.body, user: req.user._id });
  await update.populate('user', 'name email');
  res.status(201).json({ success: true, data: update });
};
