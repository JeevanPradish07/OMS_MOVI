import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';

export default function AdminUserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock User Data
  const user = {
    id: id || 'EMP-1024',
    name: 'Michael Chen',
    email: 'michael.chen@movicloud.com',
    phone: '+1 (555) 123-4567',
    department: 'Engineering',
    designation: 'Senior Frontend Developer',
    role: 'Employee',
    status: 'Active',
    joined: 'October 12, 2024',
    manager: 'Sarah Johnson',
    hrRepresentative: 'Amanda Reed',
    location: 'San Francisco, CA (HQ)',
    lastLogin: 'Today, 08:30 AM',
    mfa: 'Enrolled via Authenticator',
    permissionGroup: 'Engineering Standard Access'
  };

  const activityHistory = [
    { id: 1, action: 'Updated profile picture', time: 'Yesterday, 04:15 PM', icon: 'account_circle', color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 2, action: 'Logged in from new IP (192.168.1.45)', time: 'Yesterday, 09:00 AM', icon: 'login', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 3, action: 'Completed "Q3 Security Compliance" training', time: 'Nov 15, 2024', icon: 'verified', color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 4, action: 'Password changed successfully', time: 'Nov 01, 2024', icon: 'key', color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 5, action: 'Account created by System Admin', time: 'Oct 12, 2024', icon: 'person_add', color: 'text-slate-500', bg: 'bg-slate-100' },
  ];

  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] max-w-6xl mx-auto space-y-6 pb-20">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-[13px] text-[#64748B] font-medium pt-2">
          <button onClick={() => navigate('/admin/users')} className="hover:text-[#2563EB] transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">group</span> Users
          </button>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-[#0F172A]">{user.name}</span>
        </div>

        {/* Profile Summary Card (No Banner) */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center text-[32px] font-bold shrink-0 relative border border-[#E2E8F0]">
                {user.name.split(' ').map(n=>n[0]).join('')}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#16A34A] border-2 border-white rounded-full"></div>
              </div>
              
              {/* Name & Primary Details */}
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A] leading-none">{user.name}</h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#16A34A]/10 text-[#16A34A]">
                    {user.status}
                  </span>
                </div>
                <p className="text-[15px] text-[#0F172A] font-medium mb-1">
                  {user.designation} <span className="text-[#CBD5E1] mx-1">•</span> {user.department}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#64748B] mt-3">
                   <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">person</span>
                      Reporting to: <span className="font-medium text-[#2563EB] cursor-pointer hover:underline">{user.manager}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">badge</span>
                      Assigned HR: <span className="font-medium text-[#2563EB] cursor-pointer hover:underline">{user.hrRepresentative}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      {user.location}
                   </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-3 shrink-0">
              <button className="border border-[#E2E8F0] bg-white text-[#0F172A] px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">edit</span> Edit Profile
              </button>
              <button className="border border-[#E2E8F0] bg-white text-[#DC2626] px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-[#FEF2F2] transition-colors flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">block</span> Deactivate
              </button>
            </div>
        </div>

        {/* 3-Column Information Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Column 1: Identity & Contact */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-[14px] font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              <span className="material-symbols-outlined text-[#64748B]">badge</span>
              Identity & Contact
            </h2>
            <div className="space-y-5">
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Employee ID</span>
                <span className="text-[14px] font-medium text-[#0F172A] font-mono">{user.id}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Email Address</span>
                <a href={`mailto:${user.email}`} className="text-[14px] font-medium text-[#2563EB] hover:underline flex items-center gap-1.5">
                  {user.email}
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Phone Number</span>
                <span className="text-[14px] font-medium text-[#0F172A]">{user.phone}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Joined Organization</span>
                <span className="text-[14px] font-medium text-[#0F172A]">{user.joined}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Corporate Structure */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-[14px] font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              <span className="material-symbols-outlined text-[#64748B]">account_tree</span>
              Corporate Structure
            </h2>
            <div className="space-y-5">
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Department</span>
                <span className="text-[14px] font-medium text-[#0F172A]">{user.department}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Reporting Manager</span>
                <div className="flex items-center gap-2 mt-1 cursor-pointer group">
                  <div className="w-6 h-6 rounded-full bg-[#E2E8F0] text-[#475569] flex items-center justify-center text-[10px] font-bold">SJ</div>
                  <span className="text-[14px] font-medium text-[#2563EB] group-hover:underline">{user.manager}</span>
                </div>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Assigned HR</span>
                <div className="flex items-center gap-2 mt-1 cursor-pointer group">
                  <div className="w-6 h-6 rounded-full bg-[#E2E8F0] text-[#475569] flex items-center justify-center text-[10px] font-bold">AR</div>
                  <span className="text-[14px] font-medium text-[#2563EB] group-hover:underline">{user.hrRepresentative}</span>
                </div>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Direct Reports</span>
                <span className="text-[14px] font-medium text-[#64748B] italic">None</span>
              </div>
            </div>
          </div>

          {/* Column 3: Access & Security */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-6 relative">
            <button className="absolute top-6 right-6 text-[12px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">lock_reset</span> Reset
            </button>
            <h2 className="text-[14px] font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              <span className="material-symbols-outlined text-[#64748B]">security</span>
              Access & Security
            </h2>
            <div className="space-y-5">
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">System Role</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded text-[12px] font-semibold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                  {user.role}
                </span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Permission Group</span>
                <span className="text-[14px] font-medium text-[#0F172A]">{user.permissionGroup}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Last Login</span>
                <span className="text-[14px] font-medium text-[#0F172A]">{user.lastLogin}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">MFA Status</span>
                <span className="text-[14px] font-medium text-[#16A34A] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">verified_user</span>
                  {user.mfa}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Activity Timeline Story */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-8 border-b border-[#E2E8F0] pb-4">
            <div>
              <h2 className="text-[18px] font-bold text-[#0F172A]">Activity Story</h2>
              <p className="text-[13px] text-[#64748B] mt-1">A chronological timeline of {user.name.split(' ')[0]}'s recent interactions and system events.</p>
            </div>
            <button className="border border-[#E2E8F0] text-[#0F172A] px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-[#F8FAFC] transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">history</span> Full Audit Log
            </button>
          </div>
          
          <div className="relative pl-4 sm:pl-8">
            {/* Vertical Line */}
            <div className="absolute left-[27px] sm:left-[43px] top-4 bottom-4 w-[2px] bg-[#E2E8F0]"></div>
            
            <div className="space-y-8">
              {activityHistory.map((item, index) => (
                <div key={item.id} className="relative flex items-start gap-6 group">
                  {/* Timeline Dot/Icon */}
                  <div className={`w-10 h-10 rounded-full ${item.bg} ${item.color} flex items-center justify-center border-4 border-white shadow-sm relative z-10 shrink-0 group-hover:scale-110 transition-transform`}>
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pt-2 gap-2">
                    <div>
                      <p className="text-[15px] font-medium text-[#0F172A]">{item.action}</p>
                      {index === 0 && <p className="text-[13px] text-[#64748B] mt-0.5">Updated from IP 192.168.1.45</p>}
                      {index === 2 && <p className="text-[13px] text-[#64748B] mt-0.5">Score: 100%. Certificate issued.</p>}
                    </div>
                    <span className="text-[13px] font-medium text-[#94A3B8] whitespace-nowrap">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
            
            {/* End of timeline indicator */}
            <div className="relative flex items-center gap-6 mt-8">
               <div className="w-10 h-10 flex items-center justify-center relative z-10 shrink-0">
                  <div className="w-3 h-3 rounded-full bg-[#CBD5E1] border-2 border-white shadow-sm"></div>
               </div>
               <span className="text-[13px] font-medium text-[#94A3B8]">End of recent activity</span>
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
