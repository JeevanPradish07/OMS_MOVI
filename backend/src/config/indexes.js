const mongoose = require('mongoose');
const logger = require('../utils/logger');

const createIndexes = async () => {
  try {
    const Task = mongoose.model('Task');
    const Attendance = mongoose.model('Attendance');
    const Message = mongoose.model('Message');
    const Performance = mongoose.model('Performance');
    const User = mongoose.model('User');
    const Project = mongoose.model('Project');
    const StatusUpdate = mongoose.model('StatusUpdate');
    const Document = mongoose.model('Document');

    await Promise.all([
      // Task indexes
      Task.collection.createIndex({ assignedTo: 1, status: 1 }),
      Task.collection.createIndex({ project: 1, status: 1 }),
      Task.collection.createIndex({ dueDate: 1 }),
      Task.collection.createIndex({ createdAt: -1 }),

      // Attendance — unique compound (prevent duplicates)
      Attendance.collection.createIndex(
        { user: 1, date: 1 },
        { unique: true }
      ),

      // Message indexes
      Message.collection.createIndex({ sender: 1, recipient: 1 }),
      Message.collection.createIndex({ createdAt: -1 }),
      Message.collection.createIndex({ recipient: 1, read: 1 }),

      // Performance indexes
      Performance.collection.createIndex({ user: 1, period: 1 }),
      Performance.collection.createIndex({ createdAt: -1 }),

      // User indexes
      User.collection.createIndex({ role: 1, isActive: 1 }),
      User.collection.createIndex({ email: 1 }, { unique: true }),

      // Project indexes
      Project.collection.createIndex({ status: 1 }),
      Project.collection.createIndex({ createdBy: 1 }),

      // StatusUpdate indexes
      StatusUpdate.collection.createIndex({ user: 1, createdAt: -1 }),

      // Document indexes
      Document.collection.createIndex({ user: 1, createdAt: -1 }),
      Document.collection.createIndex({ category: 1 }),
    ]);

    logger.info('✅ MongoDB indexes created successfully');
  } catch (err) {
    // Ignore duplicate index errors on restart
    if (err.code !== 85 && err.code !== 86) {
      logger.warn(`Index creation warning: ${err.message}`);
    }
  }
};

module.exports = createIndexes;
