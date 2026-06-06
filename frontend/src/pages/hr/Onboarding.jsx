import { useState } from 'react';
import { usersAPI } from '../../api';
import PageWrapper from '../../components/PageWrapper';
import toast from 'react-hot-toast';

const Field = ({ label, name, value, onChange, type = 'text', placeholder, required = false }) => (
  <div>
    <label className="text-xs uppercase tracking-widest font-extrabold text-slate-400 block mb-2">{label}</label>
    <input
      type={type} name={name} value={value} onChange={onChange}
      placeholder={placeholder}
      className="w-full bg-slate-50 border-none rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
      required={required}
    />
  </div>
);

export default function HROnboarding() {
  const [form, setForm] = useState({ name: '', email: '', college: '', department: '', phone: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await usersAPI.create({ ...form, role: 'intern', password: 'Intern@123' });
      toast.success(`Intern ${form.name} onboarded! Temporary password: Intern@123`);
      setForm({ name: '', email: '', college: '', department: '', phone: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create intern');
    } finally { setLoading(false); }
  };

  return (
    <PageWrapper>
      <div className="max-w-2xl">
        <div className="mb-8">
          <h1 className="font-headline font-bold text-2xl text-slate-900">Intern Onboarding</h1>
          <p className="text-slate-500 text-sm mt-1">Create a new intern profile. A temporary password will be assigned.</p>
        </div>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Field label="Full Name" name="name" value={form.name} onChange={handleChange} placeholder="John Smith" required />
            <Field label="Email Address" name="email" value={form.email} onChange={handleChange} type="email" placeholder="john.smith@movicloudlabs.com" required />
            <div className="grid grid-cols-2 gap-5">
              <Field label="College / University" name="college" value={form.college} onChange={handleChange} placeholder="Stanford University" required />
              <Field label="Department" name="department" value={form.department} onChange={handleChange} placeholder="Engineering" required />
            </div>
            <Field label="Phone Number" name="phone" value={form.phone} onChange={handleChange} placeholder="+1 234 567 8900" required />
            <div className="bg-blue-50 rounded-2xl p-4 text-sm text-blue-700 font-medium flex items-start gap-2">
              <span className="material-symbols-outlined text-base mt-0.5">info</span>
              Temporary password will be set to <strong className="mx-1">Intern@123</strong>. Intern should change this on first login.
            </div>
            <button type="submit" disabled={loading} className="btn-primary px-8 py-3 text-sm w-full flex items-center justify-center gap-2">
              {loading ? <><div className="spinner" /> Creating Profile...</> : 'Onboard Intern'}
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
