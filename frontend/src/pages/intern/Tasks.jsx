import { useEffect, useState } from 'react';
import { tasksAPI } from '../../api';
import PageWrapper from '../../components/PageWrapper';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

const STATUSES = ['pending', 'in_progress', 'review', 'done'];

export default function InternTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await tasksAPI.getAll();
      setTasks(res.data.data);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await tasksAPI.updateStatus(id, status);
      setTasks(prev => prev.map(t => t._id === id ? { ...t, status } : t));
      toast.success('Task status updated');
    } catch {
      toast.error('Failed to update status');
    }
  };

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) || t.type.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || t.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="font-headline font-bold text-2xl text-slate-900">My Tasks</h1>
          <p className="text-slate-500 text-sm mt-1">View and update your assigned tasks</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg">search</span>
            <input
              className="w-full bg-white border border-slate-200 rounded-2xl py-2.5 pl-10 pr-4 text-sm outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {['all', ...STATUSES].map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === s ? 'bg-primary text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-primary/30'}`}
              >
                {s === 'all' ? 'All' : s.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? <LoadingSpinner text="Loading tasks..." /> : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            {filtered.length === 0 ? (
              <p className="text-center text-slate-400 py-12 text-sm">No tasks found.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Task</th>
                    <th className="px-6 py-4">Project</th>
                    <th className="px-6 py-4">Priority</th>
                    <th className="px-6 py-4">Due Date</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Update</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {filtered.map(task => (
                    <tr key={task._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-semibold text-slate-900">{task.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{task.type}</p>
                      </td>
                      <td className="px-6 py-4 text-slate-500">{task.project?.name || '—'}</td>
                      <td className="px-6 py-4"><StatusBadge status={task.priority?.toLowerCase()} /></td>
                      <td className={`px-6 py-4 font-medium text-sm ${task.status === 'overdue' ? 'text-rose-500' : 'text-slate-500'}`}>
                        {task.dueDate ? format(new Date(task.dueDate), 'MMM d, yyyy') : '—'}
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                      <td className="px-6 py-4">
                        <select
                          className="text-xs border border-slate-200 rounded-xl px-3 py-2 bg-white focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                          value={task.status}
                          onChange={e => updateStatus(task._id, e.target.value)}
                          disabled={task.status === 'done'}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
