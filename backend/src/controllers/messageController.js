const Message = require('../models/Message');

// @route GET /api/messages/:userId
// Or without param for all messages
exports.getMessages = async (req, res) => {
  const userId = req.user._id;
  const paramUserId = req.params.userId;
  // Ignore if param looks like '/read' from route collision
  const withUser = (paramUserId && paramUserId !== 'all' && paramUserId !== 'read') ? paramUserId : null;

  let filter = { $or: [{ sender: userId }, { receiver: userId }] };
  if (withUser) {
    filter = {
      $or: [
        { sender: userId, receiver: withUser },
        { sender: withUser, receiver: userId },
      ],
    };
  }

  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(200, parseInt(req.query.limit) || 100);
  const skip  = (page - 1) * limit;

  const [messages, total] = await Promise.all([
    Message.find(filter)
      .populate('sender',   '_id name username role avatar')
      .populate('receiver', '_id name username role avatar')
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(limit),
    Message.countDocuments(filter),
  ]);

  res.json({ success: true, message: 'Messages fetched successfully', count: messages.length, total, page, pages: Math.ceil(total / limit), data: messages });
};

// @route POST /api/messages
exports.sendMessage = async (req, res) => {
  const { receiver, content } = req.body;
  if (!receiver || !content?.trim()) {
    return res.status(400).json({ success: false, message: 'Receiver and content are required' });
  }
  const message = await Message.create({ sender: req.user._id, receiver, content: content.trim() });
  await message.populate('sender',   '_id name username role avatar');
  await message.populate('receiver', '_id name username role avatar');
  res.status(201).json({ success: true, message: 'Message sent successfully', data: message });
};

// @route PATCH /api/messages/:id/read
exports.markRead = async (req, res) => {
  // Find first so we can check ownership before mutating
  const msg = await Message.findById(req.params.id);
  if (!msg) return res.status(404).json({ success: false, message: 'Message not found' });

  if (msg.receiver.toString() !== req.user._id.toString()) {
    return res.status(403).json({ success: false, message: 'Not authorized' });
  }

  msg.read   = true;
  msg.readAt = new Date();
  await msg.save();

  res.json({ success: true, message: 'Message marked as read', data: msg });
};
