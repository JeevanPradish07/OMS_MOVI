const Performance = require('../models/Performance');

// @route GET /api/performance
exports.getPerformance = async (req, res) => {
  const filter = {};
  if (req.user.role === 'intern') filter.user = req.user._id;
  else if (req.query.userId) filter.user = req.query.userId;

  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 50);
  const skip  = (page - 1) * limit;

  const [records, total] = await Promise.all([
    Performance.find(filter)
      .populate('user',        'name email')
      .populate('evaluatedBy', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Performance.countDocuments(filter),
  ]);

  res.json({ success: true, count: records.length, total, page, pages: Math.ceil(total / limit), data: records });
};

// @route POST /api/performance
exports.createPerformance = async (req, res) => {
  const { user, technicalScore, communicationScore, punctualityScore } = req.body;
  if (!user || technicalScore == null || communicationScore == null || punctualityScore == null) {
    return res.status(400).json({ success: false, message: 'user, technicalScore, communicationScore, and punctualityScore are required' });
  }

  const overallScore = ((Number(technicalScore) + Number(communicationScore) + Number(punctualityScore)) / 3).toFixed(1);

  const record = await Performance.create({
    ...req.body,
    overallScore: parseFloat(overallScore),
    evaluatedBy:  req.user._id,
  });

  await record.populate('user',        'name email');
  await record.populate('evaluatedBy', 'name email');
  res.status(201).json({ success: true, data: record });
};

// @route PATCH /api/performance/:id
exports.updatePerformance = async (req, res) => {
  // Recalculate overallScore if any score field is being updated
  const update = { ...req.body };
  if (update.technicalScore != null || update.communicationScore != null || update.punctualityScore != null) {
    const existing = await Performance.findById(req.params.id);
    if (!existing) return res.status(404).json({ success: false, message: 'Record not found' });
    const tech   = Number(update.technicalScore      ?? existing.technicalScore);
    const comm   = Number(update.communicationScore  ?? existing.communicationScore);
    const punct  = Number(update.punctualityScore    ?? existing.punctualityScore);
    update.overallScore = parseFloat(((tech + comm + punct) / 3).toFixed(1));
  }

  const record = await Performance.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
  if (!record) return res.status(404).json({ success: false, message: 'Record not found' });
  res.json({ success: true, data: record });
};
