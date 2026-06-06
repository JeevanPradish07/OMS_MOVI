import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { announcementsAPI } from '../api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function Header({ sidebarCollapsed }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [readIds, setReadIds] = useState(() => {
    try { return JSON.parse(localStorage.getItem('owms_read_notifs') || '[]'); } catch { return []; }
  });
  const popupRef = useRef();
  const notifRef = useRef();

  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
  const unreadCount = announcements.filter(a => !readIds.includes(a._id)).length;

  // Fetch announcements on mount and every 60s
  useEffect(() => {
    const fetchAnnouncements = () => {
      announcementsAPI.getAll()
        .then(r => setAnnouncements(r.data?.data || []))
        .catch(() => {});
    };
    fetchAnnouncements();
    const interval = setInterval(fetchAnnouncements, 60000);
    return () => clearInterval(interval);
  }, []);

  // Persist read state
  useEffect(() => {
    localStorage.setItem('owms_read_notifs', JSON.stringify(readIds));
  }, [readIds]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    window.addEventListener('mousedown', handleClick);
    return () => window.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const markAllRead = () => {
    setReadIds(announcements.map(a => a._id));
  };

  const handleNotifToggle = (e) => {
    e.stopPropagation();
    setNotifOpen(p => !p);
    setProfileOpen(false);
  };

  const handleProfileToggle = (e) => {
    e.stopPropagation();
    setProfileOpen(p => !p);
    setNotifOpen(false);
  };

  return (
    <header className={`fixed top-0 right-0 ${sidebarCollapsed ? 'left-20' : 'left-72'} h-16 flex justify-between items-center px-6 lg:px-8 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-sm font-body text-sm transition-all duration-300`}>
      {/* Search */}
      <div className="flex items-center flex-1 max-w-sm">
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
          <input
            className="w-full bg-slate-50 border border-transparent rounded-xl py-2 pl-9 pr-4 text-xs focus:ring-2 focus:ring-primary/20 focus:border-primary/30 transition-all outline-none"
            placeholder="Search tasks, projects..."
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && e.target.value) {
                toast('Search coming soon', { icon: '🔍' });
              }
            }}
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Notifications bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={handleNotifToggle}
            className="relative w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-all"
            title="Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center leading-none">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Notifications dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-12 w-80 bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 z-50 overflow-hidden transform opacity-100 scale-100 transition-all origin-top-right">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-white">
                <p className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  Notifications
                  {unreadCount > 0 && (
                    <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full">{unreadCount}</span>
                  )}
                </p>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors">
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto custom-scrollbar">
                {announcements.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center px-4">
                    <span className="material-symbols-outlined text-slate-200 text-4xl mb-2">notifications_off</span>
                    <p className="text-sm text-slate-400">No announcements yet</p>
                  </div>
                ) : (
                  announcements.slice(0, 10).map(ann => {
                    const isUnread = !readIds.includes(ann._id);
                    return (
                      <button
                        key={ann._id}
                        className={`w-full text-left px-5 py-4 hover:bg-slate-50 transition-all border-b border-slate-50 last:border-0 ${isUnread ? 'bg-indigo-50/40 relative' : ''}`}
                        onClick={() => setReadIds(prev => prev.includes(ann._id) ? prev : [...prev, ann._id])}
                      >
                        {isUnread && <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />}
                        <div className="flex items-start gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isUnread ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-400'}`}>
                            <span className="material-symbols-outlined text-sm">campaign</span>
                          </div>
                          <div className="flex-1">
                            <p className={`text-xs ${isUnread ? 'font-bold text-slate-900' : 'font-semibold text-slate-700'} line-clamp-1`}>{ann.title}</p>
                            <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{ann.content}</p>
                            <p className="text-[10px] text-slate-400 mt-2 font-medium flex items-center gap-1">
                              <span className="material-symbols-outlined text-[10px]">schedule</span>
                              {format(new Date(ann.createdAt), 'MMM d, h:mm a')}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* Profile */}
        <div className="relative" ref={popupRef}>
          <button
            className="flex items-center gap-2.5 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={handleProfileToggle}
          >
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 leading-tight">{user?.name}</p>
              <p className="text-[10px] text-slate-500 font-medium capitalize">{user?.role}</p>
            </div>
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold border border-primary/10 text-sm overflow-hidden">
              {user?.profileImage || user?.avatar ? (
                <img src={user.profileImage || user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
          </button>

          {/* Profile popup */}
          {profileOpen && (
            <div className="absolute right-0 top-12 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 overflow-hidden py-2">
              <div className="flex items-center gap-3 px-4 py-3 mb-1 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold overflow-hidden">
                  {user?.profileImage || user?.avatar ? (
                    <img src={user.profileImage || user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-slate-900 text-sm truncate">{user?.name}</p>
                  <span className={`badge badge-${user?.role} text-[10px]`}>{user?.role}</span>
                </div>
              </div>
              <button
                onClick={() => { navigate('/profile'); setProfileOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-slate-600 hover:bg-slate-50 text-sm font-medium transition-colors"
              >
                <span className="material-symbols-outlined text-base text-slate-400">manage_accounts</span>
                My Profile
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-red-500 hover:bg-red-50 text-sm font-semibold transition-colors"
              >
                <span className="material-symbols-outlined text-base">logout</span>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
