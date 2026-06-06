import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';

// --- MOCK DATA ---
const MOCK_PERFORMANCE = [
  { id: 'EMP-001', name: 'Sarah Jenkins', type: 'Full-time', role: 'Senior Frontend Engineer', completed: 42, overdue: 1, score: 9.2, trend: 'up', avatar: 'S' },
  { id: 'INT-001', name: 'Alex Wong', type: 'Intern', role: 'Software Engineering Intern', completed: 15, overdue: 0, score: 8.5, trend: 'up', avatar: 'A' },
  { id: 'EMP-002', name: 'Michael Chang', type: 'Full-time', role: 'Product Designer', completed: 28, overdue: 3, score: 7.8, trend: 'down', avatar: 'M' },
  { id: 'INT-002', name: 'Jessica Pearson', type: 'Intern', role: 'Data Science Intern', completed: 12, overdue: 1, score: 8.0, trend: 'up', avatar: 'J' },
  { id: 'EMP-005', name: 'David Kim', type: 'Part-time', role: 'Content Strategist', completed: 35, overdue: 0, score: 9.5, trend: 'up', avatar: 'D' },
  { id: 'INT-003', name: 'Brian OConner', type: 'Intern', role: 'Business Admin Intern', completed: 8, overdue: 4, score: 6.5, trend: 'down', avatar: 'B' },
];

export default function HRPerformance() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  // Derived filter options
  const types = [...new Set(MOCK_PERFORMANCE.map(p => p.type))];

  // Filtering
  const filteredRecords = MOCK_PERFORMANCE.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType ? emp.type === filterType : true;
    return matchesSearch && matchesType;
  });

  // Calculate Aggregates
  const totalCompleted = MOCK_PERFORMANCE.reduce((acc, curr) => acc + curr.completed, 0);
  const totalOverdue = MOCK_PERFORMANCE.reduce((acc, curr) => acc + curr.overdue, 0);
  const totalTasks = totalCompleted + totalOverdue;
  const onTimeRate = totalTasks === 0 ? 0 : Math.round((totalCompleted / totalTasks) * 100);
  const avgScore = (MOCK_PERFORMANCE.reduce((acc, curr) => acc + curr.score, 0) / MOCK_PERFORMANCE.length).toFixed(1);

  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] w-full flex flex-col h-full gap-6 max-w-[1440px] mx-auto pb-8">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">Performance Overview</h1>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Monitor task completion trends and evaluation scores for all employees and interns.
            </p>
          </div>
        </div>

        {/* TOP STATS CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Stat 1 */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Avg. Performance</p>
              <div className="flex items-end gap-2">
                <h2 className="text-[28px] font-bold text-[#0F172A] leading-none">{avgScore}</h2>
                <span className="text-[13px] text-[#64748B] mb-1">/ 10</span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">grade</span>
            </div>
          </div>
          
          {/* Stat 2 */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">Tasks Completed</p>
              <div className="flex items-end gap-2">
                <h2 className="text-[28px] font-bold text-[#0F172A] leading-none">{totalCompleted}</h2>
                <span className="text-[13px] text-[#10B981] font-medium mb-1 flex items-center">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span> +12%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#ECFDF5] text-[#10B981] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">task_alt</span>
            </div>
          </div>

          {/* Stat 3 */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider mb-1">On-Time Rate</p>
              <div className="flex items-end gap-2">
                <h2 className="text-[28px] font-bold text-[#0F172A] leading-none">{onTimeRate}%</h2>
                <span className="text-[13px] text-[#EF4444] font-medium mb-1 flex items-center">
                  <span className="material-symbols-outlined text-[14px]">trending_down</span> -2%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-[#FEF2F2] text-[#EF4444] flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">schedule</span>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg p-3 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Search */}
            <div className="relative w-full sm:w-[280px]">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
              <input
                type="text"
                placeholder="Search by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-[#E2E8F0] rounded-md py-1.5 pl-9 pr-3 text-[13px] focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>
            
            {/* Filters */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-[#E2E8F0] rounded-md py-1.5 px-3 text-[13px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] cursor-pointer bg-white"
            >
              <option value="">All Types (Emp/Intern)</option>
              {types.map(t => <option key={t} value={t}>{t}</option>)}
            </select>

            {(searchTerm || filterType) && (
              <button 
                onClick={() => { setSearchTerm(''); setFilterType(''); }}
                className="text-[13px] text-[#2563EB] hover:underline font-medium px-2"
              >
                Clear
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button className="border border-[#E2E8F0] text-[#0F172A] px-3 py-1.5 rounded-md text-[13px] font-medium hover:bg-[#F8FAFC] transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">download</span>
              Export Report
            </button>
          </div>
        </div>

        {/* TABLE VIEW */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Personnel</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">ID</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Role Type</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Tasks (On Time)</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Tasks (Overdue)</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Recent Score</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase text-right">Trend / Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((emp) => (
                    <tr 
                      key={emp.id} 
                      className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors last:border-0 cursor-pointer"
                    >
                      {/* Avatar + Name + Role */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] shrink-0 ${
                            emp.type === 'Intern' ? 'bg-[#ECFDF5] text-[#059669]' : 'bg-[#EFF6FF] text-[#1D4ED8]'
                          }`}>
                            {emp.avatar}
                          </div>
                          <div>
                            <div className="text-[14px] font-medium text-[#0F172A]">{emp.name}</div>
                            <div className="text-[12px] text-[#64748B] mt-0.5">{emp.role}</div>
                          </div>
                        </div>
                      </td>

                      {/* ID */}
                      <td className="px-4 py-3 text-[13px] font-mono text-[#64748B]">
                        {emp.id}
                      </td>

                      {/* Type */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                          emp.type === 'Intern' ? 'bg-[#D1FAE5] text-[#065F46]' : 'bg-[#DBEAFE] text-[#1E3A8A]'
                        }`}>
                          {emp.type}
                        </span>
                      </td>

                      {/* Completed */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-semibold text-[#0F172A]">{emp.completed}</span>
                          <div className="flex-1 h-1.5 w-16 bg-[#F1F5F9] rounded-full overflow-hidden">
                            <div className="h-full bg-[#10B981] rounded-full" style={{ width: `${(emp.completed / (emp.completed + emp.overdue || 1)) * 100}%` }}></div>
                          </div>
                        </div>
                      </td>

                      {/* Overdue */}
                      <td className="px-4 py-3">
                        <span className={`text-[13px] font-semibold ${emp.overdue > 0 ? 'text-[#EF4444]' : 'text-[#64748B]'}`}>
                          {emp.overdue}
                        </span>
                      </td>

                      {/* Score */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-[16px] text-[#F59E0B]">star</span>
                          <span className="text-[13px] font-bold text-[#0F172A]">{emp.score.toFixed(1)}</span>
                          <span className="text-[11px] text-[#64748B]">/ 10</span>
                        </div>
                      </td>

                      {/* Trend & Actions */}
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-4" onClick={(e) => e.stopPropagation()}>
                          <div className={`flex items-center gap-1 text-[12px] font-bold ${
                            emp.trend === 'up' ? 'text-[#10B981]' : 'text-[#EF4444]'
                          }`}>
                            <span className="material-symbols-outlined text-[16px]">
                              {emp.trend === 'up' ? 'trending_up' : 'trending_down'}
                            </span>
                          </div>
                          
                          <button 
                            className="text-[#64748B] hover:text-[#2563EB] transition-colors"
                            title="View Evaluation Details"
                          >
                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center justify-center text-[#64748B]">
                        <span className="material-symbols-outlined text-[#CBD5E1] text-[32px] mb-3">search_off</span>
                        <p className="text-[14px] font-medium text-[#0F172A]">No performance records found</p>
                        <p className="text-[12px] mt-1">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Footer */}
          <div className="px-4 py-3 border-t border-[#E2E8F0] bg-white flex items-center justify-between">
            <p className="text-[13px] text-[#64748B]">
              Showing <span className="font-medium text-[#0F172A]">{filteredRecords.length}</span> results
            </p>
            <div className="flex gap-1">
              <button className="p-1 border border-[#E2E8F0] rounded text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
              </button>
              <button className="p-1 border border-[#E2E8F0] rounded text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}
