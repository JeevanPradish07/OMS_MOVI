import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Plus, Search, BarChart2, Users, Shield, FileText, 
  Briefcase, CheckSquare, Play, History, Download, MoreVertical, 
  X, Pencil, SearchX, ChevronLeft, ChevronRight, ChevronDown, DollarSign
} from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';

// --- MOCK DATA ---
const generateRunHistory = (status, baseDate) => {
  const history = [];
  const base = new Date(baseDate);
  for(let i=0; i<5; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() - i);
    // If it's the very first item and the overall status is FAILED
    const runStatus = (i === 0 && status === 'FAILED') ? 'FAILED' : 'SUCCESS';
    history.push({
      date: d.toISOString().split('T')[0],
      status: runStatus,
      duration: runStatus === 'SUCCESS' ? '1m ' + (15 + i) + 's' : 'Failed',
      records: runStatus === 'SUCCESS' ? 12000 - (i*100) : 0,
      fileSize: runStatus === 'SUCCESS' ? '2.' + (4-i) + ' MB' : '-',
      error: runStatus === 'FAILED' ? 'Error: DB connection timeout' : null
    });
  }
  return history;
};

const mockReports = [
  {
    id: 1, name: "Active Users Overview", description: "Summary of all active user accounts with role distribution across departments.",
    category: "User Reports", type: "system", schedule: "Daily",
    lastRun: "2024-10-12T08:00:00", lastRunStatus: "SUCCESS", lastRunRecords: 12847,
    lastRunFileSize: "2.4 MB", lastRunDuration: "1m 24s", createdBy: "System Admin",
    dataSource: ["Users", "Roles", "Departments"], outputFormats: ["PDF", "XLSX", "CSV"],
    runHistory: generateRunHistory('SUCCESS', '2024-10-12')
  },
  {
    id: 2, name: "Weekly Security Audit", description: "Comprehensive log of all failed logins, permission changes, and security events.",
    category: "Security Reports", type: "system", schedule: "Weekly",
    lastRun: "2024-10-10T00:00:00", lastRunStatus: "SUCCESS", lastRunRecords: 450,
    lastRunFileSize: "0.8 MB", lastRunDuration: "45s", createdBy: "System Admin",
    dataSource: ["Audit Logs", "Auth", "Security"], outputFormats: ["PDF", "CSV"],
    runHistory: generateRunHistory('SUCCESS', '2024-10-10')
  },
  {
    id: 3, name: "Department Budget Utilization", description: "Q3 financial breakdown by department showing planned vs actual spend.",
    category: "Financial Reports", type: "custom", schedule: "Monthly",
    lastRun: "2024-10-01T06:00:00", lastRunStatus: "FAILED", lastRunRecords: 0,
    lastRunFileSize: "-", lastRunDuration: "-", createdBy: "Sarah Johnson",
    dataSource: ["Financials", "Departments"], outputFormats: ["XLSX", "CSV"],
    runHistory: generateRunHistory('FAILED', '2024-10-01')
  },
  {
    id: 4, name: "Project Completion Rates", description: "Analysis of project milestones, overdue tasks, and PMO resource allocation.",
    category: "Project Reports", type: "custom", schedule: "Weekly",
    lastRun: "2024-10-11T09:30:00", lastRunStatus: "SUCCESS", lastRunRecords: 3200,
    lastRunFileSize: "5.1 MB", lastRunDuration: "2m 10s", createdBy: "David Kim",
    dataSource: ["Projects", "Tasks"], outputFormats: ["PDF", "XLSX"],
    runHistory: generateRunHistory('SUCCESS', '2024-10-11')
  },
  {
    id: 5, name: "System Access Matrix", description: "Complete map of all roles and their permissions across system resources.",
    category: "Permission Reports", type: "system", schedule: "On-Demand",
    lastRun: "2024-10-12T14:20:00", lastRunStatus: "SUCCESS", lastRunRecords: 42,
    lastRunFileSize: "0.1 MB", lastRunDuration: "5s", createdBy: "System Admin",
    dataSource: ["Roles", "Permissions"], outputFormats: ["PDF", "XLSX", "CSV"],
    runHistory: generateRunHistory('SUCCESS', '2024-10-12')
  },
  {
    id: 6, name: "Employee Attendance & Leave", description: "Monthly timesheet aggregation, PTO balances, and sick leave tracking.",
    category: "User Reports", type: "custom", schedule: "Monthly",
    lastRun: null, lastRunStatus: "NEVER", lastRunRecords: 0,
    lastRunFileSize: "-", lastRunDuration: "-", createdBy: "Sarah Johnson",
    dataSource: ["Users", "Attendance"], outputFormats: ["XLSX", "CSV"],
    runHistory: []
  },
  {
    id: 7, name: "Pending Approval Queue", description: "Real-time snapshot of all tasks and requests awaiting PMO or Admin approval.",
    category: "Task Reports", type: "system", schedule: "Daily",
    lastRun: "2024-10-12T08:00:00", lastRunStatus: "PENDING", lastRunRecords: 0,
    lastRunFileSize: "-", lastRunDuration: "-", createdBy: "System Admin",
    dataSource: ["Tasks", "Approvals"], outputFormats: ["PDF", "CSV"],
    runHistory: generateRunHistory('SUCCESS', '2024-10-11')
  },
  {
    id: 8, name: "Role Distribution Analytics", description: "Statistical breakdown of role assignments across the entire organization.",
    category: "Role Reports", type: "system", schedule: "Manual",
    lastRun: "2024-09-15T10:00:00", lastRunStatus: "SUCCESS", lastRunRecords: 15,
    lastRunFileSize: "0.2 MB", lastRunDuration: "12s", createdBy: "System Admin",
    dataSource: ["Roles", "Users"], outputFormats: ["PDF", "CSV"],
    runHistory: generateRunHistory('SUCCESS', '2024-09-15')
  },
  {
    id: 9, name: "Failed Logins (Last 24h)", description: "Security report highlighting repetitive login failures and locked accounts.",
    category: "Security Reports", type: "custom", schedule: "Daily",
    lastRun: "2024-10-12T00:00:00", lastRunStatus: "SUCCESS", lastRunRecords: 18,
    lastRunFileSize: "0.1 MB", lastRunDuration: "8s", createdBy: "Alex Mercer",
    dataSource: ["Audit Logs", "Auth"], outputFormats: ["CSV"],
    runHistory: generateRunHistory('SUCCESS', '2024-10-12')
  },
  {
    id: 10, name: "Q4 Marketing Campaigns", description: "Task progress and resource utilization for all Q4 Marketing projects.",
    category: "Department Reports", type: "custom", schedule: "Weekly",
    lastRun: "2024-10-08T09:00:00", lastRunStatus: "FAILED", lastRunRecords: 0,
    lastRunFileSize: "-", lastRunDuration: "-", createdBy: "Emily Watson",
    dataSource: ["Projects", "Tasks", "Departments"], outputFormats: ["PDF", "XLSX"],
    runHistory: generateRunHistory('FAILED', '2024-10-08')
  },
  {
    id: 11, name: "Inactive Users Audit", description: "List of users who have not logged into the system in over 90 days.",
    category: "Audit Reports", type: "system", schedule: "Monthly",
    lastRun: "2024-10-01T02:00:00", lastRunStatus: "SUCCESS", lastRunRecords: 112,
    lastRunFileSize: "0.3 MB", lastRunDuration: "15s", createdBy: "System Admin",
    dataSource: ["Users", "Auth"], outputFormats: ["PDF", "CSV"],
    runHistory: generateRunHistory('SUCCESS', '2024-10-01')
  },
  {
    id: 12, name: "Daily API Usage Stats", description: "Volume and latency metrics for all external API integrations.",
    category: "Security Reports", type: "system", schedule: "Daily",
    lastRun: "2024-10-12T03:00:00", lastRunStatus: "SUCCESS", lastRunRecords: 50000,
    lastRunFileSize: "8.5 MB", lastRunDuration: "3m 45s", createdBy: "System Admin",
    dataSource: ["System Logs"], outputFormats: ["CSV"],
    runHistory: generateRunHistory('SUCCESS', '2024-10-12')
  },
  {
    id: 13, name: "Task Bottleneck Analysis", description: "Identifies tasks that have spent more than 5 days in the 'In Progress' state.",
    category: "Task Reports", type: "custom", schedule: "On-Demand",
    lastRun: "2024-10-10T11:45:00", lastRunStatus: "SUCCESS", lastRunRecords: 85,
    lastRunFileSize: "0.4 MB", lastRunDuration: "22s", createdBy: "David Kim",
    dataSource: ["Tasks"], outputFormats: ["XLSX"],
    runHistory: generateRunHistory('SUCCESS', '2024-10-10')
  },
  {
    id: 14, name: "Intern Performance Metrics", description: "Aggregated performance scores and task completion rates for all active interns.",
    category: "User Reports", type: "custom", schedule: "Monthly",
    lastRun: "2024-10-01T08:00:00", lastRunStatus: "SUCCESS", lastRunRecords: 45,
    lastRunFileSize: "1.2 MB", lastRunDuration: "48s", createdBy: "Sarah Johnson",
    dataSource: ["Users", "Performance", "Tasks"], outputFormats: ["PDF", "XLSX"],
    runHistory: generateRunHistory('SUCCESS', '2024-10-01')
  }
];

// --- HELPERS ---
const getTypeIcon = (category) => {
  switch(category) {
    case 'User Reports': return <Users size={16} className="text-blue-600" />;
    case 'Security Reports':
    case 'Permission Reports': return <Shield size={16} className="text-red-600" />;
    case 'Audit Reports': return <FileText size={16} className="text-slate-600" />;
    case 'Project Reports': return <Briefcase size={16} className="text-emerald-600" />;
    case 'Task Reports': return <CheckSquare size={16} className="text-amber-600" />;
    case 'Financial Reports': return <DollarSign size={16} className="text-green-600" />;
    default: return <BarChart2 size={16} className="text-indigo-600" />;
  }
};

const getTypeBg = (category) => {
  switch(category) {
    case 'User Reports': return 'bg-blue-100';
    case 'Security Reports':
    case 'Permission Reports': return 'bg-red-100';
    case 'Audit Reports': return 'bg-slate-100';
    case 'Project Reports': return 'bg-emerald-100';
    case 'Task Reports': return 'bg-amber-100';
    case 'Financial Reports': return 'bg-green-100';
    default: return 'bg-indigo-100';
  }
};

const getCategoryColor = (category) => {
  switch(category) {
    case 'User Reports': return 'bg-blue-100 text-blue-700';
    case 'Department Reports': return 'bg-violet-100 text-violet-700';
    case 'Role Reports': return 'bg-indigo-100 text-indigo-700';
    case 'Permission Reports': return 'bg-purple-100 text-purple-700';
    case 'Security Reports': return 'bg-red-100 text-red-700';
    case 'Audit Reports': return 'bg-slate-100 text-slate-700';
    case 'Project Reports': return 'bg-emerald-100 text-emerald-700';
    case 'Task Reports': return 'bg-amber-100 text-amber-700';
    case 'Financial Reports': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const getScheduleColor = (schedule) => {
  switch(schedule) {
    case 'Daily': return 'bg-[#DBEAFE] text-[#2563EB]';
    case 'Weekly': return 'bg-[#EDE9FE] text-[#7C3AED]';
    case 'Monthly': return 'bg-[#D1FAE5] text-[#065F46]';
    case 'On-Demand': return 'bg-[#FEF3C7] text-[#D97706]';
    case 'Manual': return 'bg-[#F1F5F9] text-[#64748B]';
    default: return 'bg-gray-100 text-gray-700';
  }
};

const formatRelativeTime = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return `Today, ${date.toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}`;
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else {
    return date.toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'});
  }
};

// --- SUB-COMPONENTS ---
const FilterBar = ({ searchQuery, setSearchQuery, filters, setFilters, activeCount, onClear }) => {
  return (
    <div className="flex flex-col gap-4 mb-4">
      <div className="relative w-full">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search reports by name, category, or created by..."
          className="w-full bg-white border border-[#E2E8F0] rounded-lg pl-11 pr-4 py-2.5 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full">
        <select 
          value={filters.category} onChange={e => setFilters({...filters, category: e.target.value})}
          className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer"
        >
          <option value="all">All Categories</option>
          {['User Reports', 'Department Reports', 'Role Reports', 'Permission Reports', 'Security Reports', 'Audit Reports', 'Project Reports', 'Task Reports', 'Financial Reports'].map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select 
          value={filters.schedule} onChange={e => setFilters({...filters, schedule: e.target.value})}
          className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer"
        >
          <option value="all">All Schedules</option>
          {['Daily', 'Weekly', 'Monthly', 'Manual', 'On-Demand'].map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select 
          value={filters.lastRunStatus} onChange={e => setFilters({...filters, lastRunStatus: e.target.value})}
          className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer"
        >
          <option value="all">All Statuses</option>
          <option value="SUCCESS">Success</option>
          <option value="FAILED">Failed</option>
          <option value="PENDING">Pending</option>
          <option value="NEVER">Never Run</option>
        </select>

        <select 
          value={filters.createdBy} onChange={e => setFilters({...filters, createdBy: e.target.value})}
          className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer"
        >
          <option value="all">All Creators</option>
          {['System Admin', 'Sarah Johnson', 'David Kim', 'Emily Watson', 'Alex Mercer'].map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>

        <select 
          value={filters.dataRange} onChange={e => setFilters({...filters, dataRange: e.target.value})}
          className="bg-white border border-[#E2E8F0] rounded-lg px-3 py-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer"
        >
          <option value="all">Data Range: All Time</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="1q">Last Quarter</option>
          <option value="1y">Last Year</option>
        </select>

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

const StatsBar = ({ total, scheduled, manual, success, failed, pending, setFilterStatus, setFilterSchedule }) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg px-6 py-3 flex gap-8 items-center mb-6 shadow-sm overflow-x-auto whitespace-nowrap">
      <div className="text-sm font-medium text-[#0F172A]">
        Total Reports: <span className="font-bold">{total}</span>
      </div>
      <div className="w-[1px] h-4 bg-[#E2E8F0]"></div>
      <button onClick={() => setFilterSchedule('Scheduled')} className="text-sm font-medium text-[#0F172A] hover:text-[#2563EB] transition-colors">
        Scheduled: <span className="font-bold">{scheduled}</span>
      </button>
      <div className="w-[1px] h-4 bg-[#E2E8F0]"></div>
      <button onClick={() => setFilterSchedule('Manual')} className="text-sm font-medium text-[#0F172A] hover:text-[#2563EB] transition-colors">
        Manual: <span className="font-bold">{manual}</span>
      </button>
      <div className="w-[1px] h-4 bg-[#E2E8F0]"></div>
      <button onClick={() => setFilterStatus('SUCCESS')} className="text-sm font-medium text-[#16A34A] hover:opacity-80 transition-opacity">
        ✓ Last Run: Success
      </button>
      <div className="w-[1px] h-4 bg-[#E2E8F0]"></div>
      <button onClick={() => setFilterStatus('FAILED')} className="text-sm font-medium text-[#DC2626] hover:opacity-80 transition-opacity">
        ✗ Failed Runs: <span className="font-bold">{failed}</span>
      </button>
      <div className="w-[1px] h-4 bg-[#E2E8F0]"></div>
      <button onClick={() => setFilterStatus('PENDING')} className="text-sm font-medium text-[#D97706] hover:opacity-80 transition-opacity">
        Pending: <span className="font-bold">{pending}</span>
      </button>
    </div>
  );
};

const ExpandedReportPanel = ({ report }) => {
  return (
    <motion.div 
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] px-6 py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Column 1 */}
          <div>
            <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-2">Report Details</h4>
            <p className="text-sm text-[#0F172A] font-medium leading-relaxed mb-4">{report.description}</p>
            <div className="space-y-3">
              <div>
                <span className="text-xs text-[#64748B] block mb-1">Data Source</span>
                <div className="flex flex-wrap gap-1.5">
                  {report.dataSource.map(src => (
                    <span key={src} className="bg-white border border-[#E2E8F0] text-[#0F172A] text-xs px-2 py-0.5 rounded">{src}</span>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs text-[#64748B] block mb-1">Output Formats</span>
                <div className="flex gap-1.5">
                  {report.outputFormats.map(fmt => (
                    <span key={fmt} className="bg-[#EFF6FF] text-[#2563EB] font-semibold text-[10px] px-1.5 py-0.5 rounded uppercase">{fmt}</span>
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#64748B] mt-2">Parameters: <span className="text-[#0F172A]">Default timeframe (30d), no applied filters</span></p>
            </div>
          </div>
          
          {/* Column 2 */}
          <div>
            <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">Run History</h4>
            {report.runHistory.length > 0 ? (
              <div className="space-y-2.5">
                {report.runHistory.map((run, i) => (
                  <div key={i} className="flex items-center text-sm">
                    {run.status === 'SUCCESS' 
                      ? <CheckSquare size={14} className="text-[#16A34A] mr-2 shrink-0" />
                      : <X size={14} className="text-[#DC2626] mr-2 shrink-0" />
                    }
                    <span className="text-[#0F172A] font-medium w-24 shrink-0">{run.date}</span>
                    <span className="text-[#64748B] w-16 shrink-0">{run.duration}</span>
                    {run.status === 'SUCCESS' ? (
                      <>
                        <span className="text-[#64748B] w-28 shrink-0">{run.records.toLocaleString()} records</span>
                        <button className="text-[#2563EB] hover:underline flex items-center gap-1 text-xs font-medium">
                          <Download size={12} /> Download
                        </button>
                      </>
                    ) : (
                      <span className="text-[#DC2626] text-xs">{run.error}</span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-[#64748B]">No run history available.</p>
            )}
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="text-xs font-semibold text-[#64748B] uppercase tracking-wider mb-3">Quick Actions</h4>
            <div className="flex flex-col gap-2.5 items-start">
              <button className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors w-full sm:w-auto text-center">
                Run Now
              </button>
              <button className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors flex items-center gap-2">
                <Clock size={16} /> Edit Schedule
              </button>
              <button className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors flex items-center gap-2">
                <History size={16} /> View Full History
              </button>
              <button className="text-sm font-medium text-[#475569] hover:text-[#0F172A] transition-colors flex items-center gap-2">
                <FileText size={16} /> Duplicate Report
              </button>
              {report.lastRunStatus === 'FAILED' && (
                <button className="text-sm font-medium text-[#DC2626] hover:text-red-700 transition-colors flex items-center gap-2 mt-1">
                  <AlertCircle size={16} /> View Error Log
                </button>
              )}
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

import { AlertCircle } from 'lucide-react';

const ReportRow = ({ report, isSelected, onSelect, isExpanded, onToggle }) => {
  let rowClasses = "border-b border-[#E2E8F0] cursor-pointer hover:bg-[#F8FAFC] transition-colors ";
  
  if (report.lastRunStatus === 'FAILED') rowClasses += "border-l-2 border-l-[#DC2626] bg-white";
  else if (report.lastRunStatus === 'PENDING') rowClasses += "border-l-2 border-l-transparent bg-[#FFFBEB]";
  else rowClasses += "border-l-2 border-l-transparent bg-white";

  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  return (
    <>
      <tr className={rowClasses}>
        <td className="px-4 py-4 w-12 text-center" onClick={(e) => e.stopPropagation()}>
          <input 
            type="checkbox" 
            checked={isSelected}
            onChange={onSelect}
            className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer" 
          />
        </td>
        
        <td className="px-4 py-4 whitespace-nowrap min-w-[280px]" onClick={onToggle}>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${getTypeBg(report.category)}`}>
              {getTypeIcon(report.category)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-[#0F172A]">{report.name}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${report.type === 'system' ? 'bg-[#F1F5F9] text-[#64748B]' : 'bg-[#EFF6FF] text-[#2563EB]'}`}>
                  {report.type}
                </span>
              </div>
              <div className="text-xs text-[#64748B] mt-0.5 truncate max-w-[250px]" title={report.description}>
                {report.description}
              </div>
            </div>
          </div>
        </td>

        <td className="px-4 py-4 whitespace-nowrap" onClick={onToggle}>
          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getCategoryColor(report.category)}`}>
            {report.category}
          </span>
        </td>

        <td className="px-4 py-4 whitespace-nowrap" onClick={onToggle}>
          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold ${getScheduleColor(report.schedule)}`}>
            {report.schedule}
          </span>
        </td>

        <td className="px-4 py-4 whitespace-nowrap" onClick={onToggle}>
          <div className="text-sm text-[#0F172A]">{formatRelativeTime(report.lastRun) || '—'}</div>
          {report.lastRunStatus !== 'NEVER' && (
            <div className="flex items-center gap-1.5 mt-1">
              {report.lastRunStatus === 'SUCCESS' && <><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span><span className="text-xs text-[#16A34A] font-medium">Success</span></>}
              {report.lastRunStatus === 'FAILED' && <><span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span><span className="text-xs text-[#DC2626] font-medium">Failed</span></>}
              {report.lastRunStatus === 'PENDING' && <><span className="w-1.5 h-1.5 rounded-full bg-[#D97706] animate-pulse"></span><span className="text-xs text-[#D97706] font-medium">Pending</span></>}
            </div>
          )}
        </td>

        <td className="px-4 py-4 whitespace-nowrap" onClick={onToggle}>
          {report.lastRunStatus === 'SUCCESS' ? (
            <>
              <div className="text-xs text-[#64748B]">{report.lastRunRecords.toLocaleString()} records</div>
              <div className="text-xs text-[#64748B] mt-0.5">{report.lastRunFileSize}</div>
            </>
          ) : report.lastRunStatus === 'FAILED' ? (
            <div className="text-xs text-[#DC2626] font-medium mt-1">Run failed</div>
          ) : (
            <div className="text-xs text-[#94A3B8]">—</div>
          )}
        </td>

        <td className="px-4 py-4 whitespace-nowrap" onClick={onToggle}>
          <span className="text-sm text-[#64748B]">{report.createdBy}</span>
        </td>

        <td className="px-4 py-4 whitespace-nowrap text-right">
          <div className="flex items-center justify-end gap-1 relative" onClick={(e) => e.stopPropagation()}>
            <button className="p-1.5 text-[#16A34A] hover:bg-[#DCFCE7] rounded transition-colors" title="Run report now">
              <Play size={16} />
            </button>
            <button className="p-1.5 text-[#64748B] hover:bg-[#F1F5F9] rounded transition-colors" title="Edit schedule">
              <Clock size={16} />
            </button>
            <button className="p-1.5 text-[#64748B] hover:bg-[#F1F5F9] rounded transition-colors" title="View run history">
              <History size={16} />
            </button>
            <div className="relative">
              <button 
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                className="p-1.5 text-[#2563EB] hover:bg-[#EFF6FF] rounded transition-colors" 
                title="Download latest"
              >
                <Download size={16} />
              </button>
              <AnimatePresence>
                {showDownloadMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                    className="absolute right-0 top-full mt-1 w-32 bg-white border border-[#E2E8F0] shadow-lg rounded-lg py-1 z-50"
                  >
                    {report.outputFormats.map(fmt => (
                      <button key={fmt} className="w-full text-left px-3 py-1.5 text-xs text-[#0F172A] hover:bg-[#F8FAFC] flex justify-between">
                        {fmt} <span className="text-[#64748B]">{report.lastRunFileSize}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button className="p-1.5 text-[#64748B] hover:bg-[#F1F5F9] rounded transition-colors" title="More options">
              <MoreVertical size={16} />
            </button>
          </div>
        </td>
      </tr>
      <AnimatePresence>
        {isExpanded && (
          <tr>
            <td colSpan="8" className="p-0 border-b border-[#E2E8F0]">
              <ExpandedReportPanel report={report} />
            </td>
          </tr>
        )}
      </AnimatePresence>
    </>
  );
};

const ScheduledDrawer = ({ show, onClose, reports }) => {
  const scheduledReports = reports.filter(r => ['Daily', 'Weekly', 'Monthly'].includes(r.schedule));
  const groups = {
    Daily: scheduledReports.filter(r => r.schedule === 'Daily'),
    Weekly: scheduledReports.filter(r => r.schedule === 'Weekly'),
    Monthly: scheduledReports.filter(r => r.schedule === 'Monthly'),
  };

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-[60]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ x: 420 }} animate={{ x: 0 }} exit={{ x: 420 }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
            className="fixed inset-y-0 right-0 w-[420px] bg-white border-l border-[#E2E8F0] shadow-2xl z-[70] flex flex-col font-sans"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E2E8F0]">
              <h2 className="text-lg font-semibold text-[#0F172A]">Scheduled Reports</h2>
              <button onClick={onClose} className="text-[#64748B] hover:text-[#0F172A] transition-colors"><X size={20} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {Object.entries(groups).map(([schedule, list]) => list.length > 0 && (
                <div key={schedule}>
                  <h3 className="text-sm font-semibold text-[#0F172A] mb-3 bg-[#F8FAFC] px-3 py-1.5 rounded">{schedule} Reports ({list.length})</h3>
                  <div className="space-y-3">
                    {list.map(r => (
                      <div key={r.id} className="border border-[#E2E8F0] rounded-lg p-3 flex items-start justify-between hover:border-[#CBD5E1] transition-colors group">
                        <div>
                          <p className="text-sm font-medium text-[#0F172A]">{r.name}</p>
                          <p className="text-xs text-[#64748B] mt-1">Next run: <span className="text-[#0F172A]">Today at 10:00 PM</span></p>
                          <div className="flex items-center gap-1.5 mt-2">
                            {r.lastRunStatus === 'SUCCESS' && <><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span><span className="text-[10px] uppercase font-bold text-[#16A34A]">Success</span></>}
                            {r.lastRunStatus === 'FAILED' && <><span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span><span className="text-[10px] uppercase font-bold text-[#DC2626]">Failed</span></>}
                          </div>
                        </div>
                        <button className="text-[#64748B] opacity-0 group-hover:opacity-100 hover:text-[#2563EB] transition-all p-1">
                          <Pencil size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-[#E2E8F0]">
              <button className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                <Plus size={16} /> Add Schedule
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const Pagination = ({ current, total, rowsPerPage, setRowsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(total / rowsPerPage);
  
  return (
    <div className="bg-white border-t border-[#E2E8F0] px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="text-sm text-[#64748B]">
        Showing <span className="font-medium text-[#0F172A]">{(current - 1) * rowsPerPage + 1}</span> to <span className="font-medium text-[#0F172A]">{Math.min(current * rowsPerPage, total)}</span> of <span className="font-medium text-[#0F172A]">{total}</span> reports
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex gap-1">
          {Array.from({ length: Math.min(3, totalPages) }, (_, i) => i + 1).map(p => (
            <button
              key={p} onClick={() => onPageChange(p)}
              className={`w-8 h-8 flex items-center justify-center rounded text-sm font-medium transition-colors ${current === p ? 'bg-[#2563EB] text-white' : 'text-[#64748B] hover:bg-[#F1F5F9]'}`}
            >
              {p}
            </button>
          ))}
          {totalPages > 3 && <span className="w-8 h-8 flex items-center justify-center text-[#64748B]">...</span>}
        </div>

        <div className="flex items-center gap-3 border-l border-[#E2E8F0] pl-4">
          <select 
            value={rowsPerPage} onChange={e => setRowsPerPage(Number(e.target.value))}
            className="border border-[#E2E8F0] rounded py-1 px-2 text-sm text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => onPageChange(Math.max(1, current - 1))} disabled={current === 1}
              className="p-1.5 rounded border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            ><ChevronLeft size={16} /></button>
            <button 
              onClick={() => onPageChange(Math.min(totalPages, current + 1))} disabled={current === totalPages}
              className="p-1.5 rounded border border-[#E2E8F0] text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            ><ChevronRight size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
export default function AdminReports() {
  const navigate = useNavigate();
  const [reports] = useState(mockReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "all", schedule: "all", lastRunStatus: "all",
    createdBy: "all", dataRange: "all"
  });
  const [selectedRows, setSelectedRows] = useState([]);
  const [expandedRow, setExpandedRow] = useState(null);
  const [showDrawer, setShowDrawer] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Computed filtering
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      const sq = searchQuery.toLowerCase();
      const matchesSearch = !sq || 
        r.name.toLowerCase().includes(sq) ||
        r.description.toLowerCase().includes(sq) ||
        r.category.toLowerCase().includes(sq) ||
        r.createdBy.toLowerCase().includes(sq);
      
      if (!matchesSearch) return false;

      // Group schedules for "Scheduled" vs "Manual" filter if needed from stats bar
      if (filters.schedule === 'Scheduled' && !['Daily', 'Weekly', 'Monthly'].includes(r.schedule)) return false;
      else if (filters.schedule !== 'all' && filters.schedule !== 'Scheduled' && r.schedule !== filters.schedule) return false;

      if (filters.category !== 'all' && r.category !== filters.category) return false;
      if (filters.lastRunStatus !== 'all' && r.lastRunStatus !== filters.lastRunStatus) return false;
      if (filters.createdBy !== 'all' && r.createdBy !== filters.createdBy) return false;
      
      return true;
    });
  }, [reports, searchQuery, filters]);

  const activeCount = Object.values(filters).filter(v => v !== 'all' && v !== '').length;

  const handleClearFilters = () => {
    setFilters({ category: "all", schedule: "all", lastRunStatus: "all", createdBy: "all", dataRange: "all" });
    setSearchQuery("");
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) setSelectedRows(paginatedReports.map(r => r.id));
    else setSelectedRows([]);
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    else setSelectedRows([...selectedRows, id]);
  };

  const handleToggleRow = (id) => {
    setExpandedRow(prev => prev === id ? null : id);
  };

  // Pagination slice
  const paginatedReports = filteredReports.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  // Stats
  const total = reports.length;
  const scheduledCount = reports.filter(r => ['Daily', 'Weekly', 'Monthly'].includes(r.schedule)).length;
  const manualCount = reports.filter(r => r.schedule === 'Manual' || r.schedule === 'On-Demand').length;
  const failedRuns = reports.filter(r => r.lastRunStatus === 'FAILED').length;
  const pendingRuns = reports.filter(r => r.lastRunStatus === 'PENDING').length;

  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] w-full flex flex-col h-full gap-6 pb-12">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A]">Reports</h1>
            <p className="text-sm text-[#64748B] mt-1">Generate, schedule, and export administrative data reports.</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowDrawer(true)}
              className="border border-[#E2E8F0] text-[#0F172A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#F8FAFC] transition-colors flex items-center gap-2"
            >
              <Clock size={16} /> Scheduled Reports
            </button>
            <button 
              onClick={() => navigate('/admin/reports/new')}
              className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Plus size={16} /> Create Custom Report
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <StatsBar 
          total={total} scheduled={scheduledCount} manual={manualCount} 
          failed={failedRuns} pending={pendingRuns}
          setFilterStatus={(res) => setFilters({...filters, lastRunStatus: res})}
          setFilterSchedule={(sch) => setFilters({...filters, schedule: sch})}
        />

        {/* Filter Bar */}
        <FilterBar 
          searchQuery={searchQuery} setSearchQuery={setSearchQuery}
          filters={filters} setFilters={setFilters}
          activeCount={activeCount} onClear={handleClearFilters}
        />

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedRows.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
              className="bg-[#EFF6FF] border border-[#2563EB] rounded-lg p-3 flex items-center justify-between shadow-sm sticky top-0 z-10"
            >
              <span className="text-sm font-medium text-[#1E3A8A]">
                {selectedRows.length} report(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button className="text-sm font-medium text-[#2563EB] bg-white border border-[#BFDBFE] hover:bg-[#DBEAFE] px-3 py-1.5 rounded transition-colors flex items-center gap-1.5"><Play size={14}/> Run All</button>
                <button className="text-sm font-medium text-[#475569] bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] px-3 py-1.5 rounded transition-colors flex items-center gap-1.5"><Download size={14}/> Export All</button>
                <button className="text-sm font-medium text-[#DC2626] bg-white border border-[#FECACA] hover:bg-[#FEE2E2] px-3 py-1.5 rounded transition-colors">Delete</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table Container */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
          <div className="overflow-x-auto w-full custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse min-w-[1100px]">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                  <th className="w-12 px-4 py-3 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedRows.length === paginatedReports.length && paginatedReports.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer" 
                    />
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Report Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Schedule</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Last Run</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Last Run Stats</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Created By</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedReports.length > 0 ? (
                  paginatedReports.map((report) => (
                    <ReportRow 
                      key={report.id} report={report} 
                      isSelected={selectedRows.includes(report.id)}
                      onSelect={() => handleSelectRow(report.id)}
                      isExpanded={expandedRow === report.id}
                      onToggle={() => handleToggleRow(report.id)}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="py-24">
                      <div className="flex flex-col items-center justify-center text-center">
                        <SearchX size={48} className="text-[#CBD5E1] mb-4" />
                        <h3 className="text-lg font-medium text-[#0F172A] mb-1">No reports found</h3>
                        <p className="text-sm text-[#64748B] mb-4">Try adjusting your filters or search query.</p>
                        {activeCount > 0 && (
                          <button onClick={handleClearFilters} className="text-sm font-medium text-[#2563EB] hover:underline">
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
          {filteredReports.length > 0 && (
            <Pagination 
              current={currentPage} total={filteredReports.length} 
              rowsPerPage={rowsPerPage} setRowsPerPage={setRowsPerPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

      </div>

      <ScheduledDrawer show={showDrawer} onClose={() => setShowDrawer(false)} reports={reports} />
    </PageWrapper>
  );
}
