import User from '../../models/User.js';
import Department from '../../models/Department.js';
import Role from '../../models/Role.js';
import AuditLog from '../../models/AuditLog.js';
import { sendSuccess, sendError } from '../../utils/apiResponse.js';

// ─── Report type definitions ──────────────────────────────────────────────────
const REPORT_TYPES = [
  {
    type: 'user-activity',
    name: 'User Activity Report',
    description: 'Users created, deactivated, and logged in within a date range, grouped by department.',
    category: 'User Reports',
    filters: ['dateFrom', 'dateTo', 'department'],
    icon: 'Users',
  },
  {
    type: 'department-summary',
    name: 'Department Summary',
    description: 'Headcount, active/inactive ratio, and role distribution per department.',
    category: 'Department Reports',
    filters: ['department'],
    icon: 'Building',
  },
  {
    type: 'role-permission-audit',
    name: 'Role & Permission Audit',
    description: 'Which roles have which permissions and how many users are assigned to each role.',
    category: 'Permission Reports',
    filters: ['role'],
    icon: 'Shield',
  },
  {
    type: 'login-activity',
    name: 'Login Activity Report',
    description: 'Login attempts, failures, and locked accounts within a date range.',
    category: 'Security Reports',
    filters: ['dateFrom', 'dateTo'],
    icon: 'Lock',
  },
];

// ─── GET /api/admin/reports ───────────────────────────────────────────────────
export const getReportTypes = (req, res) => {
  sendSuccess(res, REPORT_TYPES);
};

// ─── POST /api/admin/reports/run ─────────────────────────────────────────────
export const runReport = async (req, res, next) => {
  try {
    const { type, filters = {} } = req.body;
    if (!type) return sendError(res, 'Report type is required', 400);

    const def = REPORT_TYPES.find(r => r.type === type);
    if (!def) return sendError(res, `Unknown report type: ${type}`, 400);

    const result = await generateReport(type, filters);
    sendSuccess(res, {
      type,
      title: def.name,
      category: def.category,
      generatedAt: new Date().toISOString(),
      filters,
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET /api/admin/reports/:type/export ─────────────────────────────────────
export const exportReport = async (req, res, next) => {
  try {
    const { type } = req.params;
    const filters = req.query;

    const def = REPORT_TYPES.find(r => r.type === type);
    if (!def) return sendError(res, `Unknown report type: ${type}`, 400);

    const result = await generateReport(type, filters);
    const csv = buildCsv(def.name, filters, result);

    const exportedAt = new Date().toISOString().slice(0, 10);
    const filename = `OWMS_${type}_${exportedAt}.csv`;

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.status(200).send('﻿' + csv); // BOM for Excel
  } catch (error) {
    next(error);
  }
};

// ─── Core report generator ────────────────────────────────────────────────────
async function generateReport(type, filters) {
  switch (type) {
    case 'user-activity':     return runUserActivity(filters);
    case 'department-summary': return runDepartmentSummary(filters);
    case 'role-permission-audit': return runRolePermissionAudit(filters);
    case 'login-activity':    return runLoginActivity(filters);
    default: throw new Error(`No generator for type: ${type}`);
  }
}

// ── 1. User Activity ──────────────────────────────────────────────────────────
async function runUserActivity(filters) {
  const { dateFrom, dateTo, department } = filters;

  const dateFilter = buildDateFilter(dateFrom, dateTo);
  const userFilter = { deletedAt: { $exists: false } };
  if (department) userFilter.department = department;
  if (dateFilter) userFilter.createdAt = dateFilter;

  const [users, departments] = await Promise.all([
    User.find(userFilter)
      .populate('role', 'name slug')
      .populate('department', 'name')
      .sort({ createdAt: -1 })
      .lean(),
    Department.find().select('name').lean(),
  ]);

  const total      = users.length;
  const active     = users.filter(u => u.status === 'Active').length;
  const inactive   = users.filter(u => u.status === 'Inactive').length;
  const suspended  = users.filter(u => u.status === 'Suspended').length;

  // Group by department
  const byDept = {};
  departments.forEach(d => { byDept[d._id.toString()] = { department: d.name, total: 0, active: 0, inactive: 0 }; });
  byDept['__none__'] = { department: 'No Department', total: 0, active: 0, inactive: 0 };

  users.forEach(u => {
    const key = u.department?._id?.toString() || '__none__';
    if (!byDept[key]) byDept[key] = { department: u.department?.name || 'Unknown', total: 0, active: 0, inactive: 0 };
    byDept[key].total++;
    if (u.status === 'Active') byDept[key].active++;
    else byDept[key].inactive++;
  });

  const rows = users.map(u => ({
    name: u.name,
    email: u.email,
    employeeId: u.employeeId,
    role: u.role?.name || '—',
    department: u.department?.name || '—',
    status: u.status,
    employmentType: u.employmentType,
    joinDate: u.joinDate ? new Date(u.joinDate).toLocaleDateString('en-US') : '—',
    createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-US') : '—',
  }));

  return {
    summary: { total, active, inactive, suspended },
    groupedByDepartment: Object.values(byDept).filter(d => d.total > 0),
    rows,
    columns: ['Name', 'Email', 'Employee ID', 'Role', 'Department', 'Status', 'Employment Type', 'Join Date', 'Created At'],
  };
}

// ── 2. Department Summary ─────────────────────────────────────────────────────
async function runDepartmentSummary(filters) {
  const { department } = filters;
  const deptFilter = department ? { _id: department } : {};

  const departments = await Department.find(deptFilter).lean();

  const rows = await Promise.all(departments.map(async (dept) => {
    const [total, active, inactive] = await Promise.all([
      User.countDocuments({ department: dept._id, deletedAt: { $exists: false } }),
      User.countDocuments({ department: dept._id, status: 'Active', deletedAt: { $exists: false } }),
      User.countDocuments({ department: dept._id, status: 'Inactive', deletedAt: { $exists: false } }),
    ]);
    return {
      department: dept.name,
      code: dept.code || '—',
      status: dept.status || 'Active',
      headcount: total,
      active,
      inactive,
      activeRatio: total > 0 ? Math.round((active / total) * 100) + '%' : '0%',
    };
  }));

  const totalHeadcount = rows.reduce((sum, r) => sum + r.headcount, 0);
  const totalActive = rows.reduce((sum, r) => sum + r.active, 0);

  return {
    summary: {
      totalDepartments: rows.length,
      totalHeadcount,
      totalActive,
      totalInactive: totalHeadcount - totalActive,
    },
    rows,
    columns: ['Department', 'Code', 'Status', 'Headcount', 'Active', 'Inactive', 'Active Ratio'],
  };
}

// ── 3. Role & Permission Audit ────────────────────────────────────────────────
async function runRolePermissionAudit(filters) {
  const { role } = filters;
  const roleFilter = role ? { _id: role } : {};

  const roles = await Role.find(roleFilter)
    .populate('permissions', 'name resource action status')
    .lean();

  const rows = await Promise.all(roles.map(async (r) => {
    const userCount = await User.countDocuments({ role: r._id, deletedAt: { $exists: false } });
    const perms = (r.permissions || []).filter(p => p.status === 'Active');
    return {
      role: r.name,
      slug: r.slug,
      status: r.status,
      userCount,
      permissionCount: perms.length,
      permissions: perms.map(p => `${p.resource}:${p.action}`).join(', '),
    };
  }));

  const totalUsers = rows.reduce((sum, r) => sum + r.userCount, 0);
  const totalPerms = rows.reduce((sum, r) => sum + r.permissionCount, 0);

  return {
    summary: {
      totalRoles: rows.length,
      totalUsers,
      totalPermissions: totalPerms,
    },
    rows,
    columns: ['Role', 'Slug', 'Status', 'Users Assigned', 'Active Permissions', 'Permissions'],
  };
}

// ── 4. Login Activity ─────────────────────────────────────────────────────────
async function runLoginActivity(filters) {
  const { dateFrom, dateTo } = filters;
  const dateFilter = buildDateFilter(dateFrom, dateTo);

  const logFilter = { action: { $in: ['Login', 'Logout'] } };
  if (dateFilter) logFilter.createdAt = dateFilter;

  const logs = await AuditLog.find(logFilter)
    .populate({ path: 'user', select: 'name email employeeId', populate: { path: 'role', select: 'name' } })
    .sort({ createdAt: -1 })
    .limit(5000)
    .lean();

  const totalLogins   = logs.filter(l => l.action === 'Login').length;
  const successLogins = logs.filter(l => l.action === 'Login' && l.result === 'SUCCESS').length;
  const failedLogins  = logs.filter(l => l.action === 'Login' && l.result === 'FAILED').length;

  // Locked accounts — users with lockUntil in the future
  const lockedCount = await User.countDocuments({
    lockUntil: { $gt: new Date() },
    deletedAt: { $exists: false },
  });

  const rows = logs.map(l => ({
    timestamp: l.createdAt ? new Date(l.createdAt).toLocaleString('en-US') : '—',
    user: l.user?.name || l.userName || 'Unknown',
    email: l.user?.email || '—',
    role: l.user?.role?.name || '—',
    action: l.action,
    result: l.result,
    ipAddress: l.ipAddress || '—',
    device: l.device || '—',
  }));

  return {
    summary: {
      totalEvents: logs.length,
      totalLogins,
      successLogins,
      failedLogins,
      lockedAccounts: lockedCount,
    },
    rows,
    columns: ['Timestamp', 'User', 'Email', 'Role', 'Action', 'Result', 'IP Address', 'Device'],
  };
}

// ─── CSV builder ──────────────────────────────────────────────────────────────
function buildCsv(title, filters, result) {
  const escape = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;

  const metaLines = [
    `"Report:","${title}"`,
    `"Generated At:","${new Date().toLocaleString('en-US')}"`,
  ];
  if (filters.dateFrom) metaLines.push(`"From:","${filters.dateFrom}"`);
  if (filters.dateTo)   metaLines.push(`"To:","${filters.dateTo}"`);
  metaLines.push(''); // blank separator

  const header = result.columns.map(escape).join(',');
  const dataRows = result.rows.map(row =>
    result.columns.map(col => {
      const key = col.toLowerCase().replace(/[^a-z]/g, '');
      // Try to find the right field by rough key match
      const val = Object.entries(row).find(([k]) => k.toLowerCase().replace(/[^a-z]/g, '') === key)?.[1];
      return escape(val ?? '');
    }).join(',')
  );

  return [...metaLines, header, ...dataRows].join('\n');
}

// ─── Util ─────────────────────────────────────────────────────────────────────
function buildDateFilter(dateFrom, dateTo) {
  if (!dateFrom && !dateTo) return null;
  const f = {};
  if (dateFrom) f.$gte = new Date(dateFrom);
  if (dateTo) {
    const end = new Date(dateTo);
    end.setHours(23, 59, 59, 999);
    f.$lte = end;
  }
  return f;
}
