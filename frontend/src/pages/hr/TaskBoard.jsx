import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';

// --- MOCK DATA ---
const INITIAL_TASKS = [
  { id: 't1', title: 'Q3 Security Audit Review', project: 'Q3 Security Audit', assignees: [{ initial: 'S', bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]' }], priority: 'high', status: 'open', date: 'Oct 15' },
  { id: 't2', title: 'Update Onboarding Docs', project: 'HR Internal', assignees: [{ initial: 'M', bg: 'bg-[#F5F3FF]', text: 'text-[#6D28D9]' }], priority: 'medium', status: 'in-progress', date: 'Oct 18' },
  { id: 't3', title: 'Design System Overhaul', project: 'Mobile App Redesign', assignees: [{ initial: 'A', bg: 'bg-[#ECFDF5]', text: 'text-[#059669]' }, { initial: 'J', bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]' }], priority: 'critical', status: 'needs-review', date: 'Oct 12' },
  { id: 't4', title: 'Monthly Performance Reports', project: 'HR Internal', assignees: [{ initial: 'S', bg: 'bg-[#EFF6FF]', text: 'text-[#1D4ED8]' }], priority: 'low', status: 'completed', date: 'Oct 10' },
  { id: 't5', title: 'Cloud Migration Scripts', project: 'Cloud Migration Phase 2', assignees: [{ initial: 'A', bg: 'bg-[#ECFDF5]', text: 'text-[#059669]' }], priority: 'high', status: 'in-progress', date: 'Oct 20' },
];

const COLUMNS = [
  { id: 'open', title: 'To Do', color: 'border-l-[#64748B]' },
  { id: 'in-progress', title: 'In Progress', color: 'border-l-[#2563EB]' },
  { id: 'needs-review', title: 'Needs Review', color: 'border-l-[#F59E0B]' },
  { id: 'completed', title: 'Completed', color: 'border-l-[#10B981]' },
];

const PRIORITY_STYLES = {
  low: { icon: 'keyboard_arrow_down', color: 'text-[#64748B]', bg: 'bg-[#F1F5F9]', label: 'Low' },
  medium: { icon: 'drag_handle', color: 'text-[#D97706]', bg: 'bg-[#FFFBEB]', label: 'Medium' },
  high: { icon: 'keyboard_arrow_up', color: 'text-[#EA580C]', bg: 'bg-[#FFF7ED]', label: 'High' },
  critical: { icon: 'priority_high', color: 'text-[#DC2626]', bg: 'bg-[#FEF2F2]', label: 'Critical' },
};

export default function HRTaskBoard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [draggedTask, setDraggedTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);

  // Drag and Drop Handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    // Transparent drag image hack for better custom styling could go here
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // necessary to allow dropping
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== targetStatus) {
      setTasks(prev => prev.map(t => 
        t.id === draggedTask.id ? { ...t, status: targetStatus } : t
      ));
    }
    setDraggedTask(null);
  };

  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] w-full flex flex-col h-[calc(100vh-100px)] overflow-hidden gap-6 max-w-[1600px] mx-auto pb-4">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 shrink-0">
          <div>
            <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">Task Board</h1>
            <p className="text-[13px] text-[#64748B] mt-0.5">
              Manage and track assigned tasks across your team. Drag and drop to update statuses.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="border border-[#E2E8F0] bg-white text-[#0F172A] px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-[#F8FAFC] transition-colors shadow-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filters
            </button>
            <button 
              onClick={() => navigate('/hr/tasks/new')}
              className="bg-[#2563EB] text-white px-5 py-2 rounded-lg text-[13px] font-medium hover:bg-[#1D4ED8] transition-colors shadow-sm flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
              Assign Task
            </button>
          </div>
        </div>

        {/* BOARD WRAPPER */}
        <div className="flex-1 flex gap-6 overflow-x-auto overflow-y-hidden custom-scrollbar pb-4 pt-2">
          {COLUMNS.map(col => {
            const columnTasks = tasks.filter(t => t.status === col.id);
            return (
              <div 
                key={col.id} 
                className="w-[320px] shrink-0 flex flex-col bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0] overflow-hidden"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column Header */}
                <div className={`px-4 py-3 bg-white border-b border-[#E2E8F0] flex items-center justify-between border-l-4 ${col.color}`}>
                  <h3 className="text-[14px] font-bold text-[#0F172A]">{col.title}</h3>
                  <div className="w-6 h-6 rounded-full bg-[#F1F5F9] flex items-center justify-center text-[12px] font-bold text-[#64748B]">
                    {columnTasks.length}
                  </div>
                </div>

                {/* Column Body (Drop Zone) */}
                <div className="flex-1 p-3 overflow-y-auto custom-scrollbar space-y-3">
                  {columnTasks.map(task => {
                    const pStyles = PRIORITY_STYLES[task.priority];
                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task)}
                        onClick={() => setSelectedTask(task)}
                        className="bg-white p-4 rounded-xl shadow-sm border border-[#E2E8F0] hover:border-[#2563EB] hover:shadow-md transition-all cursor-grab active:cursor-grabbing group"
                      >
                        {/* Tags */}
                        <div className="flex justify-between items-start mb-3">
                          <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${pStyles.bg} ${pStyles.color}`}>
                            <span className="material-symbols-outlined text-[12px]">{pStyles.icon}</span>
                            {pStyles.label}
                          </div>
                          <button className="text-[#94A3B8] hover:text-[#0F172A] opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="material-symbols-outlined text-[16px]">more_horiz</span>
                          </button>
                        </div>

                        {/* Title */}
                        <h4 className="text-[14px] font-bold text-[#0F172A] leading-snug mb-1">{task.title}</h4>
                        
                        {/* Project */}
                        <p className="text-[11px] font-semibold text-[#64748B] mb-4 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">folder</span>
                          {task.project}
                        </p>

                        {/* Footer */}
                        <div className="border-t border-[#F1F5F9] pt-3 flex items-center justify-between">
                          <div className="flex -space-x-1.5">
                            {task.assignees.map((a, i) => (
                              <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] border border-white relative z-[${10-i}] ${a.bg} ${a.text}`}>
                                {a.initial}
                              </div>
                            ))}
                          </div>
                          
                          <div className={`flex items-center gap-1 text-[11px] font-bold ${new Date(task.date) < new Date() && task.status !== 'completed' ? 'text-[#EF4444]' : 'text-[#64748B]'}`}>
                            <span className="material-symbols-outlined text-[14px]">schedule</span>
                            {task.date}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                  {columnTasks.length === 0 && (
                    <div className="h-24 border-2 border-dashed border-[#E2E8F0] rounded-xl flex items-center justify-center text-[12px] font-semibold text-[#94A3B8]">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* TASK DETAILS MODAL */}
        {selectedTask && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0F172A]/40 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col animate-in zoom-in-95">
              
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8FAFC]">
                <div className="flex items-center gap-3">
                  <div className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 ${PRIORITY_STYLES[selectedTask.priority].bg} ${PRIORITY_STYLES[selectedTask.priority].color}`}>
                    <span className="material-symbols-outlined text-[14px]">{PRIORITY_STYLES[selectedTask.priority].icon}</span>
                    {PRIORITY_STYLES[selectedTask.priority].label} Priority
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[11px] font-bold uppercase tracking-wider border ${
                    selectedTask.status === 'completed' ? 'border-[#10B981] text-[#10B981] bg-[#ECFDF5]' :
                    selectedTask.status === 'in-progress' ? 'border-[#2563EB] text-[#2563EB] bg-[#EFF6FF]' :
                    selectedTask.status === 'needs-review' ? 'border-[#F59E0B] text-[#F59E0B] bg-[#FFFBEB]' :
                    'border-[#64748B] text-[#64748B] bg-[#F8FAFC]'
                  }`}>
                    {COLUMNS.find(c => c.id === selectedTask.status)?.title}
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-[#64748B] hover:bg-[#E2E8F0] transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Modal Body */}
              <div className="p-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                <h2 className="text-[22px] font-bold text-[#0F172A] leading-tight mb-2">
                  {selectedTask.title}
                </h2>
                <div className="flex items-center gap-2 text-[13px] font-medium text-[#64748B] mb-6">
                  <span className="material-symbols-outlined text-[16px]">folder</span>
                  Project: <span className="text-[#0F172A]">{selectedTask.project}</span>
                </div>

                {/* Assignees */}
                <div className="mb-8">
                  <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-3">Assigned To</h3>
                  <div className="flex items-center gap-3">
                    {selectedTask.assignees.map((a, i) => (
                      <div key={i} className="flex items-center gap-2 bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1.5 rounded-full">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${a.bg} ${a.text}`}>
                          {a.initial}
                        </div>
                        <span className="text-[13px] font-semibold text-[#0F172A]">Employee {a.initial}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Progress Tracking Log */}
                <div>
                  <h3 className="text-[12px] font-bold text-[#64748B] uppercase tracking-wider mb-4">Progress Activity</h3>
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E2E8F0] before:to-transparent">
                    
                    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#10B981] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                        <span className="material-symbols-outlined text-[18px]">check</span>
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[13px] font-bold text-[#0F172A]">Task Assigned</span>
                          <span className="text-[11px] font-medium text-[#64748B]">Oct 10, 09:00 AM</span>
                        </div>
                        <p className="text-[12px] text-[#64748B]">HR created and dispatched the task.</p>
                      </div>
                    </div>

                    {(selectedTask.status === 'in-progress' || selectedTask.status === 'needs-review' || selectedTask.status === 'completed') && (
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#2563EB] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                          <span className="material-symbols-outlined text-[18px]">play_arrow</span>
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-[#E2E8F0] shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[13px] font-bold text-[#0F172A]">Started Work</span>
                            <span className="text-[11px] font-medium text-[#64748B]">Oct 11, 10:30 AM</span>
                          </div>
                          <p className="text-[12px] text-[#64748B]">Employee {selectedTask.assignees[0].initial} began working on the task.</p>
                        </div>
                      </div>
                    )}

                    {(selectedTask.status === 'needs-review' || selectedTask.status === 'completed') && (
                      <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#F59E0B] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm z-10">
                          <span className="material-symbols-outlined text-[18px]">rate_review</span>
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-[#FFFBEB] border-[#FDE68A] p-4 rounded-xl border shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[13px] font-bold text-[#D97706]">Submitted for Review</span>
                            <span className="text-[11px] font-medium text-[#D97706]">Just now</span>
                          </div>
                          <p className="text-[12px] text-[#D97706]">Employee {selectedTask.assignees[0].initial} completed the work and requested approval.</p>
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-6 py-4 border-t border-[#E2E8F0] bg-[#F8FAFC] flex justify-end gap-3">
                {selectedTask.status === 'needs-review' && (
                  <>
                    <button className="px-4 py-2 border border-[#E2E8F0] text-[#0F172A] bg-white rounded-lg text-[13px] font-bold hover:bg-[#F1F5F9] transition-colors">
                      Request Changes
                    </button>
                    <button className="px-5 py-2 bg-[#10B981] text-white rounded-lg text-[13px] font-bold hover:bg-[#059669] transition-colors flex items-center gap-2 shadow-sm">
                      <span className="material-symbols-outlined text-[18px]">done_all</span>
                      Approve & Complete
                    </button>
                  </>
                )}
                {selectedTask.status !== 'needs-review' && (
                  <button onClick={() => setSelectedTask(null)} className="px-5 py-2 bg-[#2563EB] text-white rounded-lg text-[13px] font-bold hover:bg-[#1D4ED8] transition-colors">
                    Close Details
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
