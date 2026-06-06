const User = require('../models/User');
const emailService = require('../services/emailService');

// @route GET /api/users
exports.getUsers = async (req, res) => {
  const filter = {};
  if (req.query.role) filter.role = req.query.role;
  if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';
  if (req.query.search) {
    filter.username = { $regex: req.query.search, $options: 'i' };
  }

  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(200, parseInt(req.query.limit) || 100);
  const skip  = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(filter),
  ]);

  res.json({ success: true, count: users.length, total, page, pages: Math.ceil(total / limit), data: users });
};

// @route POST /api/users
exports.createUser = async (req, res) => {
  const { name, email, password, role, college, department, phone, username } = req.body;
  if (!name || !email || !role) {
    return res.status(400).json({ success: false, message: 'Name, email, and role are required' });
  }
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });
  const finalPassword = password || 'Password@123';
  const finalUsername = username || email.split('@')[0].toLowerCase().replace(/[^a-z0-9]/g, '');
  const user = await User.create({ name, email, password: finalPassword, role, college, department, phone, username: finalUsername });
  
  // Asynchronously send onboarding email if intern
  if (role === 'intern') {
    emailService.sendOnboardingEmail(name, email, finalPassword).catch(console.error);
  }

  res.status(201).json({ success: true, message: 'User created successfully', data: user });
};

// @route PATCH /api/users/:id
exports.updateUser = async (req, res) => {
  // Silently strip password — use a dedicated change-password endpoint if needed
  const { password, email, ...rest } = req.body;
  const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true, runValidators: true });
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
};

// @route DELETE /api/users/:id
exports.deleteUser = async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    return res.status(400).json({ success: false, message: 'Cannot delete your own account' });
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, message: 'User deleted' });
};

// @route GET /api/users/me  — returns own profile
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
};

// @route PATCH /api/users/me  — self-update (name, username, bio, phone)
exports.updateMe = async (req, res) => {
  const allowed = ['name', 'username', 'bio', 'phone', 'profileImage', 'githubLink', 'projectLink', 'college', 'department'];
  const updates = {};
  allowed.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

  if (updates.username) {
    const exists = await User.findOne({ username: updates.username, _id: { $ne: req.user._id } });
    if (exists) return res.status(409).json({ success: false, message: 'Username already taken' });
  }

  const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true, runValidators: true });
  res.json({ success: true, message: 'Profile updated', data: user });
};

// @route GET /api/users/:id
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  res.json({ success: true, data: user });
};

// @route GET /api/users/stipend-due
exports.getStipendDueUsers = async (req, res) => {
  const fourMonthsAgo = new Date();
  fourMonthsAgo.setMonth(fourMonthsAgo.getMonth() - 4);

  const interns = await User.find({
    role: 'intern',
    joiningDate: { $lte: fourMonthsAgo },
    isActive: true
  }).select('name username joiningDate project');

  res.json({ success: true, count: interns.length, data: interns });
};
