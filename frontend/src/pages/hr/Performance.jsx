import { useEffect, useState } from 'react';
import { performanceAPI, usersAPI } from '../../api';
import PageWrapper from '../../components/PageWrapper';
import LoadingSpinner from '../../components/LoadingSpinner';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';

export default function HRPerformance() {
  const [records, setRecords] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ user: '', period: '', technicalScore: 7, communicationScore: 7, punctualityScore: 7, feedback: '', goals: '' });

  useEffect(() => {
    Promise.all([performanceAPI.getAll(), usersAPI.getAll({ role: 'intern' })])
      .then(([p, u]) => { setRecords(p.data.data); setInterns(u.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const goals = form.goals ? form.goals.split('\n').filter(Boolean).map(g => ({ title: g.trim(), status: 'pending' })) : [];
      const res = await performanceAPI.create({ ...form, goals });
      setRecords(p => [res.data.data, ...p]);
      setModal(false);
      toast.success('Evaluation submitted');
    } catch { toast.error('Failed to submit evaluation'); }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline font-bold text-2xl text-slate-900">Performance Evaluations</h1>
            <p className="text-slate-500 text-sm mt-1">Evaluate and track intern performance</p>
          </div>
          <button onClick={() => setModal(true)} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">add</span> New Evaluation
          </button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {records.map(r => (
              <div key={r._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-bold text-slate-900">{r.user?.name}</p>
                    <p className="text-xs text-slate-400">{r.period}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-primary">{r.overallScore}</p>
                    <p className="text-[10px] text-slate-400">/ 10</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[['Technical', r.technicalScore], ['Communication', r.communicationScore], ['Punctuality', r.punctualityScore]].map(([label, score]) => (
                    <div key={label} className="flex items-center gap-3">
                      <span className="text-xs text-slate-500 w-24">{label}</span>
                      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                        <div className="bg-primary rounded-full h-1.5" style={{ width: `${score * 10}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{score}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {records.length === 0 && <p className="text-slate-400 col-span-2 text-center py-12 text-sm">No evaluations yet.</p>}
          </div>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title="New Performance Evaluation">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Intern</label>
            <select className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.user} onChange={e => setForm(p => ({ ...p, user: e.target.value }))} required>
              <option value="">Select intern...</option>
              {interns.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Period (e.g. Q1 2026)</label>
            <input className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.period} onChange={e => setForm(p => ({ ...p, period: e.target.value }))} required />
          </div>
          {[['technicalScore', 'Technical Score'], ['communicationScore', 'Communication Score'], ['punctualityScore', 'Punctuality Score']].map(([k, l]) => (
            <div key={k}>
              <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">{l} ({form[k]}/10)</label>
              <input type="range" min={0} max={10} step={0.1} className="w-full" value={form[k]} onChange={e => setForm(p => ({ ...p, [k]: parseFloat(e.target.value) }))} />
            </div>
          ))}
          <div>
            <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Feedback</label>
            <textarea className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none resize-none" rows={3} value={form.feedback} onChange={e => setForm(p => ({ ...p, feedback: e.target.value }))} />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Goals (one per line)</label>
            <textarea className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none resize-none" rows={3} placeholder="Complete React course&#10;Lead a team meeting" value={form.goals} onChange={e => setForm(p => ({ ...p, goals: e.target.value }))} />
          </div>
          <button type="submit" className="w-full btn-primary py-3 text-sm">Submit Evaluation</button>
        </form>
      </Modal>
    </PageWrapper>
  );
}
