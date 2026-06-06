const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../utils/logger');

// ================= LOGIN =================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  const user = await User.findOne({ email });

  if (!user || !user.isActive) {
    logger.warn(`Failed login attempt for email: ${email} from IP: ${req.ip}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    logger.warn(`Invalid password attempt for email: ${email} from IP: ${req.ip}`);
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  logger.info(`User logged in: ${user.email} [${user.role}] from IP: ${req.ip}`);

  res.json({
    success: true,
    token,
    user
  });
};


// ================= GET ME =================
exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user });
};


// ================= REGISTER =================
exports.register = async (req, res) => {
  const {
    name,
    username, // ✅ added
    email,
    password,
    role,
    college,
    department,
    phone
  } = req.body;

  // ✅ validation fixed
  if (!name || !email || !role || !username) {
    return res.status(400).json({
      success: false,
      message: 'Name, username, email, and role are required'
    });
  }

  // check existing user
  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({
      success: false,
      message: 'Email already registered'
    });
  }

  // create user (🔥 username added)
  const user = await User.create({
    name,
    username,
    email,
    password: password || 'Password@123',
    role,
    college,
    department,
    phone,
  });

  logger.info(`New user registered: ${user.email} [${user.role}]`);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    user
  });
};