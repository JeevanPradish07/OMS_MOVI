import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Download, Radio, Search, ChevronRight, ChevronDown, 
  ChevronLeft, Bot, SearchX, Flag, User, Grid2X2
} from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';

// --- MOCK DATA ---
const mockLogs = [
  {
    id: 1, timestamp: "2024-10-12T10:42:15", user: { name: "Sarah Johnson", role: "HR Manager" },
    action: "Create", module: "Users", ipAddress: "192.168.1.42", result: "SUCCESS",
    device: "Chrome / Windows 11", details: "Created user Michael Chen (ID: 1024) with role Intern",
    sessionId: "sess_abc123d", requestId: "req_xyz789a", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36..."
  },
  {
    id: 2, timestamp: "2024-10-12T10:45:02", user: { name: "Automated System", role: "System" },
    action: "Delete", module: "System", ipAddress: "System", result: "WARNING",
    device: "Internal Cron", details: "Purged 42 expired password reset tokens",
    sessionId: "sys_cron_pwd", requestId: "req_cron112", userAgent: "Node.js V18 Task Runner"
  },
  {
    id: 3, timestamp: "2024-10-12T11:05:18", user: { name: "Alex Mercer", role: "Intern" },
    action: "Login", module: "Auth", ipAddress: "203.0.113.45", result: "FAILED",
    device: "Safari / macOS", details: "Failed login attempt: Invalid password",
    sessionId: "none", requestId: "req_auth001", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)..."
  },
  {
    id: 4, timestamp: "2024-10-12T11:06:22", user: { name: "Alex Mercer", role: "Intern" },
    action: "Login", module: "Auth", ipAddress: "203.0.113.45", result: "FAILED",
    device: "Safari / macOS", details: "Failed login attempt: Account locked due to multiple attempts",
    sessionId: "none", requestId: "req_auth002", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)..."
  },
  {
    id: 5, timestamp: "2024-10-12T11:30:00", user: { name: "Admin User", role: "Super Admin" },
    action: "Permission Change", module: "Roles", ipAddress: "192.168.1.10", result: "SUCCESS",
    device: "Firefox / Ubuntu", details: "Granted 'Export Reports' permission to 'PMO Lead' role",
    sessionId: "sess_adm999", requestId: "req_rol444", userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0)..."
  },
  {
    id: 6, timestamp: "2024-10-12T13:15:44", user: { name: "David Kim", role: "PMO Lead" },
    action: "Export", module: "Projects", ipAddress: "10.0.0.15", result: "SUCCESS",
    device: "Edge / Windows 10", details: "Exported Q3 Project Timeline to CSV (1,450 rows)",
    sessionId: "sess_pmo222", requestId: "req_exp888", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edg/118.0..."
  },
  {
    id: 7, timestamp: "2024-10-12T14:22:10", user: { name: "Emily Watson", role: "Department Head" },
    action: "Update", module: "Departments", ipAddress: "192.168.1.150", result: "SUCCESS",
    device: "Chrome / macOS", details: "Updated budget allocation for Marketing department (+15%)",
    sessionId: "sess_dpt333", requestId: "req_upd555", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/119.0..."
  },
  {
    id: 8, timestamp: "2024-10-12T15:00:05", user: { name: "System Admin", role: "Super Admin" },
    action: "Delete", module: "Users", ipAddress: "192.168.1.10", result: "WARNING",
    device: "Chrome / Windows 11", details: "Deleted user account 'John Doe' (ID: 884)",
    sessionId: "sess_adm999", requestId: "req_del777", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0..."
  },
  {
    id: 9, timestamp: "2024-10-12T15:45:30", user: { name: "Unknown User", role: "Guest" },
    action: "Read", module: "Security", ipAddress: "185.199.108.153", result: "FAILED",
    device: "Curl / Linux", details: "Unauthorized access attempt to /api/v1/system/config",
    sessionId: "none", requestId: "req_sec999", userAgent: "curl/7.81.0"
  },
  {
    id: 10, timestamp: "2024-10-12T16:10:12", user: { name: "Sarah Johnson", role: "HR Manager" },
    action: "Password Reset", module: "Auth", ipAddress: "192.168.1.42", result: "SUCCESS",
    device: "Chrome / Windows 11", details: "Triggered password reset email for user ID: 1024",
    sessionId: "sess_abc123d", requestId: "req_pwd333", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0..."
  },
  {
    id: 11, timestamp: "2024-10-13T08:30:00", user: { name: "Automated System", role: "System" },
    action: "Export", module: "Audit Logs", ipAddress: "System", result: "SUCCESS",
    device: "Internal Job", details: "Generated daily security audit digest",
    sessionId: "sys_cron_sec", requestId: "req_cron113", userAgent: "Node.js V18 Task Runner"
  },
  {
    id: 12, timestamp: "2024-10-13T09:15:22", user: { name: "David Kim", role: "PMO Lead" },
    action: "Create", module: "Tasks", ipAddress: "10.0.0.15", result: "SUCCESS",
    device: "Edge / Windows 10", details: "Created Epic 'Q4 Cloud Migration' with 12 subtasks",
    sessionId: "sess_pmo223", requestId: "req_tsk111", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edg/118.0..."
  },
  {
    id: 13, timestamp: "2024-10-13T10:05:40", user: { name: "Alex Mercer", role: "Intern" },
    action: "Login", module: "Auth", ipAddress: "203.0.113.45", result: "SUCCESS",
    device: "Safari / macOS", details: "Successful login after password reset",
    sessionId: "sess_int555", requestId: "req_auth003", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)..."
  },
  {
    id: 14, timestamp: "2024-10-13T11:20:15", user: { name: "Admin User", role: "Super Admin" },
    action: "Update", module: "System", ipAddress: "192.168.1.10", result: "WARNING",
    device: "Firefox / Ubuntu", details: "Modified global session timeout setting from 60m to 120m",
    sessionId: "sess_adm999", requestId: "req_sys444", userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0)..."
  },
  {
    id: 15, timestamp: "2024-10-13T13:45:00", user: { name: "Emily Watson", role: "Department Head" },
    action: "Export", module: "Reports", ipAddress: "192.168.1.150", result: "FAILED",
    device: "Chrome / macOS", details: "Export failed: Payload too large (>50MB limit)",
    sessionId: "sess_dpt333", requestId: "req_exp889", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) Chrome/119.0..."
  },
  {
    id: 16, timestamp: "2024-10-13T14:10:30", user: { name: "System Admin", role: "Super Admin" },
    action: "Delete", module: "Projects", ipAddress: "192.168.1.10", result: "SUCCESS",
    device: "Chrome / Windows 11", details: "Archived project 'Legacy Portal' (ID: PRJ-092)",
    sessionId: "sess_adm999", requestId: "req_del778", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0..."
  },
  {
    id: 17, timestamp: "2024-10-13T15:30:45", user: { name: "Sarah Johnson", role: "HR Manager" },
    action: "Read", module: "Audit Logs", ipAddress: "192.168.1.42", result: "FAILED",
    device: "Chrome / Windows 11", details: "Access denied: Insufficient permissions for module 'Audit Logs'",
    sessionId: "sess_abc123d", requestId: "req_sec998", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/119.0..."
  },
  {
    id: 18, timestamp: "2024-10-13T16:00:00", user: { name: "Automated System", role: "System" },
    action: "Update", module: "Users", ipAddress: "System", result: "SUCCESS",
    device: "Internal Sync", details: "Synced 45 user records from Azure AD",
    sessionId: "sys_cron_aad", requestId: "req_cron114", userAgent: "Node.js V18 Task Runner"
  },
  {
    id: 19, timestamp: "2024-10-13T16:45:20", user: { name: "David Kim", role: "PMO Lead" },
    action: "Logout", module: "Auth", ipAddress: "10.0.0.15", result: "SUCCESS",
    device: "Edge / Windows 10", details: "User explicitly logged out",
    sessionId: "sess_pmo223", requestId: "req_auth004", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edg/118.0..."
  },
  {
    id: 20, timestamp: "2024-10-13T17:05:10", user: { name: "Admin User", role: "Super Admin" },
    action: "Create", module: "Roles", ipAddress: "192.168.1.10", result: "SUCCESS",
    device: "Firefox / Ubuntu", details: "Created new custom role 'External Auditor'",
    sessionId: "sess_adm999", requestId: "req_rol445", userAgent: "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:109.0)..."
  }
];

// --- HELPERS ---
const getActionColor = (action) => {
  switch(action) {
    case 'Create': return 'bg-blue-100 text-blue-700';
    case 'Update': return 'bg-amber-100 text-amber-700';
    case 'Delete': return 'bg-red-100 text-red-700';
    case 'Login': return 'bg-green-100 text-green-700';
    case 'Logout': return 'bg-gray-100 text-gray-700';
    case 'Permission Change': return 'bg-purple-100 text-purple-700';
    case 'Password Reset': return 'bg-orange-100 text-orange-700';
    case 'Export': return 'bg-cyan-100 text-cyan-700';
    default: return 'bg-slate-100 text-slate-700';
  }
};

const getModuleColor = (module) => {
  switch(module) {
    case 'Users': return 'bg-blue-100 text-blue-700';
    case 'Departments': return 'bg-violet-100 text-violet-700';
    case 'Roles': return 'bg-indigo-100 text-indigo-700';
    case 'Reports': return 'bg-cyan-100 text-cyan-700';
    case 'Audit Logs': return 'bg-slate-100 text-slate-700';
    case 'Projects': return 'bg-emerald-100 text-emerald-700';
    case 'Tasks': return 'bg-amber-100 text-amber-700';
    case 'Auth': return 'bg-slate-200 text-slate-800';
    case 'Security': return 'bg-red-100 text-red-700';
    case 'System': return 'bg-gray-200 text-gray-800';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getRoleColor = (role) => {
  if (role === 'System') return 'bg-gray-200 text-gray-700';
  if (role === 'Super Admin') return 'bg-red-100 text-red-700';
  if (role === 'HR Manager') return 'bg-blue-100 text-blue-700';
  if (role === 'PMO Lead') return 'bg-purple-100 text-purple-700';
  if (role === 'Department Head') return 'bg-amber-100 text-amber-700';
  if (role === 'Intern') return 'bg-green-100 text-green-700';
  return 'bg-slate-100 text-slate-700';
};

const getResultColor = (result) => {
  switch(result) {
    case 'SUCCESS': return 'bg-[#DCFCE7] text-[#16A34A]';
    case 'FAILED': return 'bg-[#FEE2E2] text-[#DC2626]';
    case 'WARNING': return 'bg-[#FEF3C7] text-[#D97706]';
    default: return 'bg-slate-100 text-slate-700';
  }
};

const formatDate = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const formatTime = (isoString) => {
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' });
};

// --- SUB-COMPONENTS ---
const FilterBar = ({ searchQuery, setSearchQuery, filters, setFilters, activeCount, onClear }) => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      {/* Row 1: Search */}
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by user, action, module, IP address, or details..."
          className="w-full bg-white border border-[#E2E8F0] rounded-lg pl-11 pr-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
        />
      </div>

      {/* Row 2: Filters */}
      <div className="flex flex-wrap items-center gap-3 w-full">
        <select 
          value={filters.dateRange} onChange={e => setFilters({...filters, dateRange: e.target.value})}
          className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer"
        >
          <option value="all">Date Range: All Time</option>
          <option value="today">Today</option>
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
        </select>

        <select 
          value={filters.user} onChange={e => setFilters({...filters, user: e.target.value})}
          className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer max-w-[150px]"
        >
          <option value="all">All Users</option>
          <option value="Sarah Johnson">Sarah Johnson</option>
          <option value="Automated System">Automated System</option>
          <option value="Alex Mercer">Alex Mercer</option>
          <option value="Admin User">Admin User</option>
          <option value="System Admin">System Admin</option>
        </select>

        <select 
          value={filters.module} onChange={e => setFilters({...filters, module: e.target.value})}
          className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer"
        >
          <option value="all">All Modules</option>
          {['Users', 'Departments', 'Roles', 'Reports', 'Audit Logs', 'Projects', 'Tasks', 'Auth', 'Security', 'System'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select 
          value={filters.actionType} onChange={e => setFilters({...filters, actionType: e.target.value})}
          className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer"
        >
          <option value="all">All Actions</option>
          {['Create', 'Read', 'Update', 'Delete', 'Login', 'Logout', 'Export', 'Permission Change', 'Password Reset'].map(a => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>

        <select 
          value={filters.result} onChange={e => setFilters({...filters, result: e.target.value})}
          className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer"
        >
          <option value="all">All Results</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
          <option value="WARNING">Warning</option>
        </select>

        <input 
          type="text" 
          value={filters.ipAddress}
          onChange={e => setFilters({...filters, ipAddress: e.target.value})}
          placeholder="Filter by IP..." 
          className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] max-w-[130px]"
        />

        {activeCount > 0 && (
          <div className="flex items-center gap-3 ml-auto">
            <span className="bg-[#EFF6FF] text-[#2563EB] text-xs font-semibold px-2.5 py-1 rounded-full">
              {activeCount} active
            </span>
            <button 
              onClick={onClear}
              className="text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const StatsBar = ({ total, success, failed, warning, setFilterResult }) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg px-6 py-3 flex gap-8 items-center mb-6 shadow-sm overflow-x-auto whitespace-nowrap">
      <div className="text-sm font-medium text-[#0F172A]">
        Total: <span className="font-bold">{total}</span>
      </div>
      <div className="w-[1px] h-4 bg-[#E2E8F0]"></div>
      <button onClick={() => setFilterResult('SUCCESS')} className="text-sm font-medium text-[#16A34A] hover:opacity-80 transition-opacity">
        ✓ Success: <span className="font-bold">{success}</span>
      </button>
      <div className="w-[1px] h-4 bg-[#E2E8F0]"></div>
      <button onClick={() => setFilterResult('FAILED')} className="text-sm font-medium text-[#DC2626] hover:opacity-80 transition-opacity">
        ✗ Failed: <span className="font-bold">{failed}</span>
      </button>
      <div className="w-[1px] h-4 bg-[#E2E8F0]"></div>
      <button onClick={() => setFilterResult('WARNING')} className="text-sm font-medium text-[#D97706] hover:opacity-80 transition-opacity">
        ⚠ Warning: <span className="font-bold">{warning}</span>
      </button>
    </div>
  );
};

const ExpandedLogPanel = ({ log, navigate }) => {
  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Column 1 */}
          <div>
            <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Event Details</h4>
            <p className="text-sm text-[#0F172A] font-medium leading-relaxed mb-3">{log.details}</p>
            <div className="space-y-1">
              <p className="text-xs text-[#64748B]">Session ID: <span className="font-mono text-[#0F172A] ml-1">{log.sessionId}</span></p>
              <p className="text-xs text-[#64748B]">Request ID: <span className="font-mono text-[#0F172A] ml-1">{log.requestId}</span></p>
            </div>
          </div>
          
          {/* Column 2 */}
          <div>
            <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Context</h4>
            <p className="text-sm text-[#0F172A] mb-1">{log.device}</p>
            <p className="text-xs text-[#64748B] mb-2">Res: 1920x1080 (Mock)</p>
            <p className="text-[11px] font-mono text-[#64748B] bg-[#E2E8F0]/50 p-2 rounded truncate max-w-full" title={log.userAgent}>
              {log.userAgent}
            </p>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Actions</h4>
            <div className="flex flex-col gap-2 items-start">
              {log.user.name !== 'Automated System' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate('/admin/users/1'); }}
                  className="text-sm font-medium text-[#2563EB] hover:underline flex items-center gap-1.5"
                >
                  <User size={14} /> View User Profile
                </button>
              )}
              <button 
                onClick={(e) => { e.stopPropagation(); /* would set filter */ }}
                className="text-sm font-medium text-[#2563EB] hover:underline flex items-center gap-1.5"
              >
                <Search size={14} /> View Related Logs
              </button>
              {log.action === 'Permission Change' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate('/admin/access-matrix'); }}
                  className="text-sm font-medium text-[#2563EB] hover:underline flex items-center gap-1.5"
                >
                  <Grid2X2 size={14} /> View in Access Matrix
                </button>
              )}
              {log.result === 'FAILED' && (
                <button 
                  onClick={(e) => { e.stopPropagation(); }}
                  className="text-sm font-medium text-[#DC2626] hover:underline flex items-center gap-1.5 mt-1"
                >
                  <Flag size={14} /> Flag for Review
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LogRow = ({ log, isExpanded, onToggle, navigate }) => {
  let borderHoverClass = '';
  if (log.result === 'FAILED') borderHoverClass = 'hover:border-l-[#DC2626] border-l-transparent border-l-2';
  else if (log.result === 'WARNING') borderHoverClass = 'hover:border-l-[#D97706] border-l-transparent border-l-2';
  else borderHoverClass = 'border-l-transparent border-l-2';

  const isSystem = log.user.name === 'Automated System' || log.user.name === 'System Admin';
  const isSystemIp = log.ipAddress === 'System' || log.ipAddress === 'Internal';

  return (
    <>
      <tr 
        onClick={onToggle}
        className={`border-b border-[#E2E8F0] cursor-pointer bg-white hover:bg-[#F8FAFC] transition-colors ${borderHoverClass}`}
      >
        <td className="px-4 py-4 w-10 text-center text-[#94A3B8]">
          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
        </td>
        
        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm font-medium text-[#0F172A]">{formatDate(log.timestamp)}</div>
          <div className="text-xs text-[#64748B] font-mono mt-0.5">{formatTime(log.timestamp)}</div>
        </td>

        <td className="px-4 py-4 whitespace-nowrap">
          <div className="flex items-center gap-2">
            {isSystem && <Bot size={14} className="text-[#64748B]" />}
            <span className="text-sm font-medium text-[#0F172A]">{log.user.name}</span>
          </div>
          <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${getRoleColor(log.user.role)}`}>
            {log.user.role}
          </span>
        </td>

        <td className="px-4 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold ${getActionColor(log.action)}`}>
            {log.action}
          </span>
        </td>

        <td className="px-4 py-4 whitespace-nowrap">
          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getModuleColor(log.module)}`}>
            {log.module}
          </span>
        </td>

        <td className="px-4 py-4 whitespace-nowrap">
          {isSystemIp ? (
            <span className="inline-flex px-2 py-0.5 rounded text-xs font-medium bg-[#F1F5F9] text-[#64748B]">System</span>
          ) : (
            <span className="font-mono text-sm text-[#64748B]">{log.ipAddress}</span>
          )}
        </td>

        <td className="px-4 py-4 whitespace-nowrap">
          <span className={`inline-flex px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold ${getResultColor(log.result)}`}>
            {log.result}
          </span>
        </td>

        <td className="px-4 py-4 whitespace-nowrap">
          <div className="text-sm text-[#64748B] truncate max-w-[120px]" title={log.device}>
            {log.device}
          </div>
        </td>

        <td className="px-4 py-4">
          <div className="text-sm text-[#0F172A] truncate max-w-[200px]" title={log.details}>
            {log.details}
          </div>
        </td>
      </tr>
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan="9" className="p-0 border-b border-[#E2E8F0]">
              <ExpandedLogPanel log={log} navigate={navigate} />
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

const Pagination = ({ current, total, rowsPerPage, setRowsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(total / rowsPerPage);
  
  return (
    <div className="bg-white border-t border-[#E2E8F0] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-[#64748B]">
        Showing <span className="font-medium text-[#0F172A]">{(current - 1) * rowsPerPage + 1}</span> to <span className="font-medium text-[#0F172A]">{Math.min(current * rowsPerPage, total)}</span> of <span className="font-medium text-[#0F172A]">{total}</span> logs
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex gap-1">
          {/* Simple array of pages for mock: 1, 2, 3 */}
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${
                current === p 
                ? 'bg-[#2563EB] text-white' 
                : 'text-[#64748B] hover:bg-[#F1F5F9]'
              }`}
            >
              {p}
            </button>
          ))}
          {totalPages > 3 && <span className="w-8 h-8 flex items-center justify-center text-[#64748B]">...</span>}
        </div>

        <div className="flex items-center gap-3 border-l border-[#E2E8F0] pl-4">
          <select 
            value={rowsPerPage} 
            onChange={e => setRowsPerPage(Number(e.target.value))}
            className="border border-[#E2E8F0] rounded py-1 px-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onPageChange(Math.max(1, current - 1))}
              disabled={current === 1}
              className="p-1.5 rounded border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              onClick={() => onPageChange(Math.min(totalPages, current + 1))}
              disabled={current === totalPages}
              className="p-1.5 rounded border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function AdminAuditLogs() {
  const navigate = useNavigate();
  const [logs] = useState(mockLogs);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    dateRange: "all", user: "all", module: "all",
    actionType: "all", result: "all", ipAddress: ""
  });
  const [expandedRow, setExpandedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [liveView, setLiveView] = useState(false);

  // Computed filtering
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Search
      const sq = searchQuery.toLowerCase();
      const matchesSearch = !sq || 
        log.user.name.toLowerCase().includes(sq) ||
        log.action.toLowerCase().includes(sq) ||
        log.module.toLowerCase().includes(sq) ||
        log.ipAddress.toLowerCase().includes(sq) ||
        log.details.toLowerCase().includes(sq);
      
      if (!matchesSearch) return false;

      // Dropdown Filters
      if (filters.user !== 'all' && log.user.name !== filters.user) return false;
      if (filters.module !== 'all' && log.module !== filters.module) return false;
      if (filters.actionType !== 'all' && log.action !== filters.actionType) return false;
      if (filters.result !== 'all' && log.result !== filters.result) return false;
      if (filters.ipAddress && !log.ipAddress.includes(filters.ipAddress)) return false;
      
      // Date range omitted in mock logic for brevity, would check timestamp
      return true;
    });
  }, [logs, searchQuery, filters]);

  const activeCount = Object.values(filters).filter(v => v !== 'all' && v !== '').length;

  const handleClearFilters = () => {
    setFilters({ dateRange: "all", user: "all", module: "all", actionType: "all", result: "all", ipAddress: "" });
    setSearchQuery("");
  };

  const handleToggleRow = (id) => {
    setExpandedRow(prev => prev === id ? null : id);
  };

  // Pagination slice
  const paginatedLogs = filteredLogs.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Stats calculation
  const totalLogs = filteredLogs.length;
  const successLogs = filteredLogs.filter(l => l.result === 'SUCCESS').length;
  const failedLogs = filteredLogs.filter(l => l.result === 'FAILED').length;
  const warningLogs = filteredLogs.filter(l => l.result === 'WARNING').length;

  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] w-full flex flex-col h-full gap-6 pb-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A] flex items-center gap-3">
              Audit Logs
            </h1>
            <div className="flex items-center gap-2 mt-1 text-sm text-[#64748B]">
              <p>Track system changes, security events, and administrative actions.</p>
              {liveView && (
                <span className="flex items-center gap-1.5 text-[#16A34A] font-medium bg-[#DCFCE7] px-2 py-0.5 rounded text-xs ml-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16A34A] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16A34A]"></span>
                  </span>
                  LIVE
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="border border-[#E2E8F0] text-[#0F172A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#F8FAFC] transition-colors flex items-center gap-2">
              <Download size={16} /> Export Logs
            </button>
            <button 
              onClick={() => setLiveView(!liveView)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border ${
                liveView ? 'bg-[#16A34A] border-[#16A34A] text-white hover:bg-green-700' : 'bg-white border-[#E2E8F0] text-[#0F172A] hover:bg-[#F8FAFC]'
              }`}
            >
              <Radio size={16} className={liveView ? "animate-pulse" : ""} /> Live View
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          filters={filters} setFilters={setFilters}
          activeCount={activeCount} onClear={handleClearFilters}
        />

        {/* Stats Strip */}
        <StatsBar 
          total={totalLogs} success={successLogs} failed={failedLogs} warning={warningLogs}
          setFilterResult={(res) => setFilters({...filters, result: res})}
        />

        {/* Table Container */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto w-full custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[1000px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="w-10 px-4 py-3"></th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Timestamp</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Module</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">IP Address</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Result</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Device</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider w-[250px]">Details</th>
                </tr>
              </thead>
              <tbody>
                {paginatedLogs.length > 0 ? (
                  paginatedLogs.map((log) => (
                    <LogRow 
                      key={log.id} log={log} 
                      isExpanded={expandedRow === log.id}
                      onToggle={() => handleToggleRow(log.id)}
                      navigate={navigate}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="9" className="py-24">
                      <div className="flex flex-col items-center justify-center text-center">
                        <SearchX size={48} className="text-[#CBD5E1] mb-4" />
                        <h3 className="text-lg font-medium text-[#0F172A] mb-1">No logs found</h3>
                        <p className="text-sm text-[#64748B] mb-4">Try adjusting your filters or search query to find what you're looking for.</p>
                        {activeCount > 0 && (
                          <button 
                            onClick={handleClearFilters}
                            className="text-sm font-medium text-[#2563EB] hover:underline"
                          >
                            Clear all filters
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredLogs.length > 0 && (
            <Pagination 
              current={currentPage} total={totalLogs} 
              rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

      </div>
    </PageWrapper>
  );
}
