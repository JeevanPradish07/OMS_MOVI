import React, { useState } from 'react';
import { 
  CalendarDays, CheckCircle2, XCircle, Clock, 
  TrendingUp, TrendingDown, Users, Filter, ChevronRight,
  AlertCircle, ChevronLeft, List
} from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';

// --- MOCK DATA ---
const LEAVE_REQUESTS = [
  { id: 'LR-2041', name: 'Sarah Jenkins', role: 'Frontend Engineer', type: 'Annual Leave', dates: 'Nov 12 - Nov 16', days: 5, reason: 'Family vacation', status: 'Pending', avatar: 'S' },
  { id: 'LR-2042', name: 'Michael Chang', role: 'Product Designer', type: 'Sick Leave', dates: 'Nov 02', days: 1, reason: 'Fever and cold', status: 'Approved', avatar: 'M' },
  { id: 'LR-2043', name: 'Jessica Pearson', role: 'Regional Director', type: 'Maternity', dates: 'Dec 01 - Mar 01', days: 90, reason: 'Maternity leave', status: 'Pending', avatar: 'J' },
  { id: 'LR-2044', name: 'James Gordon', role: 'Accountant', type: 'Unpaid Leave', dates: 'Oct 28', days: 1, reason: 'Personal errand', status: 'Rejected', avatar: 'J' },
];

const ON_LEAVE_TODAY = [
  { name: 'David Kim', type: 'Annual Leave', returnDate: 'Tomorrow', avatar: 'D' },
  { name: 'Emma Watson', type: 'Sick Leave', returnDate: 'Unknown', avatar: 'E' },
  { name: 'Marcus Chen', type: 'Conference', returnDate: 'Nov 08', avatar: 'M' }
];

export default function HRAttendance() {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
  const [requests, setRequests] = useState(LEAVE_REQUESTS);
  const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 1)); // June 2026

  const handleAction = (id, newStatus) => {
    setRequests(requests.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  // Dynamic Calendar Logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay();

  const daysInMonth = Array.from({ length: getDaysInMonth(year, month) }, (_, i) => i + 1);
  const startDayOffset = getFirstDayOfMonth(year, month);
  const blanks = Array.from({ length: startDayOffset }, (_, i) => i);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Mock leaves mapped to days
  const calendarEvents = {
    2: [{ name: 'Michael C.', type: 'Sick', color: 'bg-red-100 text-red-700' }],
    8: [{ name: 'Marcus C.', type: 'Conf', color: 'bg-purple-100 text-purple-700' }],
    12: [{ name: 'Sarah J.', type: 'Annual', color: 'bg-blue-100 text-blue-700' }],
    13: [{ name: 'Sarah J.', type: 'Annual', color: 'bg-blue-100 text-blue-700' }],
    14: [{ name: 'Sarah J.', type: 'Annual', color: 'bg-blue-100 text-blue-700' }],
    15: [{ name: 'Sarah J.', type: 'Annual', color: 'bg-blue-100 text-blue-700' }],
    16: [{ name: 'Sarah J.', type: 'Annual', color: 'bg-blue-100 text-blue-700' }],
    28: [{ name: 'James G.', type: 'Unpaid', color: 'bg-slate-200 text-slate-700' }]
  };

  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] w-full flex flex-col h-full gap-6 pb-12">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">Time & Leave Management</h1>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Monitor attendance trends, manage leave balances, and approve time-off requests.
            </p>
          </div>
          <button 
            onClick={() => setViewMode(viewMode === 'list' ? 'calendar' : 'list')}
            className="border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] text-[#0F172A] px-4 py-2 rounded-md text-[13px] font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            {viewMode === 'list' ? (
              <>
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                View Master Calendar
              </>
            ) : (
              <>
                <List size={18} />
                View List & Requests
              </>
            )}
          </button>
        </div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
               <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Total Leaves (Month)</span>
               <div className="w-8 h-8 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                 <CalendarDays size={18} />
               </div>
            </div>
            <div>
              <div className="text-[28px] font-bold text-[#0F172A] leading-none">124</div>
              <div className="flex items-center gap-1 mt-2 text-[12px] font-medium text-emerald-600">
                <TrendingDown size={14} /> <span>12% less than last month</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
               <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">On Leave Today</span>
               <div className="w-8 h-8 rounded-md bg-amber-50 text-amber-600 flex items-center justify-center">
                 <Users size={18} />
               </div>
            </div>
            <div>
              <div className="text-[28px] font-bold text-[#0F172A] leading-none">3</div>
              <div className="flex items-center gap-1 mt-2 text-[12px] font-medium text-[#64748B]">
                <span>Out of 245 total employees</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
               <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Pending Approvals</span>
               <div className="w-8 h-8 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center">
                 <Clock size={18} />
               </div>
            </div>
            <div>
              <div className="text-[28px] font-bold text-[#0F172A] leading-none">{requests.filter(r => r.status === 'Pending').length}</div>
              <div className="flex items-center gap-1 mt-2 text-[12px] font-medium text-purple-600">
                <AlertCircle size={14} /> <span>Requires your action</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-sm flex flex-col justify-between">
            <div className="flex justify-between items-start mb-4">
               <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Sick Leave Trend</span>
               <div className="w-8 h-8 rounded-md bg-red-50 text-red-600 flex items-center justify-center">
                 <TrendingUp size={18} />
               </div>
            </div>
            <div>
              <div className="text-[28px] font-bold text-[#0F172A] leading-none">+8%</div>
              <div className="flex items-center gap-1 mt-2 text-[12px] font-medium text-red-600">
                <TrendingUp size={14} /> <span>Higher than average</span>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN CONTENT SPLIT */}
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* LEFT: CONDITIONAL VIEW (TABLE OR CALENDAR) */}
          <div className="flex-1 bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden flex flex-col">
            
            {viewMode === 'list' ? (
              <>
                <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                  <h2 className="text-[15px] font-bold text-[#0F172A]">Leave Requests Queue</h2>
                  <button className="text-[12px] font-medium text-[#64748B] border border-[#E2E8F0] bg-white px-2.5 py-1.5 rounded flex items-center gap-1.5 hover:bg-[#F1F5F9] transition-colors">
                    <Filter size={14} /> Filter Status
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse whitespace-nowrap">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] bg-white">
                        <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Employee</th>
                        <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Leave Type</th>
                        <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Dates</th>
                        <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Status</th>
                        <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req) => (
                        <tr key={req.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors last:border-0 group">
                          <td className="px-5 py-3.5">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-[#E2E8F0] text-[#64748B] flex items-center justify-center font-bold text-[12px] shrink-0">
                                {req.avatar}
                              </div>
                              <div>
                                <div className="text-[13px] font-medium text-[#0F172A]">{req.name}</div>
                                <div className="text-[12px] text-[#64748B] mt-0.5">{req.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="text-[13px] font-medium text-[#0F172A]">{req.type}</div>
                            <div className="text-[12px] text-[#64748B] mt-0.5 truncate max-w-[120px]" title={req.reason}>{req.reason}</div>
                          </td>
                          <td className="px-5 py-3.5">
                            <div className="text-[13px] text-[#0F172A]">{req.dates}</div>
                            <div className="text-[11px] text-[#64748B] mt-0.5">{req.days} Day(s)</div>
                          </td>
                          <td className="px-5 py-3.5">
                             <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                               req.status === 'Approved' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                               req.status === 'Rejected' ? 'bg-[#DC2626]/10 text-[#DC2626]' :
                               'bg-[#F59E0B]/10 text-[#D97706]'
                             }`}>
                               {req.status}
                             </span>
                          </td>
                          <td className="px-5 py-3.5 text-right">
                            {req.status === 'Pending' ? (
                              <div className="flex items-center justify-end gap-2">
                                <button 
                                  onClick={() => handleAction(req.id, 'Approved')}
                                  className="w-7 h-7 flex items-center justify-center rounded bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors"
                                  title="Approve"
                                >
                                  <CheckCircle2 size={16} />
                                </button>
                                <button 
                                  onClick={() => handleAction(req.id, 'Rejected')}
                                  className="w-7 h-7 flex items-center justify-center rounded bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                                  title="Reject"
                                >
                                  <XCircle size={16} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-[12px] text-[#94A3B8] italic">Processed</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              // CALENDAR VIEW
              <div className="flex flex-col h-full">
                <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                  <div className="flex items-center gap-4">
                    <h2 className="text-[15px] font-bold text-[#0F172A] w-[140px]">{monthNames[month]} {year}</h2>
                    <div className="flex items-center gap-1">
                      <button onClick={handlePrevMonth} className="p-1 rounded text-[#64748B] hover:bg-[#E2E8F0] transition-colors"><ChevronLeft size={16} /></button>
                      <button onClick={handleNextMonth} className="p-1 rounded text-[#64748B] hover:bg-[#E2E8F0] transition-colors"><ChevronRight size={16} /></button>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-[12px] font-medium">
                     <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Annual</span>
                     <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> Sick</span>
                     <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-purple-500"></div> Other</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 border-b border-[#E2E8F0] bg-white">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="py-2 text-center text-[12px] font-semibold text-[#64748B] uppercase border-r border-[#E2E8F0] last:border-0">
                      {day}
                    </div>
                  ))}
                </div>
                
                <div className="grid grid-cols-7 flex-1 auto-rows-[minmax(80px,1fr)] bg-[#F8FAFC] gap-[1px]">
                  {blanks.map(blank => (
                    <div key={`blank-${blank}`} className="bg-white min-h-[80px]"></div>
                  ))}
                  {daysInMonth.map(day => (
                    <div key={day} className="bg-white min-h-[80px] p-1.5 flex flex-col gap-1 border-b border-r border-[#E2E8F0]">
                      <span className={`text-[12px] font-medium w-6 h-6 flex items-center justify-center rounded-full ${day === 6 ? 'bg-blue-600 text-white' : 'text-[#64748B]'}`}>
                        {day}
                      </span>
                      {month === 5 && year === 2026 && calendarEvents[day]?.map((evt, idx) => (
                        <div key={idx} className={`px-1.5 py-0.5 rounded text-[10px] font-semibold truncate ${evt.color}`}>
                          {evt.name}
                        </div>
                      ))}
                    </div>
                  ))}
                  {Array.from({ length: 42 - (blanks.length + daysInMonth.length) }, (_, i) => i).map(blank => (
                    <div key={`end-blank-${blank}`} className="bg-white min-h-[80px] border-b border-r border-[#E2E8F0]"></div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: WHO IS OUT TODAY */}
          <div className="w-full lg:w-80 flex flex-col gap-6">
            <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm p-5">
              <h2 className="text-[15px] font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                <Users size={18} className="text-[#64748B]" /> Who is Out Today
              </h2>
              <div className="space-y-4">
                {ON_LEAVE_TODAY.map((person, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] flex items-center justify-center font-bold text-[12px] shrink-0">
                      {person.avatar}
                    </div>
                    <div>
                      <div className="text-[13px] font-medium text-[#0F172A]">{person.name}</div>
                      <div className="text-[12px] text-[#64748B] mt-0.5">{person.type}</div>
                      <div className="text-[11px] font-semibold text-[#2563EB] mt-1 bg-blue-50 inline-block px-1.5 py-0.5 rounded">
                        Returns: {person.returnDate}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setViewMode('calendar')}
                className="w-full mt-5 text-[13px] font-medium text-[#2563EB] hover:underline flex items-center justify-center gap-1"
              >
                View Full Team Calendar <ChevronRight size={14} />
              </button>
            </div>
            
            {/* Quick Actions / Policies Widget */}
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg shadow-sm p-5">
              <h2 className="text-[14px] font-bold text-[#0F172A] mb-3 uppercase tracking-wider">Leave Policies</h2>
              <ul className="space-y-2 text-[13px] text-[#64748B]">
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#94A3B8]"></span> Annual Leave: 20 Days</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#94A3B8]"></span> Sick Leave: 10 Days</li>
                <li className="flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#94A3B8]"></span> Carry-forward max: 5 Days</li>
              </ul>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
