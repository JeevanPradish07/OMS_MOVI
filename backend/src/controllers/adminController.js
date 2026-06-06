const User       = require('../models/User');
const Task       = require('../models/Task');
const Project    = require('../models/Project');
const Attendance = require('../models/Attendance');

// @route GET /api/admin/kpis
exports.getKPIs = async (req, res) => {
  const [totalUsers, totalInterns, activeTasks, activeProjects, todayAttendance] = await Promise.all([
    User.countDocuments({ isActive: true }),
    User.countDocuments({ role: 'intern', isActive: true }),
    Task.countDocuments({ status: { $in: ['pending', 'in_progress'] } }),
    Project.countDocuments({ status: 'active' }),
    Attendance.countDocuments({
      date:   { $gte: new Date(new Date().setHours(0, 0, 0, 0)) },
      status: 'present',
    }),
  ]);

  const [tasksByStatus, usersByRole] = await Promise.all([
    Task.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    User.aggregate([{ $group: { _id: '$role',   count: { $sum: 1 } } }]),
  ]);

  res.json({
    success: true,
    data: { totalUsers, totalInterns, activeTasks, activeProjects, todayAttendance, tasksByStatus, usersByRole },
  });
};

// @route GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [recentCompletions, topPerformers, taskTrend] = await Promise.all([
    Task.countDocuments({ status: 'done', completedAt: { $gte: sevenDaysAgo } }),
    Task.aggregate([
      { $match: { status: 'done' } },
      { $group: { _id: '$assignedTo', completedTasks: { $sum: 1 } } },
      { $sort:  { completedTasks: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
      { $unwind: '$user' },
      { $project: { 'user.name': 1, 'user.email': 1, completedTasks: 1 } },
    ]),
    // Daily task completions over last 7 days
    Task.aggregate([
      { $match: { status: 'done', completedAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id:   { $dateToString: { format: '%Y-%m-%d', date: '$completedAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  res.json({ success: true, data: { recentCompletions, topPerformers, taskTrend } });
};
