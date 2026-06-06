import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserPlus, Search, Clock, CheckCircle2, 
  ChevronRight, Filter, AlertCircle, FileText 
} from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';

// --- MOCK DATA ---
const PENDING_APPROVALS = [
  { id: 'REQ-101', name: 'Jonathan Reeves', role: 'Backend Developer', type: 'Full-time', dept: 'Engineering', submitted: '2 hours ago', status: 'Pending PMO' },
  { id: 'REQ-102', name: 'Alicia Keys', role: 'Marketing Intern', type: 'Intern', dept: 'Marketing', submitted: 'Yesterday', status: 'Pending PMO' },
  { id: 'REQ-103', name: 'Marcus Chen', role: 'Product Manager', type: 'Full-time', dept: 'Product', submitted: '2 days ago', status: 'Pending PMO' },
];

const ACTIVE_ONBOARDING = [
  { id: 'ONB-201', name: 'Elena Gilbert', role: 'UI/UX Designer', joined: 'Oct 24, 2024', progress: 80, tasksComplete: 4, tasksTotal: 5 },
  { id: 'ONB-202', name: 'Stefan Salvatore', role: 'DevOps Engineer', joined: 'Oct 25, 2024', progress: 40, tasksComplete: 2, tasksTotal: 5 },
  { id: 'ONB-203', name: 'Damon Salvatore', role: 'Sales Executive', joined: 'Oct 26, 2024', progress: 20, tasksComplete: 1, tasksTotal: 5 },
];

const ONBOARDING_TASKS = [
  { id: 1, text: 'Issue company laptop and accessories' },
  { id: 2, text: 'Create workspace email and Slack accounts' },
  { id: 3, text: 'Add to payroll system (Gusto)' },
  { id: 4, text: 'Schedule HR Orientation meeting' },
  { id: 5, text: 'Assign compliance training modules' },
];

export default function HROnboarding() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('pending');
  const [selectedOnboardee, setSelectedOnboardee] = useState(null);
  
  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] w-full flex flex-col h-full">
        
        {/* HEADER */}
        <div className="px-6 py-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white shrink-0">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">Onboarding & Requests</h1>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Submit hiring requests to PMO and track new employee onboarding checklists.
            </p>
          </div>
          <button 
            onClick={() => navigate('/hr/employees/new')}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded-md text-[13px] font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">person_add</span>
            Submit New Hire Request
          </button>
        </div>

        {/* TABS */}
        <div className="px-6 border-b border-[#E2E8F0] bg-white shrink-0 flex items-center gap-6">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`py-3 text-[13px] font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'pending' 
                ? 'border-[#2563EB] text-[#2563EB]' 
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <Clock size={16} />
            Pending PMO Approvals
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'pending' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
              {PENDING_APPROVALS.length}
            </span>
          </button>
          <button 
            onClick={() => setActiveTab('active')}
            className={`py-3 text-[13px] font-medium border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'active' 
                ? 'border-[#2563EB] text-[#2563EB]' 
                : 'border-transparent text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <CheckCircle2 size={16} />
            Active Onboarding
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === 'active' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'}`}>
              {ACTIVE_ONBOARDING.length}
            </span>
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 overflow-hidden flex bg-[#F8FAFC]">
          
          {/* LIST VIEW */}
          <div className={`flex-1 overflow-y-auto custom-scrollbar p-6 ${selectedOnboardee ? 'hidden lg:block lg:w-2/3 border-r border-[#E2E8F0]' : 'w-full'}`}>
            
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-4">
               <div className="relative w-64">
                 <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
                 <input
                   className="w-full border border-[#E2E8F0] rounded-md py-1.5 pl-9 pr-3 text-[13px] focus:outline-none focus:border-[#2563EB] bg-white shadow-sm"
                   placeholder="Search records..."
                   type="text"
                 />
               </div>
               <button className="border border-[#E2E8F0] text-[#0F172A] bg-white px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-[#F1F5F9] transition-colors flex items-center gap-2 shadow-sm">
                 <Filter size={14} /> Filters
               </button>
            </div>

            {/* TAB CONTENT: PENDING */}
            {activeTab === 'pending' && (
              <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 bg-amber-50 border-b border-amber-100 flex items-start gap-3">
                   <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
                   <div>
                     <h3 className="text-[13px] font-semibold text-amber-900">Awaiting PMO Action</h3>
                     <p className="text-[12px] text-amber-700 mt-0.5">These employee requests have been submitted to the Project Management Office for budget and role approval. They will appear in the Active Onboarding tab once approved.</p>
                   </div>
                </div>
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                      <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Candidate</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Role & Dept</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Type</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Submitted</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PENDING_APPROVALS.map((req) => (
                      <tr key={req.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors last:border-0">
                        <td className="px-5 py-3.5">
                          <div className="text-[14px] font-medium text-[#0F172A]">{req.name}</div>
                          <div className="text-[12px] text-[#64748B] font-mono mt-0.5">{req.id}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="text-[13px] text-[#0F172A]">{req.role}</div>
                          <div className="text-[12px] text-[#64748B] mt-0.5">{req.dept}</div>
                        </td>
                        <td className="px-5 py-3.5">
                           <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold bg-[#F1F5F9] text-[#475569]">
                             {req.type}
                           </span>
                        </td>
                        <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{req.submitted}</td>
                        <td className="px-5 py-3.5 text-right">
                           <span className="inline-flex items-center px-2.5 py-1 rounded text-[11px] font-semibold bg-amber-100 text-amber-700">
                             <Clock size={12} className="mr-1.5" />
                             {req.status}
                           </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB CONTENT: ACTIVE ONBOARDING */}
            {activeTab === 'active' && (
              <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                      <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Employee</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Role</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Join Date</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Onboarding Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ACTIVE_ONBOARDING.map((person) => (
                      <tr 
                        key={person.id} 
                        className={`border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors last:border-0 cursor-pointer ${selectedOnboardee?.id === person.id ? 'bg-[#EFF6FF]' : ''}`}
                        onClick={() => setSelectedOnboardee(person)}
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#E2E8F0] text-[#64748B] flex items-center justify-center font-bold text-[12px] shrink-0">
                              {person.name.split(' ').map(n=>n[0]).join('')}
                            </div>
                            <div className="text-[14px] font-medium text-[#0F172A]">{person.name}</div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{person.role}</td>
                        <td className="px-5 py-3.5 text-[13px] text-[#64748B]">{person.joined}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3 w-48">
                            <div className="flex-1 bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
                              <div className="bg-[#10B981] h-full rounded-full" style={{ width: `${person.progress}%` }}></div>
                            </div>
                            <span className="text-[12px] font-medium text-[#0F172A] shrink-0">{person.tasksComplete}/{person.tasksTotal}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR: CHECKLIST DRAWER */}
          {(activeTab === 'active' && selectedOnboardee) && (
            <div className="w-full lg:w-1/3 bg-white border-l border-[#E2E8F0] flex flex-col h-full shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)] z-10">
              <div className="px-6 py-5 border-b border-[#E2E8F0] flex justify-between items-start bg-[#F8FAFC]">
                <div>
                  <h2 className="text-[16px] font-bold text-[#0F172A]">Onboarding Checklist</h2>
                  <p className="text-[13px] text-[#64748B] mt-1">For <span className="font-semibold text-[#0F172A]">{selectedOnboardee.name}</span></p>
                </div>
                <button 
                  onClick={() => setSelectedOnboardee(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                </button>
              </div>

              <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center mb-2">
                     <span className="text-[13px] font-bold text-emerald-800">Overall Progress</span>
                     <span className="text-[13px] font-bold text-emerald-600">{selectedOnboardee.progress}%</span>
                  </div>
                  <div className="w-full bg-emerald-200 rounded-full h-2 overflow-hidden">
                    <div className="bg-[#10B981] h-full rounded-full transition-all duration-500" style={{ width: `${selectedOnboardee.progress}%` }}></div>
                  </div>
                </div>

                <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-4">HR Action Items</h3>
                
                <div className="space-y-3">
                  {ONBOARDING_TASKS.map((task, idx) => {
                    const isChecked = idx < selectedOnboardee.tasksComplete;
                    return (
                      <div 
                        key={task.id} 
                        className={`flex items-start gap-3 p-3 rounded-lg border ${isChecked ? 'bg-[#F8FAFC] border-[#E2E8F0]' : 'bg-white border-[#CBD5E1] shadow-sm'} transition-colors cursor-pointer group`}
                      >
                        <div className={`w-5 h-5 rounded border mt-0.5 flex items-center justify-center shrink-0 transition-colors ${isChecked ? 'bg-[#2563EB] border-[#2563EB] text-white' : 'border-[#94A3B8] group-hover:border-[#2563EB]'}`}>
                           {isChecked && <Check size={14} strokeWidth={3} />}
                        </div>
                        <span className={`text-[13px] leading-snug ${isChecked ? 'text-[#64748B] line-through' : 'text-[#0F172A] font-medium'}`}>
                          {task.text}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-[#E2E8F0]">
                  <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-4">Resources</h3>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors mb-3 text-left">
                     <FileText className="text-[#2563EB]" size={18} />
                     <div>
                        <div className="text-[13px] font-medium text-[#0F172A]">Welcome Packet.pdf</div>
                        <div className="text-[11px] text-[#64748B]">2.4 MB</div>
                     </div>
                  </button>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors text-left">
                     <FileText className="text-[#2563EB]" size={18} />
                     <div>
                        <div className="text-[13px] font-medium text-[#0F172A]">IT Security Guidelines.pdf</div>
                        <div className="text-[11px] text-[#64748B]">1.1 MB</div>
                     </div>
                  </button>
                </div>
              </div>
            </div>
          )}
          
        </div>
      </div>
    </PageWrapper>
  );
}
