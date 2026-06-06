require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Resource = require('../models/Resource');
const Performance = require('../models/Performance');
const Attendance = require('../models/Attendance');
const StatusUpdate = require('../models/StatusUpdate');

const connectDB = require('../config/db');

const seed = async () => {
  await connectDB();

  // Clear collections
  await Promise.all([
    User.deleteMany({}),
    Project.deleteMany({}),
    Task.deleteMany({}),
    Resource.deleteMany({}),
    Performance.deleteMany({}),
    Attendance.deleteMany({}),
    StatusUpdate.deleteMany({}),
  ]);
  console.log('🗑️  Cleared existing data');

  // Create users
  const [admin, hr, pmo, intern1, intern2] = await User.create([
    {
      name: 'Admin User',
      email: 'admin@movicloudlabs.com',
      password: 'Admin@123',
      role: 'admin',
      username: 'admin',
      department: 'Operations',
    },
    {
      name: 'Sarah Mitchell',
      email: 'hr@movicloudlabs.com',
      password: 'HR@123456',
      role: 'hr',
      username: 'sarah_hr',
      department: 'Human Resources',
    },
    {
      name: 'Marcus Thorne',
      email: 'pmo@movicloudlabs.com',
      password: 'PMO@12345',
      role: 'pmo',
      username: 'marcus_pmo',
      department: 'Project Management',
    },
    {
      name: 'James Wilson',
      email: 'intern@movicloudlabs.com',
      password: 'Intern@123',
      role: 'intern',
      college: 'Stanford University',
      username: 'james_wilson',
      department: 'Engineering',
      joiningDate: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
    },
    {
      name: 'Priya Sharma',
      email: 'priya@movicloudlabs.com',
      password: 'Intern@123',
      role: 'intern',
      college: 'IIT Delhi',
      username: 'priya_design',
      department: 'Design',
      joiningDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    },
  ]);
  console.log('👥 Created users');

  // Create project
  const project = await Project.create({
    name: 'FinTech Dashboard v2',
    code: 'PRJ-882',
    description: 'Integrated financial monitoring system with real-time analytics and multi-account support.',
    createdBy: pmo._id,
    teamMembers: [intern1._id, intern2._id],
    status: 'active',
    health: 'stable',
    endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  });
  console.log('📁 Created project');

  // Create tasks
  const tasks = await Task.create([
    {
      title: 'User Interview Analysis',
      description: 'Analyze user interview recordings and document key insights.',
      type: 'Research',
      assignedTo: intern1._id,
      assignedBy: pmo._id,
      project: project._id,
      status: 'in_progress',
      priority: 'High',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Dashboard Wireframes',
      description: 'Create high-fidelity wireframes for the main dashboard.',
      type: 'Design',
      assignedTo: intern1._id,
      assignedBy: pmo._id,
      project: project._id,
      status: 'overdue',
      priority: 'Critical',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Accessibility Audit',
      description: 'Run WCAG 2.1 compliance audit on all public-facing pages.',
      type: 'QA',
      assignedTo: intern1._id,
      assignedBy: pmo._id,
      project: project._id,
      status: 'pending',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'Weekly Sync Report',
      description: 'Compile and submit the weekly team sync report.',
      type: 'Admin',
      assignedTo: intern1._id,
      assignedBy: hr._id,
      project: project._id,
      status: 'done',
      priority: 'Low',
      dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      completedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    },
    {
      title: 'API Integration for Payment Module',
      description: 'Integrate Stripe API for the payment processing module.',
      type: 'Development',
      assignedTo: intern2._id,
      assignedBy: pmo._id,
      project: project._id,
      status: 'in_progress',
      priority: 'High',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    },
  ]);
  console.log('✅ Created tasks');

  // Create learning resources
  await Resource.create([
    {
      title: 'React Fundamentals',
      description: 'Complete guide to React 18 with hooks, context, and advanced patterns.',
      category: 'Course',
      url: 'https://react.dev/learn',
      duration: '10 hours',
      difficulty: 'Beginner',
      addedBy: hr._id,
      isFeatured: true,
    },
    {
      title: 'Node.js Backend Architecture',
      description: 'Build scalable REST APIs with Node.js, Express, and MongoDB.',
      category: 'Video',
      url: 'https://nodejs.org/en/docs',
      duration: '8 hours',
      difficulty: 'Intermediate',
      addedBy: hr._id,
    },
    {
      title: 'System Design Interview Guide',
      description: 'Master system design concepts for large-scale distributed systems.',
      category: 'Article',
      url: 'https://github.com/donnemartin/system-design-primer',
      duration: '5 hours',
      difficulty: 'Advanced',
      addedBy: pmo._id,
    },
    {
      title: 'Figma for Developers',
      description: 'Learn Figma design handoff workflows and design tokens.',
      category: 'Course',
      url: 'https://www.figma.com/tutorials/',
      duration: '3 hours',
      difficulty: 'Beginner',
      addedBy: hr._id,
      isFeatured: true,
    },
  ]);
  console.log('📚 Created learning resources');

  // Create performance record
  await Performance.create({
    user: intern1._id,
    evaluatedBy: hr._id,
    period: 'Q1 2026',
    technicalScore: 8.2,
    communicationScore: 7.8,
    punctualityScore: 9.0,
    overallScore: 8.3,
    feedback: 'James has shown excellent progress in technical skills. Communication needs slight improvement in daily standups.',
    goals: [
      { title: 'Complete React Advanced course', status: 'completed' },
      { title: 'Submit 10 tasks without revisions', status: 'pending' },
      { title: 'Lead a team meeting', status: 'pending' },
    ],
  });
  console.log('📊 Created performance record');

  // Create attendance records for last 7 days
  const attendanceRecords = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
      attendanceRecords.push({
        user: intern1._id,
        date,
        status: i === 2 ? 'leave' : 'present',
        checkIn: '09:05',
        checkOut: '18:00',
        approvedBy: hr._id,
      });
    }
  }
  await Attendance.create(attendanceRecords);
  console.log('📅 Created attendance records');

  // Create status updates
  await StatusUpdate.create([
    {
      user: intern1._id,
      content: 'Completed the user interview analysis for the FinTech dashboard project. Identified 5 key pain points. Will start wireframes tomorrow.',
      type: 'daily',
      blockers: 'None',
    },
    {
      user: intern1._id,
      content: 'Week 6 complete. Major milestones: Dashboard wireframes draft completed, API doc reviewed. Next week: Start implementation of payment module integration.',
      type: 'weekly',
      week: 6,
      blockers: 'Waiting for Stripe API keys from PMO.',
    },
  ]);
  console.log('📝 Created status updates');

  console.log('\n🎉 Seed complete! Use these credentials to login:');
  console.log('   Admin:  admin@movicloudlabs.com  /  Admin@123');
  console.log('   HR:     hr@movicloudlabs.com     /  HR@123456');
  console.log('   PMO:    pmo@movicloudlabs.com    /  PMO@12345');
  console.log('   Intern: intern@movicloudlabs.com /  Intern@123');

  mongoose.disconnect();
};

seed().catch(err => {
  console.error('❌ Seed failed:', err);
  mongoose.disconnect();
  process.exit(1);
});
