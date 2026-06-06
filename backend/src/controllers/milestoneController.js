const Milestone = require('../models/Milestone');

// @route GET /api/milestones
exports.getMilestones = async (req, res) => {
  const filter = {};
  if (req.query.project) filter.project = req.query.project;
  if (req.query.status)  filter.status  = req.query.status;

  const milestones = await Milestone.find(filter)
    .populate('project', 'name code')
    .populate('createdBy', 'name')
    .sort({ dueDate: 1 });

  res.json({ success: true, count: milestones.length, data: milestones });
};

// @route POST /api/milestones
exports.createMilestone = async (req, res) => {
  const { title, project } = req.body;
  if (!title || !project) {
    return res.status(400).json({ success: false, message: 'Title and project are required' });
  }
  const m = await Milestone.create({ ...req.body, createdBy: req.user._id });
  await m.populate('project', 'name code');
  await m.populate('createdBy', 'name');
  res.status(201).json({ success: true, data: m });
};

// @route PATCH /api/milestones/:id
exports.updateMilestone = async (req, res) => {
  const m = await Milestone.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    .populate('project', 'name code')
    .populate('createdBy', 'name');
  if (!m) return res.status(404).json({ success: false, message: 'Milestone not found' });
  res.json({ success: true, data: m });
};

// @route DELETE /api/milestones/:id
exports.deleteMilestone = async (req, res) => {
  const m = await Milestone.findByIdAndDelete(req.params.id);
  if (!m) return res.status(404).json({ success: false, message: 'Milestone not found' });
  res.json({ success: true, message: 'Milestone deleted' });
};
