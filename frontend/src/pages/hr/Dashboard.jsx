import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersAPI, tasksAPI, attendanceAPI } from '../../api';
import PageWrapper from '../../components/PageWrapper';
import LoadingSpinner from '../../components/LoadingSpinner';
import InternDetailModal from '../../components/InternDetailModal';

export default function HRDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ interns: 0, tasks: 0, present: 0, onLeave: 0 });
  const [recentInterns, setRecentInterns] = useState([]);
  const [stipendDueUsers, setStipendDueUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openInternDetails = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const load = async () => {
      const [users, tasks, att, stipend] = await Promise.all([
        usersAPI.getAll({ role: 'intern' }),
        tasksAPI.getAll(),
        attendanceAPI.getAll(),
        usersAPI.getStipendDue(),
      ]);
      const interns = users.data.data;
      const today = new Date().toISOString().split('T')[0];
      setStats({
        interns: interns.length,
        tasks: tasks.data.data.length,
        present: att.data.data.filter(a => a.status === 'present' && new Date(a.date).toISOString().split('T')[0] === today).length,
        onLeave: att.data.data.filter(a => a.status === 'leave').length,
      });
      setRecentInterns(interns.slice(0, 5));
      setStipendDueUsers(stipend.data.data || []);
      setLoading(false);
    };
    load().catch(() => setLoading(false));
  }, []);

  const StatCard = ({ icon, label, value, color }) => (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
      </div>
      <p className="text-2xl font-black mb-1">{value}</p>
      <p className="text-xs text-slate-500 font-medium">{label}</p>
    </div>
  );

  return (
    <PageWrapper>
      {loading ? <LoadingSpinner text="Loading HR dashboard..." /> : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div>
            <h1 className="font-headline font-bold text-2xl text-slate-900">HR Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Overview of team and operations</p>
          </div>

          {/* Stipend Notification Alert */}
          {stipendDueUsers.length > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center animate-in slide-in-from-top-4 duration-500">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">payments</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-amber-900 leading-tight">Stipend allocation due for {stipendDueUsers.length} intern{stipendDueUsers.length > 1 ? 's' : ''}</h3>
                <p className="text-xs text-amber-700/70 mt-0.5 font-medium">These interns have completed 4 months and are eligible for stipend processing.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stipendDueUsers.map(u => (
                    <button 
                      key={u._id} 
                      onClick={() => openInternDetails(u._id)}
                      className="bg-white/60 hover:bg-white border border-amber-200/50 py-1.5 px-3 rounded-full text-[10px] font-bold text-amber-800 transition-colors flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      {u.name}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => navigate('/hr/onboarding')} 
                className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg shadow-amber-600/20 transition-all shrink-0"
              >
                Process All
              </button>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon="groups" label="Total Interns" value={stats.interns} color="bg-blue-100 text-blue-600" />
            <StatCard icon="task_alt" label="Active Tasks" value={stats.tasks} color="bg-emerald-100 text-emerald-600" />
            <StatCard icon="event_available" label="Present Today" value={stats.present} color="bg-teal-100 text-teal-600" />
            <StatCard icon="beach_access" label="On Leave" value={stats.onLeave} color="bg-amber-100 text-amber-600" />
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-800">Recent Interns</h2>
              <span className="text-[10px] font-black uppercase text-slate-400">Click row for details</span>
            </div>
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3 text-left">Name</th><th className="px-6 py-3 text-left">Email</th><th className="px-6 py-3 text-left">College</th><th className="px-6 py-3 text-left">Joined</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {recentInterns.map(u => (
                  <tr 
                    key={u._id} 
                    className="hover:bg-slate-50/50 cursor-pointer transition-colors"
                    onClick={() => openInternDetails(u._id)}
                  >
                    <td className="px-6 py-4 font-semibold text-primary">{u.name}</td>
                    <td className="px-6 py-4 text-slate-500">{u.email}</td>
                    <td className="px-6 py-4 text-slate-500">{u.college || '—'}</td>
                    <td className="px-6 py-4 text-slate-500">{u.joiningDate ? new Date(u.joiningDate).toLocaleDateString() : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <InternDetailModal 
            internId={selectedId} 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
          />
        </div>
      )}
    </PageWrapper>
  );
}
