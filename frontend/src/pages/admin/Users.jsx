import { useEffect, useState } from 'react';
import { usersAPI } from '../../api';
import PageWrapper from '../../components/PageWrapper';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import Modal from '../../components/Modal';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', role: 'intern', department: '' });

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try { const r = await usersAPI.getAll(); setUsers(r.data.data); } finally { setLoading(false); }
  };

  const openCreate = () => { setEditUser(null); setForm({ name: '', email: '', role: 'intern', department: '' }); setModal(true); };
  const openEdit = (u) => { setEditUser(u); setForm({ name: u.name, email: u.email, role: u.role, department: u.department || '' }); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editUser) {
        const res = await usersAPI.update(editUser._id, form);
        setUsers(p => p.map(u => u._id === editUser._id ? res.data.data : u));
        toast.success('User updated');
      } else {
        const res = await usersAPI.create({ ...form, password: 'Password@123' });
        setUsers(p => [res.data.data, ...p]);
        toast.success('User created');
      }
      setModal(false);
    } catch (err) { toast.error(err.response?.data?.message || 'Operation failed'); }
  };

  const deleteUser = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await usersAPI.delete(id);
      setUsers(p => p.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch (err) { toast.error(err.response?.data?.message || 'Delete failed'); }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-headline font-bold text-2xl text-slate-900">User Management</h1>
            <p className="text-slate-500 text-sm mt-1">Create, edit, and manage all system users</p>
          </div>
          <button onClick={openCreate} className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-base">add</span> Add User
          </button>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
            <table className="w-full text-sm">
              <thead><tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-4">Name</th><th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role</th><th className="px-6 py-4">Department</th>
                <th className="px-6 py-4">Joined</th><th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Actions</th>
              </tr></thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold">{u.name}</td>
                    <td className="px-6 py-4 text-slate-500">{u.email}</td>
                    <td className="px-6 py-4"><StatusBadge status={u.role} /></td>
                    <td className="px-6 py-4 text-slate-500">{u.department || '—'}</td>
                    <td className="px-6 py-4 text-slate-500">{u.createdAt ? format(new Date(u.createdAt), 'MMM d, yyyy') : '—'}</td>
                    <td className="px-6 py-4"><span className={`badge ${u.isActive ? 'badge-done' : 'badge-overdue'}`}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(u)} className="text-primary hover:text-primary/70 transition-colors">
                          <span className="material-symbols-outlined text-base">edit</span>
                        </button>
                        <button onClick={() => deleteUser(u._id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                          <span className="material-symbols-outlined text-base">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={modal} onClose={() => setModal(false)} title={editUser ? 'Edit User' : 'Create User'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Name</label>
            <input className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div>
            <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Email</label>
            <input type="email" className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required disabled={!!editUser} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Role</label>
              <select className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} disabled={!!editUser}>
                {['intern', 'hr', 'pmo', 'admin'].map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">Department</label>
              <input className="w-full bg-slate-50 rounded-2xl px-4 py-3 text-sm outline-none" value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} />
            </div>
          </div>
          {!editUser && (
            <div className="bg-blue-50 rounded-2xl p-3 text-xs text-blue-700 font-medium">
              Default password: <strong>Password@123</strong>
            </div>
          )}
          <button type="submit" className="w-full btn-primary py-3 text-sm">{editUser ? 'Update User' : 'Create User'}</button>
        </form>
      </Modal>
    </PageWrapper>
  );
}
