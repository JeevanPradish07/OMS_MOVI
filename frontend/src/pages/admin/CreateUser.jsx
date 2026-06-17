import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';
import { adminAPI } from '../../utils/api';

export default function AdminCreateUser() {
  const navigate = useNavigate();

  // ── Form state ─────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: '',
    phone: '',
    department: '',
    designation: '',
    manager: '',
    employmentType: 'Full-time',
    role: '',
    generatePassword: true,
    sendInvite: true,
    requirePasswordChange: true,
  });

  // ── Async state ────────────────────────────────────────────────────────────
  const [roles, setRoles]               = useState([]);
  const [departments, setDepartments]   = useState([]);
  const [rolesLoading, setRolesLoading] = useState(true);
  const [deptLoading, setDeptLoading]   = useState(true);
  const [submitting, setSubmitting]     = useState(false);
  const [submitError, setSubmitError]   = useState('');

  // ── Load roles & departments on mount ──────────────────────────────────────
  useEffect(() => {
    adminAPI.getRoles()
      .then(res => setRoles(res.data.data || []))
      .catch(() => setRoles([]))
      .finally(() => setRolesLoading(false));

    adminAPI.getDepartments()
      .then(res => setDepartments(res.data.data || []))
      .catch(() => setDepartments([]))
      .finally(() => setDeptLoading(false));
  }, []);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim())  { setSubmitError('Full name is required.'); return false; }
    if (!formData.email.trim()) { setSubmitError('Email address is required.'); return false; }
    if (!formData.role)         { setSubmitError('System role is required.'); return false; }
    if (!formData.department)   { setSubmitError('Department is required.'); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const payload = {
        name:           formData.name.trim(),
        email:          formData.email.trim(),
        phone:          formData.phone || undefined,
        role:           formData.role,           // MongoDB ObjectId
        department:     formData.department,     // MongoDB ObjectId
        designation:    formData.designation || undefined,
        employmentType: formData.employmentType,
      };
      const res = await adminAPI.createUser(payload);
      if (res.data?.data?.warning) {
        alert(`User created. Note: ${res.data.data.warning}`);
      }
      navigate('/admin/users');
    } catch (err) {
      setSubmitError(
        err.response?.data?.message || 'Failed to create user. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Input class helper ────────────────────────────────────────────────────
  const inputCls = 'w-full border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors';
  const selectCls = `${inputCls} bg-white appearance-none cursor-pointer`;

  return (
    <PageWrapper>
      <form onSubmit={handleSubmit} className="font-sans text-[#0F172A] max-w-[1000px] mx-auto flex flex-col h-full gap-8 pb-24">

        {/* Page Header */}
        <div className="flex flex-col gap-2 border-b border-[#E2E8F0] pb-6">
          <div className="flex items-center gap-2 text-[13px] text-[#64748B] font-medium pt-2">
            <button type="button" onClick={() => navigate('/admin/users')} className="hover:text-[#2563EB] transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">group</span> Users
            </button>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-[#0F172A]">Onboard New User</span>
          </div>
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A]">Onboard New User</h1>
            <p className="text-[15px] text-[#64748B] mt-1">Configure identity, corporate structure, and system access for a new employee.</p>
          </div>
        </div>

        {/* Submit Error Banner */}
        {submitError && (
          <div className="bg-[#FEF2F2] border border-[#DC2626] rounded-lg p-3 text-sm text-[#DC2626] font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {submitError}
          </div>
        )}

        {/* Split Layout Form Sections */}
        <div className="space-y-10 divide-y divide-[#E2E8F0]">

          {/* Section 1: Identity & Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
            <div className="lg:col-span-1">
              <h2 className="text-[16px] font-bold text-[#0F172A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2563EB]">badge</span>
                Identity &amp; Contact
              </h2>
              <p className="text-[13px] text-[#64748B] mt-2 leading-relaxed">
                Provide the user's legal name, corporate contact details, and their unique identifier. This information forms the basis of their system profile.
              </p>
            </div>
            <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Full Name <span className="text-[#DC2626]">*</span></label>
                <input type="text" className={inputCls} placeholder="e.g. Jane Doe" value={formData.name} onChange={handleChange('name')} required />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Email Address <span className="text-[#DC2626]">*</span></label>
                <input type="email" className={inputCls} placeholder="jane.doe@movicloud.com" value={formData.email} onChange={handleChange('email')} required />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Employee ID</label>
                <input type="text" className={inputCls} placeholder="Auto-generated if blank" value={formData.employeeId} onChange={handleChange('employeeId')} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Phone Number</label>
                <input type="tel" className={inputCls} placeholder="+1 (555) 000-0000" value={formData.phone} onChange={handleChange('phone')} />
              </div>
            </div>
          </div>

          {/* Section 2: Corporate Structure */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
            <div className="lg:col-span-1">
              <h2 className="text-[16px] font-bold text-[#0F172A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2563EB]">account_tree</span>
                Corporate Structure
              </h2>
              <p className="text-[13px] text-[#64748B] mt-2 leading-relaxed">
                Define where the user sits within the organization. This determines their reporting lines and departmental access.
              </p>
            </div>
            <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Department <span className="text-[#DC2626]">*</span></label>
                <div className="relative">
                  <select className={selectCls} value={formData.department} onChange={handleChange('department')} required>
                    <option value="">{deptLoading ? 'Loading...' : 'Select Department'}</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>{dept.name}</option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none text-[18px]">expand_more</span>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Job Title <span className="text-[#DC2626]">*</span></label>
                <input type="text" className={inputCls} placeholder="e.g. Senior Developer" value={formData.designation} onChange={handleChange('designation')} />
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Employment Type</label>
                <div className="relative">
                  <select className={selectCls} value={formData.employmentType} onChange={handleChange('employmentType')}>
                    <option value="Full-time">Full Time</option>
                    <option value="Part-time">Part Time</option>
                    <option value="Contract">Contractor</option>
                    <option value="Intern">Intern</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none text-[18px]">expand_more</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Access & Security */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
            <div className="lg:col-span-1">
              <h2 className="text-[16px] font-bold text-[#0F172A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2563EB]">security</span>
                Access &amp; Security
              </h2>
              <p className="text-[13px] text-[#64748B] mt-2 leading-relaxed">
                Determine the user's privileges within OWMS. Careful assignment here prevents unauthorized access to sensitive operational data.
              </p>
            </div>
            <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">System Role <span className="text-[#DC2626]">*</span></label>
                  <div className="relative">
                    <select className={selectCls} value={formData.role} onChange={handleChange('role')} required>
                      <option value="">{rolesLoading ? 'Loading...' : 'Select Role'}</option>
                      {roles.map(role => (
                        <option key={role._id} value={role._id}>{role.name}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none text-[18px]">expand_more</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E2E8F0]">
                <h3 className="text-[13px] font-semibold text-[#0F172A] mb-3">Onboarding Actions</h3>
                <div className="space-y-3">
                  {[
                    { field: 'generatePassword', label: 'Generate Temporary Password', desc: 'System will automatically generate a secure 12-character password.' },
                    { field: 'sendInvite', label: 'Send Invitation Email', desc: 'User will receive instructions on how to log in.' },
                    { field: 'requirePasswordChange', label: 'Require Password Change', desc: 'User must change their password upon first login.' },
                  ].map(({ field, label, desc }) => (
                    <label key={field} className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center justify-center mt-0.5">
                        <input
                          type="checkbox"
                          checked={formData[field]}
                          onChange={handleChange(field)}
                          className="peer appearance-none w-4 h-4 rounded border border-[#CBD5E1] checked:bg-[#2563EB] checked:border-[#2563EB] transition-colors cursor-pointer"
                        />
                        <span className="material-symbols-outlined absolute text-white text-[12px] opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                      </div>
                      <div>
                        <span className="block text-[13px] font-medium text-[#0F172A] group-hover:text-[#2563EB] transition-colors">{label}</span>
                        <span className="block text-[12px] text-[#64748B]">{desc}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="flex items-center justify-between pt-8 mt-4 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => navigate('/admin/users')}
            className="text-[14px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            Cancel Onboarding
          </button>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/admin/users')}
              className="border border-[#E2E8F0] bg-white text-[#0F172A] px-5 py-2.5 rounded-lg text-[13px] font-medium hover:bg-[#F8FAFC] transition-colors shadow-sm"
            >
              Save as Draft
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded-lg text-[13px] font-medium transition-colors shadow-sm flex items-center gap-2"
            >
              {submitting ? (
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="material-symbols-outlined text-[18px]">person_add</span>
              )}
              {submitting ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </div>

      </form>
    </PageWrapper>
  );
}
