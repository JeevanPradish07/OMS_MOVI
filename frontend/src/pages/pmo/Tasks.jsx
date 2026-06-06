import { useEffect, useState } from 'react';
import { tasksAPI, usersAPI, projectsAPI } from '../../api';
import PageWrapper from '../../components/PageWrapper';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function PMOTasks() {
  const [tasks, setTasks] = useState([]);
  const [interns, setInterns] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', type: 'Development', assignedTo: '', project: '', priority: 'Medium', dueDate: '' });

  useEffect(() => {
    Promise.all([tasksAPI.getAll(), usersAPI.getAll({ role: 'intern' }), projectsAPI.getAll()])
      .then(([t, u, p]) => { setTasks(t.data.data); setInterns(u.data.data); setProjects(p.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await tasksAPI.create(form);
      setTasks(p => [res.data.data, ...p]);
      setModal(false);
      toast.success('Task assigned');
    } catch { toast.error('Failed to create task'); }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline font-bold text-2xl text-slate-900">Task Assignment</h1>
            <p className="text-slate-500 text-sm mt-1">Assign and manage tasks for interns</p>
          </div>
          <button onClick={() => setModal(true)} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">add</span> Assign Task
          </button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Task</th><th className="px-6 py-4">Assigned To</th>
                <th className="px-6 py-4">Project</th><th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Due Date</th><th className="px-6 py-4">Status</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map(t => (
                  <tr key={t._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4"><p className="font-semibold text-slate-900">{t.title}</p><p className="text-xs text-slate-400">{t.type}</p></td>
                    <td className="px-6 py-4 text-slate-600">{t.assignedTo?.name || '—'}</td>
                    <td className="px-6 py-4 text-slate-500">{t.project?.name || '—'}</td>
                    <td className="px-6 py-4"><StatusBadge status={t.priority?.toLowerCase()} /></td>
                    <td className="px-6 py-4 text-slate-500">{t.dueDate ? format(new Date(t.dueDate), 'MMM d') : '—'}</td>
                    <td className="px-6 py-4"><StatusBadge status={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {tasks.length === 0 && <p className="text-center text-slate-400 py-12 text-sm">No tasks yet. Assign one!</p>}
          </div>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Assign New Task" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Task Title</label>
            <input className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Description</label>
            <textarea className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none resize-none" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Assign To</label>
              <select className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.assignedTo} onChange={e => setForm(p => ({ ...p, assignedTo: e.target.value }))} required>
                <option value="">Select intern...</option>
                {interns.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Project</label>
              <select className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.project} onChange={e => setForm(p => ({ ...p, project: e.target.value }))}>
                <option value="">No project</option>
                {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Type</label>
              <select className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                {['Development', 'Design', 'Research', 'QA', 'Admin', 'Other'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Priority</label>
              <select className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}>
                {['Low', 'Medium', 'High', 'Critical'].map(p => <option key={p}>{p}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Due Date</label>
              <input type="date" className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
            </div>
          </div>
          <button type="submit" className="w-full btn-primary py-3 text-sm">Assign Task</button>
        </form>
      </Modal>
    </PageWrapper>
  );
}
