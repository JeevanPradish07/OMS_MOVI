import { useEffect, useState } from 'react';
import { projectsAPI, tasksAPI, usersAPI } from '../../api';
import PageWrapper from '../../components/PageWrapper';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

export default function PMODashboard() {
  const [stats, setStats] = useState({ projects: 0, tasks: 0, interns: 0, done: 0 });
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([projectsAPI.getAll(), tasksAPI.getAll(), usersAPI.getAll({ role: 'intern' })])
      .then(([p, t, u]) => {
        setProjects(p.data.data.slice(0, 4));
        setStats({
          projects: p.data.count,
          tasks: t.data.count,
          interns: u.data.count,
          done: t.data.data.filter(t => t.status === 'done').length,
        });
      }).finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper>
      {loading ? <LoadingSpinner text="Loading PMO dashboard..." /> : (
        <div className="space-y-8">
          <div>
            <h1 className="font-headline font-bold text-2xl text-slate-900">PMO Dashboard</h1>
            <p className="text-slate-500 text-sm mt-1">Project and task management overview</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Active Projects', value: stats.projects, icon: 'work', color: 'bg-blue-100 text-blue-600' },
              { label: 'Total Tasks', value: stats.tasks, icon: 'task_alt', color: 'bg-indigo-100 text-indigo-600' },
              { label: 'Team Interns', value: stats.interns, icon: 'groups', color: 'bg-teal-100 text-teal-600' },
              { label: 'Tasks Done', value: stats.done, icon: 'check_circle', color: 'bg-emerald-100 text-emerald-600' },
            ].map(({ label, value, icon, color }) => (
              <div key={label} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                </div>
                <p className="text-2xl font-black mb-1">{value}</p>
                <p className="text-xs text-slate-500 font-medium">{label}</p>
              </div>
            ))}
          </div>
          <div>
            <h2 className="font-bold text-slate-800 mb-4">Active Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.map(p => (
                <div key={p._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">#{p.code}</p>
                    </div>
                    <StatusBadge status={p.health} />
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">{p.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-400">{p.teamMembers?.length || 0} members</span>
                    <StatusBadge status={p.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
