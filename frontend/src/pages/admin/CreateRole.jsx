import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';

export default function AdminCreateRole() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] max-w-[1000px] mx-auto flex flex-col h-full gap-8 pb-24">
        
        {/* Page Header */}
        <div className="flex flex-col gap-2 border-b border-[#E2E8F0] pb-6">
          <div className="flex items-center gap-2 text-[13px] text-[#64748B] font-medium pt-2">
            <button onClick={() => navigate('/admin/roles')} className="hover:text-[#2563EB] transition-colors flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">badge</span> Roles
            </button>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-[#0F172A]">Create Role</span>
          </div>
          <div>
            <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A]">Create Role</h1>
            <p className="text-[15px] text-[#64748B] mt-1">Design a new system persona and configure baseline access boundaries.</p>
          </div>
        </div>

        {/* Split Layout Form Sections */}
        <div className="space-y-10 divide-y divide-[#E2E8F0]">
          
          {/* Section 1: Role Identity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-2">
            <div className="lg:col-span-1">
              <h2 className="text-[16px] font-bold text-[#0F172A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2563EB]">fingerprint</span>
                Role Identity
              </h2>
              <p className="text-[13px] text-[#64748B] mt-2 leading-relaxed">
                Define the title and core purpose of this role. This is how the persona will be identified across the platform.
              </p>
            </div>
            <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Role Title <span className="text-[#DC2626]">*</span></label>
                <input type="text" className="w-full border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors" placeholder="e.g. Audit Manager" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Description <span className="text-[#DC2626]">*</span></label>
                <textarea rows="3" className="w-full border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors resize-none" placeholder="Briefly describe what users with this role do in the system..."></textarea>
              </div>
            </div>
          </div>

          {/* Section 2: Base Permissions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
            <div className="lg:col-span-1">
              <h2 className="text-[16px] font-bold text-[#0F172A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2563EB]">key</span>
                Base Permissions
              </h2>
              <p className="text-[13px] text-[#64748B] mt-2 leading-relaxed">
                Start by inheriting permissions from an existing template. You can customize granular permissions later on the Access Matrix.
              </p>
            </div>
            <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 grid grid-cols-1 gap-6">
              <div>
                <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Clone Existing Profile</label>
                <div className="relative">
                  <select className="w-full border border-[#E2E8F0] rounded-lg px-3.5 py-2.5 text-[14px] bg-white focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors appearance-none cursor-pointer">
                    <option value="">Start with Empty Profile</option>
                    <option value="employee">Clone Employee Profile</option>
                    <option value="hr">Clone HR Manager Profile</option>
                    <option value="pmo">Clone PMO Manager Profile</option>
                  </select>
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] pointer-events-none text-[18px]">expand_more</span>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-medium text-[#0F172A] mb-1.5">Default Module Access</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <label className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-[#F8FAFC] transition-colors">
                    <span className="text-[13px] font-medium text-[#0F172A]">Employee Directory</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]" />
                  </label>
                  <label className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-[#F8FAFC] transition-colors">
                    <span className="text-[13px] font-medium text-[#0F172A]">Task Management</span>
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]" />
                  </label>
                  <label className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-[#F8FAFC] transition-colors">
                    <span className="text-[13px] font-medium text-[#0F172A]">Financial Reports</span>
                    <input type="checkbox" className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]" />
                  </label>
                  <label className="flex items-center justify-between p-3 border border-[#E2E8F0] rounded-lg cursor-pointer hover:bg-[#F8FAFC] transition-colors">
                    <span className="text-[13px] font-medium text-[#0F172A]">System Settings</span>
                    <input type="checkbox" className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]" />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Access Boundaries */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-10">
            <div className="lg:col-span-1">
              <h2 className="text-[16px] font-bold text-[#0F172A] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#2563EB]">gpp_maybe</span>
                Access Boundaries
              </h2>
              <p className="text-[13px] text-[#64748B] mt-2 leading-relaxed">
                Establish high-level security constraints for this role. These boundaries supersede individual permissions.
              </p>
            </div>
            <div className="lg:col-span-2 bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-6">
              
              <div className="space-y-4">
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input type="checkbox" className="peer appearance-none w-4 h-4 rounded border border-[#CBD5E1] checked:bg-[#2563EB] checked:border-[#2563EB] transition-colors cursor-pointer" />
                    <span className="material-symbols-outlined absolute text-white text-[12px] opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                  </div>
                  <div>
                    <span className="block text-[13px] font-medium text-[#0F172A] group-hover:text-[#2563EB] transition-colors">Allow Data Exporting</span>
                    <span className="block text-[12px] text-[#64748B]">Permits users in this role to download CSV or PDF reports.</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input type="checkbox" defaultChecked className="peer appearance-none w-4 h-4 rounded border border-[#CBD5E1] checked:bg-[#2563EB] checked:border-[#2563EB] transition-colors cursor-pointer" />
                    <span className="material-symbols-outlined absolute text-white text-[12px] opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                  </div>
                  <div>
                    <span className="block text-[13px] font-medium text-[#0F172A] group-hover:text-[#2563EB] transition-colors">Enforce Strict MFA</span>
                    <span className="block text-[12px] text-[#64748B]">Multi-factor authentication will be mandatory upon login.</span>
                  </div>
                </label>
                <label className="flex items-start gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center mt-0.5">
                    <input type="checkbox" className="peer appearance-none w-4 h-4 rounded border border-[#CBD5E1] checked:bg-[#2563EB] checked:border-[#2563EB] transition-colors cursor-pointer" />
                    <span className="material-symbols-outlined absolute text-white text-[12px] opacity-0 peer-checked:opacity-100 pointer-events-none">check</span>
                  </div>
                  <div>
                    <span className="block text-[13px] font-medium text-[#0F172A] group-hover:text-[#2563EB] transition-colors">Cross-Department Visibility</span>
                    <span className="block text-[12px] text-[#64748B]">Allows seeing user details outside of their assigned department.</span>
                  </div>
                </label>
              </div>

            </div>
          </div>

        </div>

        {/* Action Footer (Inline) */}
        <div className="flex items-center justify-between pt-8 mt-4 border-t border-[#E2E8F0]">
          <button 
            onClick={() => navigate('/admin/roles')}
            className="text-[14px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors"
          >
            Cancel
          </button>
          <div className="flex items-center gap-3">
            <button className="border border-[#E2E8F0] bg-white text-[#0F172A] px-5 py-2.5 rounded-lg text-[13px] font-medium hover:bg-[#F8FAFC] transition-colors shadow-sm">
              Save as Draft
            </button>
            <button className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-2.5 rounded-lg text-[13px] font-medium transition-colors shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">badge</span> Create Role
            </button>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
