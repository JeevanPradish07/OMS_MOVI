import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI, usersAPI } from '../../api';
import PageWrapper from '../../components/PageWrapper';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import InternDetailModal from '../../components/InternDetailModal';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(null);
  const [stipendDueUsers, setStipendDueUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openInternDetails = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  useEffect(() => {
    Promise.all([
      adminAPI.kpis(),
      usersAPI.getStipendDue()
    ]).then(([r1, r2]) => {
      setKpis(r1.data.data);
      setStipendDueUsers(r2.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper>
      {loading ? <LoadingSpinner text="Loading admin dashboard..." /> : (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div>
            <h1 className="font-headline font-bold text-2xl text-slate-900">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">System-wide overview and KPIs</p>
          </div>

          {/* Stipend Notification Alert */}
          {stipendDueUsers.length > 0 && (
            <div className="bg-rose-50 border border-rose-100 rounded-3xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center animate-in slide-in-from-top-4 duration-500 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-2xl">error_outline</span>
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-rose-900 leading-tight">Attention: Stipend allocation due for {stipendDueUsers.length} intern{stipendDueUsers.length > 1 ? 's' : ''}</h3>
                <p className="text-xs text-rose-700/70 mt-0.5 font-medium">Critical system notice: Milestone completion verified. Stipend disbursement required.</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {stipendDueUsers.map(u => (
                    <button 
                      key={u._id} 
                      onClick={() => openInternDetails(u._id)}
                      className="bg-white/80 hover:bg-white border border-rose-200/50 py-1.5 px-3 rounded-full text-[10px] font-bold text-rose-800 transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                      {u.name} — <span className="opacity-60">{u.project || 'No Project'}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button 
                onClick={() => navigate('/admin/users')} 
                className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black uppercase tracking-widest px-6 py-3 rounded-xl shadow-lg shadow-rose-600/20 transition-all shrink-0"
              >
                Review List
              </button>
            </div>
          )}

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Total Users', value: kpis?.totalUsers, icon: 'group', color: 'bg-blue-100 text-blue-600' },
              { label: 'Interns', value: kpis?.totalInterns, icon: 'school', color: 'bg-indigo-100 text-indigo-600' },
              { label: 'Active Tasks', value: kpis?.activeTasks, icon: 'task_alt', color: 'bg-emerald-100 text-emerald-600' },
              { label: 'Live Projects', value: kpis?.activeProjects, icon: 'work', color: 'bg-teal-100 text-teal-600' },
              { label: 'Present Today', value: kpis?.todayAttendance, icon: 'event_available', color: 'bg-amber-100 text-amber-600' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-3`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </div>
                <p className="text-2xl font-black">{value ?? '—'}</p>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Tasks by status */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">Tasks by Status</h3>
              <div className="space-y-3">
                {kpis?.tasksByStatus?.map(({ _id, count }) => (
                  <div key={_id} className="flex items-center justify-between">
                    <StatusBadge status={_id} />
                    <span className="font-bold text-slate-700 text-sm">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Users by role */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <h3 className="font-bold text-slate-900 mb-4">Users by Role</h3>
              <div className="space-y-3">
                {kpis?.usersByRole?.map(({ _id, count }) => (
                  <div key={_id} className="flex items-center justify-between">
                    <StatusBadge status={_id} />
                    <span className="font-bold text-slate-700 text-sm">{count} users</span>
                  </div>
                ))}
              </div>
            </div>
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
