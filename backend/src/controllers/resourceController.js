const Resource = require('../models/Resource');

// @route GET /api/resources
exports.getResources = async (req, res) => {
  const filter = {};
  if (req.query.category)   filter.category   = req.query.category;
  if (req.query.difficulty) filter.difficulty = req.query.difficulty;

  const resources = await Resource.find(filter)
    .populate('addedBy', 'name email')
    .sort({ isFeatured: -1, createdAt: -1 });

  res.json({ success: true, count: resources.length, data: resources });
};

// @route POST /api/resources
exports.createResource = async (req, res) => {
  const { title, url } = req.body;
  if (!title || !url) {
    return res.status(400).json({ success: false, message: 'Title and URL are required' });
  }
  const resource = await Resource.create({ ...req.body, addedBy: req.user._id });
  await resource.populate('addedBy', 'name email');
  res.status(201).json({ success: true, data: resource });
};

// @route DELETE /api/resources/:id
exports.deleteResource = async (req, res) => {
  const resource = await Resource.findByIdAndDelete(req.params.id);
  if (!resource) return res.status(404).json({ success: false, message: 'Resource not found' });
  res.json({ success: true, message: 'Resource deleted' });
};
