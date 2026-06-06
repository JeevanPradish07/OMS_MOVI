import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const NAV_CONFIG = {
  intern: [
    { to: '/intern/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/intern/tasks', icon: 'assignment', label: 'My Tasks' },
    { to: '/intern/status', icon: 'update', label: 'Status Updates' },
    { to: '/intern/learning', icon: 'school', label: 'Learning Resources' },
    { to: '/intern/messages', icon: 'forum', label: 'Messages' },
    { to: '/intern/performance', icon: 'grade', label: 'Performance' },
    { to: '/intern/payments', icon: 'payments', label: 'Payments' },
    { to: '/intern/documents', icon: 'folder_open', label: 'Documents' },
  ],
  hr: [
    { to: '/hr/dashboard', icon: 'dashboard', label: 'Dashboard' },
    { to: '/hr/onboarding', icon: 'person_add', label: 'Onboarding' },
    { to: '/hr/attendance', icon: 'event_available', label: 'Attendance' },
    { to: '/hr/documents', icon: 'folder_open', label: 'Documents' },
    { to: '/hr/performance', icon: 'grade', label: 'Performance' },
    { to: '/hr/communication', icon: 'campaign', label: 'Announcements' },
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
    { to: '/admin/users', icon: 'manage_accounts', label: 'User Management' },
    { to: '/admin/reports', icon: 'analytics', label: 'Reports' },
    { to: '/admin/payments', icon: 'payments', label: 'Payments' },
    { to: '/admin/access', icon: 'admin_panel_settings', label: 'Access Control' },
    { to: '/admin/config', icon: 'settings', label: 'System Config' },
  ],
};

export default function Sidebar({ collapsed, setCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const links = NAV_CONFIG[user?.role] || [];

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <aside className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-100 shadow-[20px_0_40px_rgba(0,0,0,0.02)] transition-all duration-300 flex flex-col ${collapsed ? 'w-20' : 'w-72'} hidden lg:flex`}>
      {/* Logo */}
      <div className={`px-6 pt-8 pb-6 flex items-center gap-3 border-b border-slate-50 transition-all ${collapsed ? 'justify-center' : 'flex-col text-center justify-center'}`}>
        <img src="/assets/logo.png" alt="Movi Cloud Labs" className={`auto object-contain transition-all ${collapsed ? 'h-8' : 'h-20'}`} />
        {!collapsed && <span className="font-headline font-bold text-xl text-black tracking-tight whitespace-nowrap">Movi Cloud Labs</span>}
      </div>

      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3.5 top-10 w-7 h-7 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary shadow-sm z-50 transition-colors"
      >
        <span className="material-symbols-outlined text-[15px]">{collapsed ? 'chevron_right' : 'chevron_left'}</span>
      </button>

      {/* Nav links */}
      <nav className={`flex-1 ${collapsed ? 'px-2' : 'px-4'} py-4 space-y-1 overflow-y-auto custom-scrollbar`}>
        {links.map(({ to, icon, label }) => (
          <NavLink
            key={to}
            to={to}
            title={collapsed ? label : ''}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-0' : ''}`
            }
          >
            <span className="material-symbols-outlined text-xl flex-shrink-0">{icon}</span>
            {!collapsed && <span className="font-semibold text-sm whitespace-nowrap">{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div className={`px-4 py-4 border-t border-slate-50 ${collapsed ? 'px-2' : ''}`}>
        <button
          onClick={handleLogout}
          title={collapsed ? "Sign Out" : ""}
          className={`nav-link w-full text-red-500 hover:bg-red-50 hover:text-red-600 ${collapsed ? 'justify-center px-0' : ''}`}
        >
          <span className="material-symbols-outlined text-xl flex-shrink-0">logout</span>
          {!collapsed && <span className="font-bold text-sm whitespace-nowrap">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
