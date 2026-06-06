import React, { useState } from 'react';
import PageWrapper from '../../components/PageWrapper';

// --- MOCK DATA FOR INTERN TASKS ---
const INITIAL_TASKS = [
  { id: 't1', title: 'Q3 Security Audit Review', project: 'Q3 Security Audit', priority: 'high', status: 'open', date: 'Oct 15', desc: 'Review the latest security audit logs and document any anomalies found during the Q3 period.' },
  { id: 't2', title: 'Update Onboarding Docs', project: 'HR Internal', priority: 'medium', status: 'in-progress', date: 'Oct 18', desc: 'Update the intern onboarding handbook with the new remote work policies.' },
  { id: 't3', title: 'Design System Overhaul', project: 'Mobile App Redesign', priority: 'critical', status: 'needs-review', date: 'Oct 12', desc: 'Implement the new color palette across all mobile components.' },
  { id: 't4', title: 'Monthly Performance Reports', project: 'HR Internal', priority: 'low', status: 'completed', date: 'Oct 10', desc: 'Compile the monthly performance metrics into a presentation.' },
];

const PRIORITY_STYLES = {
  low: { icon: 'keyboard_arrow_down', color: 'text-[#64748B]', bg: 'bg-[#F1F5F9]', label: 'Low' },
  medium: { icon: 'drag_handle', color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]', label: 'Medium' },
  high: { icon: 'keyboard_arrow_up', color: 'text-[#EA580C]', bg: 'bg-[#FFF7ED]', label: 'High' },
  critical: { icon: 'priority_high', color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]', label: 'Critical' },
};

export default function InternTasks() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [filter, setFilter] = useState('all');

  const updateStatus = (id, newStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const filteredTasks = tasks.filter(t => filter === 'all' || t.status === filter);

  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] w-full flex flex-col h-full gap-6 max-w-[1200px] mx-auto pb-12">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">My Assigned Tasks</h1>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Track your work, update progress, and submit deliverables for HR review.
            </p>
          </div>
          
          <div className="flex bg-[#F1F5F9] p-1 rounded-lg">
            {['all', 'open', 'in-progress', 'needs-review', 'completed'].map(f => (
              <button 
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-1.5 text-[12px] font-bold rounded-md capitalize transition-all ${
                  filter === f ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {f.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* TASK GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {filteredTasks.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-[#E2E8F0] rounded-2xl bg-[#F8FAFC]">
              <span className="material-symbols-outlined text-[48px] text-[#CBD5E1] mb-3">task</span>
              <h3 className="text-[16px] font-bold text-[#0F172A]">No Tasks Found</h3>
              <p className="text-[13px] text-[#64748B] mt-1">You don't have any tasks in this category.</p>
            </div>
          ) : (
            filteredTasks.map(task => {
              const pStyles = PRIORITY_STYLES[task.priority];
              return (
                <div key={task.id} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden group">
                  
                  {/* Status Banner */}
                  {task.status === 'open' && <div className="h-1.5 w-full bg-[#64748B]" />}
                  {task.status === 'in-progress' && <div className="h-1.5 w-full bg-[#2563EB]" />}
                  {task.status === 'needs-review' && <div className="h-1.5 w-full bg-[#F59E0B]" />}
                  {task.status === 'completed' && <div className="h-1.5 w-full bg-[#10B981]" />}

                  <div className="p-6 flex-1 flex flex-col">
                    {/* Tags */}
                    <div className="flex justify-between items-start mb-4">
                      <div className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border ${pStyles.bg} ${pStyles.color} border-${pStyles.color.split('-')[1]}-200`}>
                        <span className="material-symbols-outlined text-[14px]">{pStyles.icon}</span>
                        {pStyles.label} Priority
                      </div>
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#64748B] bg-[#F8FAFC] px-2 py-1 rounded-md border border-[#E2E8F0]">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {task.date}
                      </div>
                    </div>

                    <h3 className="text-[16px] font-bold text-[#0F172A] leading-snug mb-2">{task.title}</h3>
                    <p className="text-[13px] text-[#64748B] leading-relaxed mb-6 line-clamp-3 flex-1">
                      {task.desc}
                    </p>

                    <div className="flex items-center gap-2 mb-6 text-[12px] font-bold text-[#0F172A] bg-[#F8FAFC] p-2.5 rounded-lg border border-[#E2E8F0]">
                      <span className="material-symbols-outlined text-[16px] text-[#64748B]">folder</span>
                      {task.project}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-auto pt-4 border-t border-[#E2E8F0]">
                      {task.status === 'open' && (
                        <button 
                          onClick={() => updateStatus(task.id, 'in-progress')}
                          className="w-full py-2.5 bg-[#2563EB] text-white rounded-xl text-[13px] font-bold hover:bg-[#1D4ED8] transition-colors flex items-center justify-center gap-2 shadow-sm"
                        >
                          <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                          Start Task
                        </button>
                      )}
                      
                      {task.status === 'in-progress' && (
                        <div className="flex gap-2">
                          <button 
                            onClick={() => updateStatus(task.id, 'needs-review')}
                            className="flex-1 py-2.5 bg-[#10B981] text-white rounded-xl text-[13px] font-bold hover:bg-[#059669] transition-colors flex items-center justify-center gap-2 shadow-sm"
                          >
                            <span className="material-symbols-outlined text-[18px]">rate_review</span>
                            Submit for Review
                          </button>
                        </div>
                      )}

                      {task.status === 'needs-review' && (
                        <div className="w-full py-2.5 bg-[#FFFBEB] text-[#D97706] border border-[#FDE68A] rounded-xl text-[13px] font-bold flex items-center justify-center gap-2 cursor-not-allowed">
                          <span className="material-symbols-outlined text-[18px]">hourglass_empty</span>
                          Waiting for HR Approval
                        </div>
                      )}

                      {task.status === 'completed' && (
                        <div className="w-full py-2.5 bg-[#ECFDF5] text-[#059669] border border-[#A7F3D0] rounded-xl text-[13px] font-bold flex items-center justify-center gap-2">
                          <span className="material-symbols-outlined text-[18px]">check_circle</span>
                          Task Completed
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })
          )}
        </div>

      </div>
    </PageWrapper>
  );
}
