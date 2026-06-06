import { NavLink } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Grid2X2, CheckSquare } from 'lucide-react';

const NAV_CONFIG = {
  intern: [
    { to: '/intern/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/intern/tasks', icon: 'assignment', label: 'My Tasks' },
    { to: '/intern/status', icon: 'update', label: 'Status Updates' },
    { to: '/intern/learning', icon: 'school', label: 'Learning Resources' },
    { to: '/intern/messages', icon: 'forum', label: 'Messages' },
    { to: '/intern/performance', icon: 'grade', label: 'Performance' },
    { to: '/intern/payments', icon: 'payments', label: 'Payments' },
  ],
  hr: [
    { to: '/hr/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/hr/employees', icon: 'badge', label: 'Employees' },
    { to: '/hr/interns', icon: 'school', label: 'Interns' },
    { to: '/hr/onboarding', icon: 'person_add', label: 'Onboarding' },
    { to: '/hr/attendance', icon: 'event_available', label: 'Attendance' },
    { to: '/hr/performance', icon: 'grade', label: 'Performance' },
    { to: '/hr/tasks', icon: 'view_kanban', label: 'Task Board' },
    { to: '/hr/tasks/new', icon: CheckSquare, label: 'Assign Task', isLucide: true },
  ],
  pmo: [
    { to: '/pmo/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/pmo/projects', icon: 'work', label: 'Projects' },
    { to: '/pmo/tasks', icon: 'task_alt', label: 'Task Assignment' },
    { to: '/pmo/monitoring', icon: 'monitoring', label: 'Monitoring' },
    { to: '/pmo/timeline', icon: 'timeline', label: 'Timeline' },
    { to: '/pmo/approvals', icon: 'approval', label: 'Approvals' },
  ],
  admin: [
    { to: '/admin/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/admin/users', icon: 'group', label: 'Users' },
    { to: '/admin/departments', icon: 'domain', label: 'Departments' },
    { to: '/admin/roles', icon: 'badge', label: 'Roles' },
    { to: '/admin/permissions', icon: Shield, label: 'Permissions', isLucide: true },
    { to: '/admin/access-matrix', icon: Grid2X2, label: 'Access Matrix', isLucide: true },
    { to: '/admin/audit', icon: 'history', label: 'Audit Logs' },
    { to: '/admin/reports', icon: 'analytics', label: 'Reports' },
    { to: '/admin/settings', icon: 'settings', label: 'Settings' },
  ],
};

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user } = useAuth();
  const links = NAV_CONFIG[user?.role] || [];

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 bg-[#F8FAFC] border-r border-[#E2E8F0] transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-[260px]'} hidden lg:flex font-sans`}>
      
      {/* Spacer for Header */}
      <div className="h-16 flex-shrink-0" />

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-[#E2E8F0] rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:border-blue-600 shadow-sm z-50 transition-colors"
      >
        <span className="material-symbols-outlined text-[14px]">{collapsed ? 'chevron_right' : 'chevron_left'}</span>
      </button>

      {/* Nav links */}
      <nav className={`flex-1 py-6 space-y-1 overflow-y-auto custom-scrollbar ${collapsed ? 'px-3' : 'px-4'}`}>
        {links.map(({ to, icon, label, isLucide }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : ''}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-[#E2E8F0] text-[#0F172A] font-medium' 
                  : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              } ${collapsed ? 'justify-center px-0 py-3' : ''}`
            }
          >
            {isLucide ? (
              <span className="flex-shrink-0 flex items-center justify-center w-[20px]">
                {(() => {
                  const Icon = icon;
                  return <Icon size={20} />;
                })()}
              </span>
            ) : (
              <span className="material-symbols-outlined text-[20px] flex-shrink-0">{icon}</span>
            )}
            {!collapsed && <span className="text-[13px] whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
