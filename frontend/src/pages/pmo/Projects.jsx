import { useEffect, useState } from 'react';
import { projectsAPI, usersAPI } from '../../api';
import PageWrapper from '../../components/PageWrapper';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import ProjectDetailModal from '../../components/ProjectDetailModal';
import toast from 'react-hot-toast';

export default function PMOProjects() {
  const [projects, setProjects] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: '', code: '', description: '', endDate: '', teamMembers: [] });
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    Promise.all([projectsAPI.getAll(), usersAPI.getAll({ role: 'intern' })])
      .then(([p, u]) => { setProjects(p.data.data); setInterns(u.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await projectsAPI.create(form);
      setProjects(p => [res.data.data, ...p]);
      setModal(false);
      toast.success('Project created');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create project'); }
  };

  const toggleMember = (id) => {
    setForm(p => ({ ...p, teamMembers: p.teamMembers.includes(id) ? p.teamMembers.filter(m => m !== id) : [...p.teamMembers, id] }));
  };

  const openProjectDetails = (id) => {
    setSelectedProjectId(id);
    setIsDetailOpen(true);
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline font-bold text-2xl text-slate-900">Projects</h1>
            <p className="text-slate-500 text-sm mt-1">Create and manage projects</p>
          </div>
          <button onClick={() => setModal(true)} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">add</span> New Project
          </button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {projects.map(p => (
              <div 
                key={p._id} 
                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition-all cursor-pointer group"
                onClick={() => openProjectDetails(p._id)}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] font-black text-slate-400 font-mono uppercase tracking-tighter bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100 ring-4 ring-white">#{p.code}</span>
                    <h3 className="font-headline font-bold text-slate-900 mt-2 group-hover:text-primary transition-colors">{p.name}</h3>
                  </div>
                  <StatusBadge status={p.health} />
                </div>
                <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-2">{p.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex -space-x-2">
                    {/* Compatibility for both team and teamMembers structures */}
                    {(p.team || p.teamMembers || []).slice(0, 4).map((m, i) => (
                      <div key={i} className="w-7 h-7 rounded-full bg-primary/10 border-2 border-white flex items-center justify-center text-[10px] font-bold text-primary overflow-hidden">
                        {(m.user ? m.user.name?.[0] : m.name?.[0]) || '?'}
                      </div>
                    ))}
                    {(p.team || p.teamMembers || []).length > 4 && (
                      <div className="w-7 h-7 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[8px] font-black text-slate-400">
                        +{(p.team || p.teamMembers || []).length - 4}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={p.status} />
                    <span className="material-symbols-outlined text-slate-300 text-sm group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
                  </div>
                </div>
              </div>
            ))}
            {projects.length === 0 && <p className="text-slate-400 col-span-3 text-center py-12 text-sm font-bold uppercase tracking-widest">No projects yet.</p>}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <ProjectDetailModal 
        projectId={selectedProjectId} 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
      />

      <Modal isOpen={modal} onClose={() => setModal(false)} title="Create New Project" size="lg">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Project Name</label>
              <input className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Project Code</label>
              <input className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none uppercase" value={form.code} onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="PRJ-001" required />
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Description</label>
            <textarea className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none resize-none" rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">End Date</label>
            <input type="date" className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-3">Team Members (v1 Migration Mode)</label>
            <div className="flex flex-wrap gap-2">
              {interns.map(i => (
                <button type="button" key={i._id} onClick={() => toggleMember(i._id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${form.teamMembers.includes(i._id) ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                  {i.name}
                </button>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full btn-primary py-3 text-sm uppercase font-black tracking-widest">Create Project</button>
        </form>
      </Modal>
    </PageWrapper>
  );
}
