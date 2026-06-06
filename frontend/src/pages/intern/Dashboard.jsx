import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { tasksAPI, statusAPI, announcementsAPI } from '../../api';
import PageWrapper from '../../components/PageWrapper';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import CalendarWidget from '../../components/CalendarWidget';
import { format } from 'date-fns';

export default function InternDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [t, s, a] = await Promise.all([
          tasksAPI.getAll(),
          statusAPI.getAll(),
          announcementsAPI.getAll()
        ]);
        setTasks(t.data.data);
        setUpdates(s.data.data);
        setAnnouncements(a.data.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const stats = {
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    dueToday: tasks.filter(
      t =>
        t.dueDate &&
        format(new Date(t.dueDate), 'yyyy-MM-dd') ===
          format(new Date(), 'yyyy-MM-dd')
    ).length,
    overdue: tasks.filter(t => t.status === 'overdue').length,
    completed: tasks.filter(t => t.status === 'done').length
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  return (
    <PageWrapper>
      {loading ? (
        <LoadingSpinner text="Loading dashboard..." />
      ) : (
        <div className="max-w-[1600px] mx-auto space-y-8 animate-in fade-in duration-500 pb-12">
          
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-headline font-bold text-3xl text-slate-900 tracking-tight">
                {greeting}, {user?.name?.split(' ')[0]}!
              </h1>
              <p className="text-slate-500 text-sm mt-1 font-medium">
                Here's what's happening with your internship today.
              </p>
            </div>
            <button
              onClick={() => navigate('/intern/tasks')}
              className="btn-primary px-6 py-3 text-sm font-bold flex items-center gap-2 rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all inline-flex w-fit"
            >
              <span className="material-symbols-outlined text-base">assignment</span>
              Manage My Tasks
            </button>
          </div>

          {/* TOP SECTION: Stats cards (4) - Full width grid */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: 'In Progress', count: stats.inProgress, icon: 'pending_actions', color: 'blue' },
              { label: 'Due Today', count: stats.dueToday, icon: 'event', color: 'amber' },
              { label: 'Overdue', count: stats.overdue, icon: 'warning', color: 'rose' },
              { label: 'Completed', count: stats.completed, icon: 'check_circle', color: 'emerald' }
            ].map(item => (
              <div key={item.label} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-${item.color}-50 text-${item.color}-500 flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <span className="material-symbols-outlined text-2xl">{item.icon}</span>
                  </div>
                  <div>
                    <p className="text-2xl font-black text-slate-900 leading-none">{item.count}</p>
                    <p className="text-[10px] uppercase tracking-widest font-black text-slate-400 mt-1">{item.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* MIDDLE SECTION: 2-column layout (50/50) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* LEFT: Calendar */}
            <div className="h-full">
              <CalendarWidget tasks={tasks} />
            </div>

            {/* RIGHT: Recent Activity table */}
            <section className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="p-6 border-b border-slate-50 flex items-center justify-between">
                <h2 className="font-headline font-bold text-lg text-slate-900">Recent Activity</h2>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Recent Tasks</span>
              </div>

              <div className="flex-1 overflow-x-auto">
                {tasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <span className="material-symbols-outlined text-slate-200 text-4xl mb-2">inventory_2</span>
                    <p className="text-sm font-medium text-slate-400">No recent tasks found</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/50">
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Task Details</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Due</th>
                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {tasks.slice(0, 5).map(task => (
                        <tr key={task._id} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-slate-800 group-hover:text-primary transition-colors">{task.title}</span>
                              <span className="text-[10px] text-slate-400 font-medium capitalize">{task.type}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-xs font-semibold text-slate-600">
                              {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : 'No date'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={task.status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              
              <div className="p-4 border-t border-slate-50 bg-slate-50/30 text-center">
                <button onClick={() => navigate('/intern/tasks')} className="text-xs font-bold text-primary hover:underline">View All Task Activity</button>
              </div>
            </section>
          </div>

          {/* BOTTOM SECTION: Announcements (full width) */}
          <section className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                  <span className="material-symbols-outlined">campaign</span>
                </div>
                <div>
                  <h2 className="font-headline font-bold text-xl text-slate-900">Company Updates</h2>
                  <p className="text-xs text-slate-400 font-medium">Stay informed with the latest news from OWMS</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[500px] overflow-y-auto custom-scrollbar pr-2 pt-2">
              {announcements.length === 0 ? (
                <div className="col-span-full py-12 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <p className="text-sm font-bold text-slate-300 uppercase tracking-widest text-center">No active announcements</p>
                </div>
              ) : (
                announcements.map(a => (
                  <div key={a._id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="material-symbols-outlined text-4xl">announcement</span>
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-300 mb-2">
                      {format(new Date(a.createdAt), 'MMM d, yyyy')}
                    </p>
                    <h3 className="font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors line-clamp-1">{a.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{a.content}</p>
                    <div className="mt-6 flex justify-end">
                       <span className="material-symbols-outlined text-slate-300 group-hover:text-primary transition-colors">arrow_right_alt</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

        </div>
      )}
    </PageWrapper>
  );
}