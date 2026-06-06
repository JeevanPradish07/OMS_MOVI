const Attendance = require('../models/Attendance');

// @route GET /api/attendance
exports.getAttendance = async (req, res) => {
  const filter = {};
  if (req.user.role === 'intern') {
    filter.user = req.user._id;
  } else if (req.query.userId) {
    filter.user = req.query.userId;
  }
  if (req.query.date) filter.date = req.query.date;
  if (req.query.status) filter.status = req.query.status;

  // Pagination
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(200, parseInt(req.query.limit) || 50);
  const skip  = (page - 1) * limit;

  const [records, total] = await Promise.all([
    Attendance.find(filter)
      .populate('user', 'name email')
      .populate('approvedBy', 'name')
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit),
    Attendance.countDocuments(filter),
  ]);

  res.json({ success: true, count: records.length, total, page, pages: Math.ceil(total / limit), data: records });
};

// @route POST /api/attendance
exports.markAttendance = async (req, res) => {
  const userId = req.body.userId || req.user._id;
  const date   = req.body.date   || new Date().toISOString().split('T')[0];

  // Prevent duplicate records for same user+date
  const existing = await Attendance.findOne({ user: userId, date: new Date(date) });
  if (existing) {
    return res.status(409).json({
      success: false,
      message: 'Attendance already marked for this user on the selected date',
      data: existing,
    });
  }

  const record = await Attendance.create({
    ...req.body,
    user: userId,
    date: new Date(date),
  });

  await record.populate('user', 'name email');
  res.status(201).json({ success: true, data: record });
};

// @route PATCH /api/attendance/:id
exports.updateAttendance = async (req, res) => {
  const update = { ...req.body };

  // Track who approved / rejected
  if (req.body.status && ['present', 'absent', 'leave', 'wfh'].includes(req.body.status)) {
    update.approvedBy  = req.user._id;
    update.approvedAt  = new Date();
  }

  const record = await Attendance.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true })
    .populate('user', 'name email')
    .populate('approvedBy', 'name');

  if (!record) return res.status(404).json({ success: false, message: 'Attendance record not found' });
  res.json({ success: true, data: record });
};
