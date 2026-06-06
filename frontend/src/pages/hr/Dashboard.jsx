import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { 
  Users, UserCheck, CalendarOff, Briefcase, 
  ChevronRight, Check, X, MoreVertical, 
  Calendar as CalendarIcon, TrendingUp
} from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';

// --- MOCK DATA ---
const STATS = [
  { label: 'Total Employees', value: '245', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+12 this month' },
  { label: 'Present Today', value: '218', icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '89% attendance' },
  { label: 'On Leave', value: '14', icon: CalendarOff, color: 'text-amber-600', bg: 'bg-amber-50', trend: '4 pending approval' },
  { label: 'Open Positions', value: '12', icon: Briefcase, color: 'text-purple-600', bg: 'bg-purple-50', trend: '3 urgent hires' },
];

const RECENT_ACTIVITY = [
  { id: 1, title: 'Approved annual leave', name: 'Sarah Jenkins', time: '10:42 AM', type: 'leave', color: 'bg-emerald-500' },
  { id: 2, title: 'Initiated onboarding', name: 'Michael Chang', time: '09:15 AM', type: 'onboard', color: 'bg-blue-500' },
  { id: 3, title: 'Updated department mapping', name: 'Design Team', time: 'Yesterday, 04:30 PM', type: 'system', color: 'bg-purple-500' },
  { id: 4, title: 'Closed job requisition', name: 'Senior Engineer', time: 'Yesterday, 02:15 PM', type: 'hiring', color: 'bg-amber-500' },
  { id: 5, title: 'Generated attendance report', name: 'System', time: 'Sep 12, 09:00 AM', type: 'report', color: 'bg-slate-500' },
];

const DEPT_DATA = [
  { name: 'Engineering', value: 85, color: '#3B82F6' },
  { name: 'Design', value: 24, color: '#8B5CF6' },
  { name: 'Marketing', value: 42, color: '#F59E0B' },
  { name: 'Sales', value: 56, color: '#10B981' },
  { name: 'HR & Ops', value: 18, color: '#64748B' },
];

const PENDING_LEAVES = [
  { id: 1, name: 'Jessica Pearson', role: 'Sales Director', type: 'Sick Leave', duration: '2 days (Oct 25-26)', avatar: 'J' },
  { id: 2, name: 'Alex Wong', role: 'Engineering Intern', type: 'Annual Leave', duration: '5 days (Nov 1-5)', avatar: 'A' },
  { id: 3, name: 'Harvey Specter', role: 'Legal Counsel', type: 'Personal', duration: '1 day (Oct 30)', avatar: 'H' },
];

export default function HRDashboard() {
  const [leaves, setLeaves] = useState(PENDING_LEAVES);

  const handleLeaveAction = (id) => {
    setLeaves(prev => prev.filter(l => l.id !== id));
  };

  const totalHeadcount = DEPT_DATA.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] max-w-[1440px] mx-auto p-6 space-y-5">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h1 className="text-[22px] font-bold tracking-tight text-[#0F172A]">HR Dashboard</h1>
            <p className="text-[13px] text-[#64748B] mt-0.5">Overview of people operations, attendance, and pending actions.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white border border-[#E2E8F0] px-3 py-1.5 rounded-md text-[13px] font-medium shadow-sm">
              <CalendarIcon size={14} className="text-[#64748B]" />
              {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <button className="bg-[#2563EB] hover:bg-blue-700 text-white px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors shadow-sm">
              Generate Report
            </button>
          </div>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS.map((stat, i) => (
            <div key={i} className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${stat.bg}`}>
                  <stat.icon size={18} className={stat.color} />
                </div>
                <div className="flex items-center gap-1 text-[11px] font-semibold text-[#16A34A] bg-[#DCFCE7] px-1.5 py-0.5 rounded-sm">
                  <TrendingUp size={10} />
                  <span>Up</span>
                </div>
              </div>
              <div>
                <h3 className="text-[22px] font-bold text-[#0F172A] leading-none tracking-tight">{stat.value}</h3>
                <p className="text-[12px] font-medium text-[#64748B] mt-1">{stat.label}</p>
                <p className="text-[11px] text-[#94A3B8] mt-2 border-t border-[#F1F5F9] pt-1.5">{stat.trend}</p>
              </div>
            </div>
          ))}
        </div>

        {/* MAIN TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          
          {/* LEFT COLUMN - 66% */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* DEPARTMENT HEADCOUNT (Compact) */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm flex flex-col h-[300px]">
              <div className="px-5 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
                <h2 className="text-[14px] font-bold text-[#0F172A]">Department Headcount</h2>
                <button className="text-[12px] font-medium text-[#2563EB] hover:underline">View Directory</button>
              </div>
              
              <div className="flex-1 flex flex-col md:flex-row items-center p-5 gap-5">
                {/* Donut Chart */}
                <div className="w-full md:w-1/2 h-full relative min-h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={DEPT_DATA}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={75}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                        cornerRadius={3}
                      >
                        {DEPT_DATA.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value) => [`${value} Employees`, 'Headcount']}
                        contentStyle={{ borderRadius: '6px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px', padding: '6px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Custom Center Text */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[24px] font-bold text-[#0F172A] leading-none">{totalHeadcount}</span>
                    <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-widest mt-1">Total</span>
                  </div>
                </div>

                {/* Custom Legend / Progress Bars */}
                <div className="w-full md:w-1/2 flex flex-col justify-center space-y-3.5">
                  {DEPT_DATA.map((dept, i) => (
                    <div key={i} className="w-full">
                      <div className="flex justify-between text-[12px] mb-1">
                        <span className="font-medium text-[#0F172A] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: dept.color }}></span>
                          {dept.name}
                        </span>
                        <span className="font-semibold text-[#64748B]">{dept.value}</span>
                      </div>
                      <div className="w-full bg-[#F1F5F9] rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-1000" 
                          style={{ width: `${(dept.value / totalHeadcount) * 100}%`, backgroundColor: dept.color }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* PENDING LEAVES */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm">
              <div className="px-5 py-4 border-b border-[#E2E8F0] flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[14px] font-bold text-[#0F172A]">Leave Approvals</h2>
                  {leaves.length > 0 && (
                    <span className="bg-[#FEF2F2] text-[#DC2626] text-[10px] font-bold px-2 py-0.5 rounded-sm">
                      {leaves.length} Pending
                    </span>
                  )}
                </div>
                <button className="text-[12px] font-medium text-[#64748B] hover:text-[#0F172A]">View Calendar</button>
              </div>
              
              <div className="p-0">
                <AnimatePresence>
                  {leaves.length > 0 ? (
                    <div className="flex flex-col">
                      {leaves.map((leave, idx) => (
                        <motion.div 
                          key={leave.id}
                          initial={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                          className={`p-3.5 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors ${idx !== leaves.length - 1 ? 'border-b border-[#F1F5F9]' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-100 border border-[#E2E8F0] flex items-center justify-center text-[13px] font-bold text-[#0F172A] shrink-0">
                              {leave.avatar}
                            </div>
                            <div>
                              <h3 className="text-[13px] font-bold text-[#0F172A]">{leave.name}</h3>
                              <div className="flex items-center gap-2 mt-0.5">
                                <span className="bg-[#F1F5F9] text-[#475569] text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                                  {leave.type}
                                </span>
                                <span className="text-[11px] font-medium text-[#64748B]">{leave.duration}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button 
                              onClick={() => handleLeaveAction(leave.id)}
                              className="w-8 h-8 rounded flex items-center justify-center text-[#16A34A] border border-[#E2E8F0] hover:bg-[#DCFCE7] hover:border-[#16A34A] transition-colors"
                              title="Approve"
                            >
                              <Check size={14} strokeWidth={2.5} />
                            </button>
                            <button 
                              onClick={() => handleLeaveAction(leave.id)}
                              className="w-8 h-8 rounded flex items-center justify-center text-[#DC2626] border border-[#E2E8F0] hover:bg-[#FEF2F2] hover:border-[#DC2626] transition-colors"
                              title="Reject"
                            >
                              <X size={14} strokeWidth={2.5} />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center flex flex-col items-center">
                      <div className="w-12 h-12 bg-[#F1F5F9] rounded-full flex items-center justify-center mb-3">
                        <Check className="text-[#10B981]" size={24} />
                      </div>
                      <h3 className="text-[14px] font-bold text-[#0F172A]">All Caught Up</h3>
                      <p className="text-[12px] text-[#64748B] mt-1">No pending leave requests.</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN - 33% */}
          <div className="space-y-5">
            
            {/* ACTIVITY TIMELINE (Compact) */}
            <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm h-full max-h-[700px] flex flex-col">
              <div className="px-5 py-4 border-b border-[#E2E8F0] flex justify-between items-center sticky top-0 bg-white rounded-t-lg z-10">
                <h2 className="text-[14px] font-bold text-[#0F172A]">Activity Timeline</h2>
                <button className="p-1 hover:bg-[#F1F5F9] rounded text-[#64748B] transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
              
              <div className="p-5 flex-1 overflow-y-auto custom-scrollbar relative">
                {/* Continuous Vertical Line */}
                <div className="absolute left-[30px] top-6 bottom-6 w-px bg-[#E2E8F0]"></div>
                
                <div className="space-y-6">
                  {RECENT_ACTIVITY.map((activity) => (
                    <div key={activity.id} className="flex relative z-10">
                      <div className="mr-4 flex flex-col items-center">
                        <div className={`w-2.5 h-2.5 rounded-full ${activity.color} ring-4 ring-white shadow-sm mt-1.5`}></div>
                      </div>
                      <div className="flex-1 bg-[#F8FAFC] border border-[#F1F5F9] p-3 rounded-md hover:border-[#E2E8F0] transition-colors cursor-default">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className="text-[12px] font-bold text-[#0F172A] leading-snug">{activity.title}</h4>
                          <span className="text-[9px] font-semibold text-[#64748B] whitespace-nowrap ml-2">{activity.time}</span>
                        </div>
                        <p className="text-[11px] text-[#64748B]">
                          For <span className="font-semibold text-[#0F172A]">{activity.name}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <button className="w-full py-2.5 mt-2 text-[12px] font-bold text-[#2563EB] bg-blue-50 hover:bg-blue-100 rounded-md transition-colors flex items-center justify-center gap-1.5">
                    View Complete Log
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </PageWrapper>
  );
}
