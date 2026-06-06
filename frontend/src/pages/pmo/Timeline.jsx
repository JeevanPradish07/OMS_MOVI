import { useEffect, useState } from 'react';
import { milestonesAPI, projectsAPI } from '../../api';
import PageWrapper from '../../components/PageWrapper';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function PMOTimeline() {
  const [milestones, setMilestones] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', project: '', dueDate: '', status: 'pending' });

  useEffect(() => {
    Promise.all([milestonesAPI.getAll(), projectsAPI.getAll()])
      .then(([m, p]) => { setMilestones(m.data.data); setProjects(p.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await milestonesAPI.create(form);
      setMilestones(p => [res.data.data, ...p]);
      setModal(false);
      toast.success('Milestone created');
    } catch { toast.error('Failed to create milestone'); }
  };

  const updateStatus = async (id, status) => {
    const res = await milestonesAPI.update(id, { status });
    setMilestones(p => p.map(m => m._id === id ? res.data.data : m));
    toast.success('Updated');
  };

  const deleteMilestone = async (id) => {
    if (!confirm('Delete this milestone?')) return;
    await milestonesAPI.delete(id);
    setMilestones(p => p.filter(m => m._id !== id));
    toast.success('Milestone deleted');
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline font-bold text-2xl text-slate-900">Timeline & Milestones</h1>
            <p className="text-slate-500 text-sm mt-1">Track project milestones and deadlines</p>
          </div>
          <button onClick={() => setModal(true)} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">add</span> Add Milestone
          </button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="space-y-4">
            {milestones.map(m => (
              <div key={m._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${m.status === 'completed' ? 'bg-emerald-500' : m.status === 'in_progress' ? 'bg-blue-500' : 'bg-slate-300'}`} />
                  <div>
                    <h3 className="font-bold text-slate-900">{m.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">{m.project?.name} · Due: {m.dueDate ? format(new Date(m.dueDate), 'MMM d, yyyy') : 'No date'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={m.status} />
                  <select
                    className="text-xs border border-slate-200 rounded-xl px-3 py-1.5 bg-white outline-none font-medium"
                    value={m.status}
                    onChange={e => updateStatus(m._id, e.target.value)}
                  >
                    {['pending', 'in_progress', 'completed'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                  </select>
                  <button onClick={() => deleteMilestone(m._id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </div>
              </div>
            ))}
            {milestones.length === 0 && <p className="text-slate-400 text-sm text-center py-12">No milestones yet.</p>}
          </div>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Add Milestone">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Title</label>
            <input className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Project</label>
            <select className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.project} onChange={e => setForm(p => ({ ...p, project: e.target.value }))} required>
              <option value="">Select project...</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Due Date</label>
            <input type="date" className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.dueDate} onChange={e => setForm(p => ({ ...p, dueDate: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Description</label>
            <textarea className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none resize-none" rows={2} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <button type="submit" className="w-full btn-primary py-3 text-sm">Add Milestone</button>
        </form>
      </Modal>
    </PageWrapper>
  );
}
