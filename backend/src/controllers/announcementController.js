const Announcement = require('../models/Announcement');

// @route GET /api/announcements
exports.getAnnouncements = async (req, res) => {
  // Show announcements targeting this role OR targeting 'all'
  const filter = {
    $or: [
      { targetRoles: req.user.role },
      { targetRoles: 'all' },
    ],
  };

  const annts = await Announcement.find(filter)
    .populate('sentBy', 'name email')
    .sort({ pinned: -1, createdAt: -1 })
    .limit(50); // soft cap — announcements are typically few

  res.json({ success: true, message: 'Announcements fetched successfully', count: annts.length, data: annts });
};

// @route POST /api/announcements
exports.createAnnouncement = async (req, res) => {
  const { title, content } = req.body;
  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required' });
  }
  const ann = await Announcement.create({ ...req.body, sentBy: req.user._id });
  await ann.populate('sentBy', 'name email');
  res.status(201).json({ success: true, message: 'Announcement created successfully', data: ann });
};
