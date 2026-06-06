const Task = require('../models/Task');

// @route GET /api/tasks
exports.getTasks = async (req, res) => {
  const filter = {};
  if (req.query.project) filter.project = req.query.project;
  if (req.query.status) filter.status = req.query.status;
  if (req.query.priority) filter.priority = req.query.priority;

  // Interns can only see their own tasks
  if (req.user.role === 'intern') {
    filter.assignedTo = req.user._id;
  } else if (req.query.assignedTo) {
    filter.assignedTo = req.query.assignedTo;
  }

  // Pagination
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 50);
  const skip  = (page - 1) * limit;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name email')
      .populate('project', 'name code')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  res.json({
    success: true,
    count: tasks.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: tasks,
  });
};

// @route POST /api/tasks
exports.createTask = async (req, res) => {
  const { title, assignedTo, dueDate } = req.body;
  if (!title || !assignedTo) {
    return res.status(400).json({ success: false, message: 'Title and assignedTo are required' });
  }

  const task = await Task.create({ ...req.body, assignedBy: req.user._id });
  await task.populate('assignedTo', 'name email');
  await task.populate('assignedBy', 'name email');
  res.status(201).json({ success: true, data: task });
};

// @route PATCH /api/tasks/:id/status
exports.updateTaskStatus = async (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'in_progress', 'review', 'done', 'overdue'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

  // Intern can only update their own tasks
  if (req.user.role === 'intern' && task.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized to update this task' });
  }

  task.status = status;
  if (status === 'done') task.completedAt = new Date();
  await task.save();

  res.json({ success: true, data: task });
};

// @route PATCH /api/tasks/:id/approve  — PMO/admin approves (marks done)
exports.approveTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: 'done', completedAt: new Date() },
    { new: true }
  );
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  res.json({ success: true, data: task });
};

// @route PATCH /api/tasks/:id/reject  — PMO/admin rejects (back to pending)
exports.rejectTask = async (req, res) => {
  const task = await Task.findByIdAndUpdate(
    req.params.id,
    { status: 'pending', completedAt: null },
    { new: true }
  );
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  res.json({ success: true, data: task });
};

// @route DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
  res.json({ success: true, message: 'Task deleted successfully' });
};
