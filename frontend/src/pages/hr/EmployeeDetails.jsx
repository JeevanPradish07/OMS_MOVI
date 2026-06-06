import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';

export default function HREmployeeDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock Employee Data (Adapted for HR view)
  const emp = {
    id: id || 'EMP-001',
    name: 'Sarah Jenkins',
    email: 'sarah.j@movicloudlabs.com',
    phone: '+1 (555) 987-6543',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    type: 'Full-time',
    status: 'Active',
    joined: 'March 15, 2021',
    manager: 'Michael Chen',
    hrRepresentative: 'Amanda Reed',
    location: 'San Francisco, CA (HQ)',
    salaryBand: 'L4 (Senior)',
    leaveBalance: '14 Days (Annual)',
    sickLeave: '6 Days (Accrued)'
  };

  const activityHistory = [
    { id: 1, action: 'Annual leave request approved', time: 'Today, 10:42 AM', icon: 'event_available', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { id: 2, action: 'Updated emergency contact information', time: 'Yesterday, 02:15 PM', icon: 'contact_phone', color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 3, action: 'Completed "Annual Harassment Training"', time: 'Nov 15, 2024', icon: 'verified', color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 4, action: 'Performance review marked as complete', time: 'Oct 30, 2024', icon: 'star_rate', color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 5, action: 'Promoted to Senior Frontend Engineer', time: 'March 15, 2024', icon: 'trending_up', color: 'text-indigo-500', bg: 'bg-indigo-50' },
  ];

  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] max-w-6xl mx-auto space-y-6 pb-20">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-[13px] text-[#64748B] font-medium pt-2">
          <button onClick={() => navigate('/hr/employees')} className="hover:text-[#2563EB] transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">badge</span> Employees
          </button>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-[#0F172A]">{emp.name}</span>
        </div>

        {/* Profile Summary Card (No Banner) */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              {/* Avatar */}
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#F1F5F9] text-[#64748B] flex items-center justify-center text-[32px] font-bold shrink-0 relative border border-[#E2E8F0]">
                {emp.name.split(' ').map(n=>n[0]).join('')}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#16A34A] border-2 border-white rounded-full"></div>
              </div>
              
              {/* Name & Primary Details */}
              <div>
                <div className="flex items-center gap-3 mb-1.5">
                  <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A] leading-none">{emp.name}</h1>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-[#16A34A]/10 text-[#16A34A]">
                    {emp.status}
                  </span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold bg-blue-100 text-blue-700">
                    {emp.type}
                  </span>
                </div>
                <p className="text-[15px] text-[#0F172A] font-medium mb-1">
                  {emp.designation} <span className="text-[#CBD5E1] mx-1">•</span> {emp.department}
                </p>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#64748B] mt-3">
                   <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">person</span>
                      Reporting to: <span className="font-medium text-[#2563EB] cursor-pointer hover:underline">{emp.manager}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">badge</span>
                      Assigned HR: <span className="font-medium text-[#2563EB] cursor-pointer hover:underline">{emp.hrRepresentative}</span>
                   </div>
                   <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-[16px]">location_on</span>
                      {emp.location}
                   </div>
                </div>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex gap-3 shrink-0">
              <button className="border border-[#E2E8F0] bg-white text-[#0F172A] px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">edit</span> Edit Profile
              </button>
              <button className="border border-[#E2E8F0] bg-white text-[#2563EB] px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-blue-50 transition-colors flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[18px]">chat</span> Message
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
                <span className="text-[14px] font-medium text-[#0F172A] font-mono">{emp.id}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Email Address</span>
                <a href={`mailto:${emp.email}`} className="text-[14px] font-medium text-[#2563EB] hover:underline flex items-center gap-1.5">
                  {emp.email}
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Phone Number</span>
                <span className="text-[14px] font-medium text-[#0F172A]">{emp.phone}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Joined Organization</span>
                <span className="text-[14px] font-medium text-[#0F172A]">{emp.joined}</span>
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
                <span className="text-[14px] font-medium text-[#0F172A]">{emp.department}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Reporting Manager</span>
                <div className="flex items-center gap-2 mt-1 cursor-pointer group">
                  <div className="w-6 h-6 rounded-full bg-[#E2E8F0] text-[#475569] flex items-center justify-center text-[10px] font-bold">MC</div>
                  <span className="text-[14px] font-medium text-[#2563EB] group-hover:underline">{emp.manager}</span>
                </div>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Assigned HR</span>
                <div className="flex items-center gap-2 mt-1 cursor-pointer group">
                  <div className="w-6 h-6 rounded-full bg-[#E2E8F0] text-[#475569] flex items-center justify-center text-[10px] font-bold">AR</div>
                  <span className="text-[14px] font-medium text-[#2563EB] group-hover:underline">{emp.hrRepresentative}</span>
                </div>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Direct Reports</span>
                <span className="text-[14px] font-medium text-[#64748B] italic">None</span>
              </div>
            </div>
          </div>

          {/* Column 3: Employment Details */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-6 relative">
            <button className="absolute top-6 right-6 text-[12px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">request_quote</span> Payroll
            </button>
            <h2 className="text-[14px] font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              <span className="material-symbols-outlined text-[#64748B]">work</span>
              Employment Details
            </h2>
            <div className="space-y-5">
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Employment Type</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded text-[12px] font-semibold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                  {emp.type}
                </span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Salary Band</span>
                <span className="text-[14px] font-medium text-[#0F172A]">{emp.salaryBand}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Annual Leave Balance</span>
                <span className="text-[14px] font-medium text-[#16A34A] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">flight_takeoff</span>
                  {emp.leaveBalance}
                </span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Sick Leave Balance</span>
                <span className="text-[14px] font-medium text-[#D97706] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">medical_services</span>
                  {emp.sickLeave}
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Activity Timeline Story */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-8 border-b border-[#E2E8F0] pb-4">
            <div>
              <h2 className="text-[18px] font-bold text-[#0F172A]">HR Activity Story</h2>
              <p className="text-[13px] text-[#64748B] mt-1">A chronological timeline of {emp.name.split(' ')[0]}'s recent HR events and records.</p>
            </div>
            <button className="border border-[#E2E8F0] text-[#0F172A] px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-[#F8FAFC] transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">history</span> Full Event Log
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
                      {index === 0 && <p className="text-[13px] text-[#64748B] mt-0.5">Approved by Michael Chen</p>}
                      {index === 2 && <p className="text-[13px] text-[#64748B] mt-0.5">Score: 100%. Certificate added to file.</p>}
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
               <span className="text-[13px] font-medium text-[#94A3B8]">End of recent records</span>
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
