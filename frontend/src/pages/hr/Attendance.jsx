import { useEffect, useState } from 'react';
import { attendanceAPI, usersAPI } from '../../api';
import PageWrapper from '../../components/PageWrapper';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function HRAttendance() {
  const [records, setRecords] = useState([]);
  const [interns, setInterns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markModal, setMarkModal] = useState(false);
  const [form, setForm] = useState({ userId: '', date: format(new Date(), 'yyyy-MM-dd'), status: 'present', checkIn: '09:00', checkOut: '18:00' });

  useEffect(() => {
    Promise.all([attendanceAPI.getAll(), usersAPI.getAll({ role: 'intern' })])
      .then(([att, usr]) => { setRecords(att.data.data); setInterns(usr.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const markAttendance = async (e) => {
    e.preventDefault();
    try {
      const res = await attendanceAPI.mark(form);
      setRecords(p => [res.data.data, ...p]);
      setMarkModal(false);
      toast.success('Attendance marked');
    } catch { toast.error('Failed to mark attendance'); }
  };

  const updateRecord = async (id, status) => {
    try {
      const res = await attendanceAPI.update(id, { status });
      setRecords(p => p.map(r => r._id === id ? res.data.data : r));
      toast.success(`Status updated to ${status}`);
    } catch { toast.error('Update failed'); }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline font-bold text-2xl text-slate-900">Attendance</h1>
            <p className="text-slate-500 text-sm mt-1">Track intern attendance and manage leave requests</p>
          </div>
          <button onClick={() => setMarkModal(true)} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">add</span> Mark Attendance
          </button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Intern</th><th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Check In</th><th className="px-6 py-4">Check Out</th>
                <th className="px-6 py-4">Status</th><th className="px-6 py-4">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {records.map(r => (
                  <tr key={r._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold">{r.user?.name || '—'}</td>
                    <td className="px-6 py-4 text-slate-500">{format(new Date(r.date), 'MMM d, yyyy')}</td>
                    <td className="px-6 py-4 text-slate-500">{r.checkIn || '—'}</td>
                    <td className="px-6 py-4 text-slate-500">{r.checkOut || '—'}</td>
                    <td className="px-6 py-4"><StatusBadge status={r.status} /></td>
                    <td className="px-6 py-4">
                      {r.status === 'pending' || r.status === 'leave' ? (
                        <div className="flex gap-2">
                          <button onClick={() => updateRecord(r._id, 'present')} className="text-xs px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg font-bold">Approve</button>
                          <button onClick={() => updateRecord(r._id, 'absent')} className="text-xs px-3 py-1 bg-rose-100 text-rose-700 rounded-lg font-bold">Reject</button>
                        </div>
                      ) : <span className="text-slate-300 text-xs">—</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={markModal} onClose={() => setMarkModal(false)} title="Mark Attendance">
        <form onSubmit={markAttendance} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Intern</label>
            <select className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.userId} onChange={e => setForm(p => ({ ...p, userId: e.target.value }))} required>
              <option value="">Select intern...</option>
              {interns.map(i => <option key={i._id} value={i._id}>{i.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Date</label>
              <input type="date" className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Status</label>
              <select className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))}>
                {['present', 'absent', 'leave', 'wfh'].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Check In</label>
              <input type="time" className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.checkIn} onChange={e => setForm(p => ({ ...p, checkIn: e.target.value }))} />
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Check Out</label>
              <input type="time" className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.checkOut} onChange={e => setForm(p => ({ ...p, checkOut: e.target.value }))} />
            </div>
          </div>
          <button type="submit" className="w-full btn-primary py-3 text-sm">Mark Attendance</button>
        </form>
      </Modal>
    </PageWrapper>
  );
}
