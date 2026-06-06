const Project = require('../models/Project');
const Task    = require('../models/Task');

// @route GET /api/projects
exports.getProjects = async (req, res) => {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;

  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 50);
  const skip  = (page - 1) * limit;

  const [projects, total] = await Promise.all([
    Project.find(filter)
      .populate('createdBy',   'name email')
      .populate('team.user',   'name username role profileImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Project.countDocuments(filter),
  ]);

  res.json({ success: true, count: projects.length, total, page, pages: Math.ceil(total / limit), data: projects });
};

// @route GET /api/projects/:id
exports.getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate('createdBy', 'name email')
    .populate('team.user', 'name username role profileImage');
  
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: project });
};

// @route POST /api/projects
exports.createProject = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ success: false, message: 'Project name is required' });

  const project = await Project.create({ ...req.body, createdBy: req.user._id });
  await project.populate('createdBy', 'name email');
  res.status(201).json({ success: true, data: project });
};

// @route PATCH /api/projects/:id
exports.updateProject = async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
  res.json({ success: true, data: project });
};

// @route GET /api/projects/:id/progress
exports.getProjectProgress = async (req, res) => {
  const tasks = await Task.find({ project: req.params.id }).select('status');
  const total      = tasks.length;
  const done       = tasks.filter(t => t.status === 'done').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const pending    = tasks.filter(t => t.status === 'pending').length;
  const progress   = total > 0 ? Math.round((done / total) * 100) : 0;
  res.json({ success: true, data: { total, done, inProgress, pending, progress } });
};
