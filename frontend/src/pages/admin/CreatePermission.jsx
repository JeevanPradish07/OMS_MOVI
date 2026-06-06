import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, CheckCircle, Copy } from 'lucide-react';

export default function AdminCreatePermission() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    label: '',
    resource: '',
    action: '',
    description: '',
    riskLevel: 'Low',
    requiresApproval: false,
    assignedRoles: []
  });
  const [errors, setErrors] = useState({});
  const [copied, setCopied] = useState(false);

  const RESOURCES = ['Users', 'Departments', 'Roles', 'Reports', 'Audit Logs', 'Projects', 'Tasks'];
  const ACTIONS = ['Create', 'Read', 'Update', 'Delete', 'Export', 'Manage', 'Schedule'];
  const ROLES = [
    { name: 'Super Admin', color: 'bg-red-100 text-red-700' },
    { name: 'HR Manager', color: 'bg-blue-100 text-blue-700' },
    { name: 'PMO Lead', color: 'bg-purple-100 text-purple-700' },
    { name: 'Department Head', color: 'bg-amber-100 text-amber-700' },
    { name: 'Intern', color: 'bg-green-100 text-green-700' },
    { name: 'Viewer', color: 'bg-gray-100 text-gray-700' },
  ];

  const permissionString = formData.resource && formData.action 
    ? `${formData.resource.toLowerCase().replace(' ', '')}.${formData.action.toLowerCase()}` 
    : '';

  const handleCopy = () => {
    if (!permissionString) return;
    navigator.clipboard.writeText(permissionString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRoleToggle = (roleName) => {
    setFormData(prev => {
      const isSelected = prev.assignedRoles.includes(roleName);
      if (isSelected) {
        return { ...prev, assignedRoles: prev.assignedRoles.filter(r => r !== roleName) };
      }
      return { ...prev, assignedRoles: [...prev.assignedRoles, roleName] };
    });
  };

  const handleRiskChange = (level) => {
    setFormData(prev => ({
      ...prev,
      riskLevel: level,
      requiresApproval: level === 'Critical' ? true : prev.requiresApproval
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.label) newErrors.label = "This field is required";
    if (!formData.resource) newErrors.resource = "This field is required";
    if (!formData.action) newErrors.action = "This field is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      // API call would go here
      navigate('/admin/permissions');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen font-sans">
      
      {/* Left Pane */}
      <div className="w-full lg:w-[40%] bg-[#1E293B] text-white p-8 lg:p-12 flex flex-col justify-between">
        <div>
          <ShieldCheck size={48} className="text-[#2563EB] mb-6" />
          <h1 className="text-2xl font-bold text-white tracking-tight">Define a New Permission</h1>
          <p className="text-[#94A3B8] text-sm mt-3 leading-relaxed">
            Permissions define the atomic units of access in OWMS. Assign them to roles, not users directly.
          </p>

          <div className="mt-10 space-y-5">
            <div className="flex gap-3 items-start">
              <CheckCircle size={18} className="text-[#10B981] mt-0.5 shrink-0" />
              <p className="text-sm text-[#CBD5E1]">Permissions are the foundation of Role-Based Access Control</p>
            </div>
            <div className="flex gap-3 items-start">
              <CheckCircle size={18} className="text-[#10B981] mt-0.5 shrink-0" />
              <p className="text-sm text-[#CBD5E1]">Each permission maps to exactly one Resource and one Action</p>
            </div>
            <div className="flex gap-3 items-start">
              <CheckCircle size={18} className="text-[#10B981] mt-0.5 shrink-0" />
              <p className="text-sm text-[#CBD5E1]">Assigning to roles — not individuals — ensures auditability</p>
            </div>
            <div className="flex gap-3 items-start">
              <CheckCircle size={18} className="text-[#10B981] mt-0.5 shrink-0" />
              <p className="text-sm text-[#CBD5E1]">High-risk permissions can require explicit admin approval</p>
            </div>
          </div>

          <div className="rounded-xl bg-[#0F172A] p-5 mt-12 border border-[#334155]">
            <label className="text-xs tracking-widest text-[#64748B] font-semibold mb-2 block uppercase">
              Generated Permission String
            </label>
            <div className="font-mono text-lg">
              {permissionString ? (
                <span className="text-[#38BDF8]">{permissionString}</span>
              ) : (
                <span className="text-[#334155]">resource.action</span>
              )}
            </div>
          </div>
        </div>

        <button 
          onClick={() => navigate('/admin/permissions')}
          className="text-[#64748B] hover:text-white text-sm font-medium transition-colors text-left mt-12"
        >
          &larr; Back to Permissions
        </button>
      </div>

      {/* Right Pane */}
      <div className="w-full lg:w-[60%] bg-[#F8FAFC] flex flex-col h-screen">
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 pb-32">
          <div className="max-w-2xl mx-auto space-y-6">
            
            {/* Card 1: Permission Identity */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
              <h2 className="text-[15px] font-semibold text-[#0F172A] mb-5">Permission Identity</h2>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Permission Label <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.label}
                    onChange={e => setFormData({...formData, label: e.target.value})}
                    placeholder="e.g. Export Reports"
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-colors ${errors.label ? 'border-red-500' : 'border-[#E2E8F0] focus:border-[#2563EB]'}`}
                  />
                  {errors.label && <p className="text-red-500 text-xs mt-1">{errors.label}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Resource <span className="text-red-500">*</span></label>
                    <select 
                      value={formData.resource}
                      onChange={e => setFormData({...formData, resource: e.target.value})}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-colors bg-white ${errors.resource ? 'border-red-500' : 'border-[#E2E8F0] focus:border-[#2563EB]'}`}
                    >
                      <option value="">Select Resource...</option>
                      {RESOURCES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {errors.resource && <p className="text-red-500 text-xs mt-1">{errors.resource}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Action <span className="text-red-500">*</span></label>
                    <select 
                      value={formData.action}
                      onChange={e => setFormData({...formData, action: e.target.value})}
                      className={`w-full border rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#2563EB] transition-colors bg-white ${errors.action ? 'border-red-500' : 'border-[#E2E8F0] focus:border-[#2563EB]'}`}
                    >
                      <option value="">Select Action...</option>
                      {ACTIONS.map(a => <option key={a} value={a}>{a}</option>)}
                    </select>
                    {errors.action && <p className="text-red-500 text-xs mt-1">{errors.action}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Auto-Generated String</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      readOnly
                      value={permissionString}
                      placeholder="resource.action"
                      className="w-full border border-[#E2E8F0] bg-[#F8FAFC] rounded-lg px-3 py-2.5 text-sm font-mono text-[#64748B] focus:outline-none"
                    />
                    <button 
                      onClick={handleCopy}
                      disabled={!permissionString}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-[#64748B] hover:text-[#2563EB] disabled:opacity-50 transition-colors"
                      title="Copy to clipboard"
                    >
                      {copied ? <span className="text-xs font-semibold text-[#16A34A]">Copied!</span> : <Copy size={16} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2: Scope & Constraints */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
              <h2 className="text-[15px] font-semibold text-[#0F172A] mb-5">Scope & Constraints</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-1.5">Description</label>
                  <textarea 
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe what this permission allows..."
                    className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#0F172A] mb-2">Risk Level</label>
                  <div className="flex border border-[#E2E8F0] rounded-lg overflow-hidden w-full sm:w-fit">
                    {['Low', 'Medium', 'High', 'Critical'].map((level) => {
                      const isSelected = formData.riskLevel === level;
                      let activeBg = '';
                      if (level === 'Low') activeBg = 'bg-[#16A34A] text-white border-[#16A34A]';
                      if (level === 'Medium') activeBg = 'bg-[#F59E0B] text-white border-[#F59E0B]';
                      if (level === 'High') activeBg = 'bg-[#F97316] text-white border-[#F97316]';
                      if (level === 'Critical') activeBg = 'bg-[#DC2626] text-white border-[#DC2626]';

                      return (
                        <button
                          key={level}
                          onClick={() => handleRiskChange(level)}
                          className={`flex-1 sm:flex-none px-4 py-2 text-sm font-medium transition-colors border-r last:border-r-0 border-[#E2E8F0] ${isSelected ? activeBg : 'bg-white text-[#64748B] hover:bg-[#F8FAFC]'}`}
                        >
                          {level}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-start justify-between gap-4 pt-2">
                  <div>
                    <label className="block text-sm font-medium text-[#0F172A]">Requires Approval</label>
                    <p className="text-xs text-[#64748B] mt-0.5">Require an admin to explicitly approve this action.</p>
                    {formData.riskLevel === 'Critical' && (
                      <p className="text-xs text-[#2563EB] mt-1 font-medium">Auto-enabled for Critical risk permissions</p>
                    )}
                  </div>
                  <button 
                    onClick={() => formData.riskLevel !== 'Critical' && setFormData({...formData, requiresApproval: !formData.requiresApproval})}
                    disabled={formData.riskLevel === 'Critical'}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none transition-colors ${formData.requiresApproval ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'} ${formData.riskLevel === 'Critical' ? 'opacity-60 cursor-not-allowed' : ''}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${formData.requiresApproval ? 'translate-x-2' : '-translate-x-2'}`} />
                  </button>
                </div>
              </div>
            </div>

            {/* Card 3: Assign to Roles */}
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm">
              <div className="mb-5">
                <h2 className="text-[15px] font-semibold text-[#0F172A]">Assign to Roles (Optional)</h2>
                <p className="text-xs text-[#64748B] mt-1">Select roles that should inherit this permission immediately.</p>
              </div>
              
              <div className="space-y-3">
                {ROLES.map(role => (
                  <label key={role.name} className="flex items-center gap-3 p-3 border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-[#F8FAFC] transition-colors group">
                    <input 
                      type="checkbox" 
                      checked={formData.assignedRoles.includes(role.name)}
                      onChange={() => handleRoleToggle(role.name)}
                      className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-[#0F172A]">{role.name}</span>
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase ${role.color}`}>
                        Role
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="mt-4 text-sm font-medium text-[#2563EB]">
                {formData.assignedRoles.length} role(s) selected
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-[#E2E8F0] px-8 py-4 flex justify-between items-center sticky bottom-0 z-10 w-full shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button 
            onClick={() => navigate('/admin/permissions')}
            className="text-sm font-medium text-[#64748B] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] px-5 py-2.5 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSubmit}
            className="bg-[#2563EB] hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            Create Permission
          </button>
        </div>
      </div>

    </div>
  );
}
