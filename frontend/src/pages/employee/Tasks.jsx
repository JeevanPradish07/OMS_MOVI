import React, { useState } from 'react';
import PageWrapper from '../../components/PageWrapper';
import { 
  Columns, List, CalendarDays, RefreshCw, Eye, X, CheckCircle, 
  Paperclip, MessageSquare, Download, UploadCloud, Search, CheckSquare, AlertCircle, PlayCircle, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const mockProjects = [
  { _id: 'proj001', name: 'OWMS Internal Platform v2' },
  { _id: 'proj002', name: 'Data Pipeline Automation' },
];

const mockTasks = [
  {
    _id: "task001",
    title: "Build Login Page UI",
    description: "Create the login page for OWMS using React 18 and Tailwind CSS.",
    project: mockProjects[0],
    assignedBy: { _id: "pmo001", name: "Aswanth K", role: "PMO Lead", avatar: "AK" },
    assignedTo: "emp001",
    sharedWith: [
      { name: "Sarah Connor", avatar: "SC" }
    ],
    priority: "High",
    status: "In Progress",
    effortPoints: 5,
    dueDate: "2024-10-15T23:59:59Z",
    subtasks: [
      { _id: "sub001", title: "Design mobile layout", completed: true, assignedTo: "emp001" },
      { _id: "sub002", title: "Add form validation", completed: false, assignedTo: "emp001" },
    ],
    comments: [
      { _id: "com001", author: { name: "Aswanth K", avatar: "AK" }, text: "Make sure to follow the design system", createdAt: "2024-10-10T10:00:00Z" },
    ],
    attachments: [],
    createdAt: "2024-10-08T09:00:00Z",
    blocked: false,
    overdue: false
  },
  {
    _id: "task002",
    title: "API Integration for Auth",
    description: "Connect the login form to the backend JWT authentication endpoints.",
    project: mockProjects[0],
    assignedBy: { _id: "pmo001", name: "Aswanth K", role: "PMO Lead", avatar: "AK" },
    assignedTo: "emp001",
    sharedWith: [],
    priority: "Critical",
    status: "Todo",
    effortPoints: 8,
    dueDate: "2024-10-12T23:59:59Z",
    subtasks: [],
    comments: [],
    attachments: [],
    createdAt: "2024-10-10T09:00:00Z",
    blocked: false,
    overdue: true
  },
  {
    _id: "task003",
    title: "Data Ingestion Script",
    description: "Write Python script to ingest CRM data into data warehouse.",
    project: mockProjects[1],
    assignedBy: { _id: "pmo002", name: "John Smith", role: "PMO Lead", avatar: "JS" },
    assignedTo: "emp001",
    sharedWith: [
      { name: "John Doe", avatar: "JD" }
    ],
    priority: "Medium",
    status: "In Review",
    effortPoints: 13,
    dueDate: "2024-10-25T23:59:59Z",
    subtasks: [],
    comments: [],
    attachments: [],
    createdAt: "2024-10-09T09:00:00Z",
    blocked: false,
    overdue: false
  },
  {
    _id: "task004",
    title: "Fix Pipeline Memory Leak",
    description: "Resolve memory issues during massive ETL runs.",
    project: mockProjects[1],
    assignedBy: { _id: "pmo002", name: "John Smith", role: "PMO Lead", avatar: "JS" },
    assignedTo: "emp001",
    sharedWith: [],
    priority: "High",
    status: "Blocked",
    effortPoints: 5,
    dueDate: "2024-10-05T23:59:59Z",
    subtasks: [],
    comments: [],
    attachments: [],
    createdAt: "2024-10-01T09:00:00Z",
    blocked: true,
    overdue: true
  }
];

const COLUMNS = [
  { id: 'Todo', title: 'Todo', color: 'border-l-slate-500' },
  { id: 'In Progress', title: 'In Progress', color: 'border-l-blue-600' },
  { id: 'In Review', title: 'In Review', color: 'border-l-purple-600' },
  { id: 'Done', title: 'Done', color: 'border-l-green-600' }
];

const PRIORITY_STYLES = {
  Low: { color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  Medium: { color: 'bg-amber-100 text-amber-700', dot: 'bg-amber-500' },
  High: { color: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  Critical: { color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
};

const formatDate = (isoStr) => {
  const date = new Date(isoStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const getRelativeTime = (isoStr) => {
  const date = new Date(isoStr);
  const now = new Date('2024-10-12T00:00:00Z');
  const diffInSeconds = Math.floor((now - date) / 1000);
  
  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
};

// --- SUB-COMPONENTS ---
const TaskDetailModal = ({ task, onClose, onStatusChange }) => {
  const [commentText, setCommentText] = useState('');
  const [activeTab, setActiveTab] = useState('Subtasks');
  const [description, setDescription] = useState(task?.description || '');
  
  if (!task) return null;

  const priorityColors = {
    Critical: 'text-red-600 bg-red-100 border-red-200',
    High: 'text-orange-600 bg-orange-100 border-orange-200',
    Medium: 'text-amber-600 bg-amber-100 border-amber-200',
    Low: 'text-green-600 bg-green-100 border-green-200'
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm font-sans">
        {/* Backdrop click to close */}
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="absolute inset-0 cursor-pointer" 
          onClick={onClose} 
        />
        
        {/* Modal Panel */}
        <motion.div 
          initial={{ x: 600, opacity: 0 }} 
          animate={{ x: 0, opacity: 1 }} 
          exit={{ x: 600, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="relative w-full max-w-2xl h-full bg-white shadow-2xl flex flex-col z-10 border-l border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-start justify-between px-6 py-5 border-b border-slate-200 bg-slate-50">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${priorityColors[task.priority] || priorityColors.Medium}`}>
                  {task.priority} Priority
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full border border-slate-200 bg-white text-slate-600 flex items-center gap-1 cursor-pointer hover:bg-slate-100">
                  <RefreshCw size={12} /> {task.status}
                </span>
                {task.overdue && task.status !== 'Done' && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white animate-pulse">Overdue</span>
                )}
                {task.status === 'Blocked' && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-red-500 text-white">Blocked</span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900 leading-tight">{task.title}</h2>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-slate-200">
            
            {/* Left Column (60%) */}
            <div className="flex-[3] p-6 space-y-8">
              
              {/* Description */}
              <section>
                <h3 className="text-sm font-bold text-slate-900 mb-2">Description</h3>
                <textarea 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full min-h-[100px] p-3 text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] focus:border-[#2563EB] outline-none resize-y"
                  placeholder="Add a more detailed description..."
                />
              </section>

              {/* Subtabs for content */}
              <section>
                <div className="flex border-b border-slate-200 mb-4">
                  {['Subtasks', 'Comments', 'Attachments'].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${activeTab === tab ? 'border-[#2563EB] text-[#2563EB]' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {activeTab === 'Subtasks' && (
                  <div className="space-y-2">
                    {task.subtasks?.length > 0 ? task.subtasks.map((st, i) => (
                      <div key={i} className="flex items-center gap-3 group p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#2563EB] focus:ring-[#2563EB]" defaultChecked={st.completed} />
                        <span className={`text-sm flex-1 ${st.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>{st.title}</span>
                      </div>
                    )) : <p className="text-sm text-slate-500 italic">No subtasks defined.</p>}
                  </div>
                )}

                {activeTab === 'Comments' && (
                  <div className="space-y-4">
                    {task.comments?.length > 0 ? (
                      <div className="space-y-3">
                        {task.comments.map((c, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">{c.author.avatar}</div>
                            <div className="flex-1 bg-slate-50 p-3 rounded-tr-xl rounded-b-xl border border-slate-200">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-xs font-bold text-slate-900">{c.author.name}</span>
                                <span className="text-[10px] text-slate-500">{getRelativeTime(c.createdAt)}</span>
                              </div>
                              <p className="text-sm text-slate-700">{c.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">No comments yet.</p>
                    )}
                    
                    <div className="flex gap-3 mt-4 pt-4 border-t border-slate-100">
                      <div className="w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-xs shrink-0">ME</div>
                      <div className="flex-1">
                        <textarea 
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="w-full h-16 p-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-[#2563EB] outline-none" 
                          placeholder="Write a comment..." 
                        />
                        <button disabled={!commentText.trim()} className="mt-2 px-3 py-1.5 bg-[#2563EB] text-white text-xs font-bold rounded-lg hover:bg-blue-700 disabled:opacity-50">Post Comment</button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'Attachments' && (
                  <div className="space-y-3">
                    {task.attachments?.length > 0 ? (
                      <div className="space-y-2 mb-4">
                        {task.attachments.map((att, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
                                <Paperclip size={16} />
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{att.name}</p>
                                <p className="text-xs text-slate-500">{att.size}</p>
                              </div>
                            </div>
                            <button className="text-slate-400 hover:text-[#2563EB] p-1.5 rounded-full hover:bg-slate-200 transition-colors">
                              <Download size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : null}
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors">
                      <UploadCloud size={24} className="text-slate-400 mb-2" />
                      <p className="text-sm font-bold text-slate-700">Drop files here</p>
                      <p className="text-xs text-slate-500">or click to browse</p>
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* Right Column (40%) */}
            <div className="flex-[2] bg-slate-50 p-6 flex flex-col">
              
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Details</h3>
              
              <div className="space-y-5">
                <div>
                  <p className="text-xs text-slate-500 mb-1">Assigned By</p>
                  <div className="flex items-center gap-2 p-1.5 -ml-1.5 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold">
                      {task.assignedBy.avatar}
                    </div>
                    <span className="text-sm font-bold text-slate-700">{task.assignedBy.name}</span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">Due Date</p>
                  <div className={`flex items-center gap-2 text-sm font-bold ${task.overdue && task.status !== 'Done' ? 'text-red-600' : 'text-slate-700'}`}>
                    <CalendarDays size={16} className={task.overdue && task.status !== 'Done' ? 'text-red-600' : 'text-slate-400'} />
                    {formatDate(task.dueDate)}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">Effort Estimate</p>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
                    <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center text-xs">
                      {task.effortPoints}
                    </div>
                    Points
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500 mb-1">Project</p>
                  <span className="inline-block px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-[#2563EB]">
                    {task.project.name}
                  </span>
                </div>
                
                {task.sharedWith?.length > 0 && (
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Shared With</p>
                    <div className="flex -space-x-2 mt-1">
                      {task.sharedWith.map((user, idx) => (
                        <div key={idx} className="w-7 h-7 rounded-full border-2 border-slate-50 bg-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-700" title={user.name}>
                          {user.avatar}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-8 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {task.status === 'Todo' && (
                  <button 
                    onClick={() => {
                      onStatusChange(task._id, 'In Progress');
                      onClose();
                    }}
                    className="w-full py-2 px-3 bg-white border border-[#E2E8F0] text-[#2563EB] rounded-lg text-sm font-bold hover:bg-[#EFF6FF] hover:border-[#BFDBFE] flex items-center gap-2 transition-colors"
                  >
                    <PlayCircle size={16} /> Mark as Started
                  </button>
                )}
                {(task.status === 'In Progress' || task.status === 'Todo') && (
                  <button 
                    onClick={() => {
                      onStatusChange(task._id, 'In Review');
                      onClose();
                    }}
                    className="w-full py-2 px-3 bg-white border border-[#E2E8F0] text-purple-600 rounded-lg text-sm font-bold hover:bg-purple-50 hover:border-purple-200 flex items-center gap-2 transition-colors"
                  >
                    <Send size={16} /> Submit for Review
                  </button>
                )}
                {task.status !== 'Blocked' && task.status !== 'Done' && (
                  <button 
                    onClick={() => {
                      onStatusChange(task._id, 'Blocked');
                      onClose();
                    }}
                    className="w-full py-2 px-3 bg-white border border-slate-200 text-red-600 rounded-lg text-sm font-bold hover:bg-red-50 hover:border-red-200 flex items-center gap-2 transition-colors"
                  >
                    <AlertCircle size={16} /> Report Blocker
                  </button>
                )}
                {task.status !== 'Done' && (
                  <button 
                    onClick={() => {
                      onStatusChange(task._id, 'Done');
                      onClose();
                    }}
                    className="w-full py-2 px-3 bg-[#16A34A] text-white rounded-lg text-sm font-bold hover:bg-green-700 flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <CheckCircle size={16} /> Mark Complete
                  </button>
                )}
                {task.status === 'Done' && (
                  <div className="w-full py-2 px-3 bg-green-50 text-green-700 border border-green-200 rounded-lg text-sm font-bold flex items-center justify-center gap-2">
                    <CheckCircle size={16} /> Completed
                  </div>
                )}
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default function EmployeeTasks() {
  const [view, setView] = useState('board'); // 'board' or 'list'
  const [selectedTask, setSelectedTask] = useState(null);
  const [tasks, setTasks] = useState(mockTasks);
  const [projectFilter, setProjectFilter] = useState('All Projects');

  const filteredTasks = tasks.filter(task => projectFilter === 'All Projects' || task.project.name === projectFilter);
  const overdueCount = tasks.filter(t => t.overdue && t.status !== 'Done').length;

  const handleStatusChange = (taskId, newStatus) => {
    setTasks(prev => prev.map(t => t._id === taskId ? { ...t, status: newStatus } : t));
  };

  return (
    <PageWrapper>
      <div className="w-full flex flex-col h-[calc(100vh-64px)] overflow-hidden font-sans pb-4">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6 px-4 sm:px-6 md:px-8 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-[#0F172A] flex items-center gap-3">
              My Tasks
              {overdueCount > 0 && (
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-red-100 text-red-700 animate-pulse">
                  {overdueCount} Overdue
                </span>
              )}
            </h1>
            <p className="text-sm text-[#64748B] mt-1">{tasks.length} total assigned tasks across projects</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Project Filter */}
            <select 
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="text-sm border border-[#E2E8F0] rounded-lg px-3 py-2 bg-white focus:outline-none focus:border-[#2563EB] font-medium text-[#0F172A]"
            >
              <option value="All Projects">All Projects</option>
              {mockProjects.map(p => (
                <option key={p._id} value={p.name}>{p.name}</option>
              ))}
            </select>
            
            <div className="flex bg-[#F1F5F9] p-1 rounded-lg border border-[#E2E8F0]">
              <button 
                onClick={() => setView('board')}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'board' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}`}
              >
                <Columns size={16} /> Board
              </button>
              <button 
                onClick={() => setView('list')}
                className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${view === 'list' ? 'bg-white text-[#0F172A] shadow-sm' : 'text-[#64748B] hover:text-[#0F172A]'}`}
              >
                <List size={16} /> List
              </button>
            </div>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-hidden mt-6 px-4 sm:px-6 md:px-8">
          
          {view === 'board' ? (
            // --- BOARD VIEW ---
            <div className="flex gap-6 h-full overflow-x-auto custom-scrollbar pb-4">
              {COLUMNS.map(col => (
                <div key={col.id} className="w-[300px] sm:w-[320px] shrink-0 flex flex-col h-full bg-[#F8FAFC] rounded-2xl border border-[#E2E8F0]">
                  {/* Column Header */}
                  <div className={`p-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white rounded-t-2xl border-t-4 ${col.color}`}>
                    <h3 className="font-bold text-[#0F172A]">{col.title}</h3>
                    <span className="bg-[#F1F5F9] text-[#64748B] text-xs font-bold px-2.5 py-1 rounded-full">
                      {filteredTasks.filter(t => t.status === col.id).length}
                    </span>
                  </div>
                  
                  {/* Cards */}
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-3">
                    {filteredTasks.filter(t => t.status === col.id).map(task => (
                      <div 
                        key={task._id} 
                        onClick={() => setSelectedTask(task)}
                        className={`bg-white p-4 rounded-xl shadow-sm border cursor-pointer hover:shadow-md hover:border-blue-300 transition-all group relative ${task.overdue ? 'border-red-300 bg-red-50/30' : 'border-[#E2E8F0]'}`}
                      >
                        {task.overdue && <div className="absolute top-0 right-0 w-2 h-2 rounded-full bg-red-500 m-2 animate-pulse" />}
                        {task.status === 'Blocked' && (
                          <div className="absolute top-0 right-0 text-[9px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded m-2">BLOCKED</div>
                        )}
                        
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${PRIORITY_STYLES[task.priority].color}`}>
                            {task.priority}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-[#0F172A] mb-1 leading-tight group-hover:text-[#2563EB] transition-colors pr-4">{task.title}</h4>
                        
                        {/* Show Project explicitly on card */}
                        <div className="text-[10px] font-semibold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded inline-block mb-3 truncate max-w-full">
                          {task.project.name}
                        </div>

                        {/* Card Footer */}
                        <div className="flex items-center justify-between border-t border-[#E2E8F0] pt-3">
                          <div className="flex -space-x-1">
                            <div className="w-6 h-6 rounded-full bg-[#1E293B] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white relative z-10" title={`Assigned by ${task.assignedBy.name}`}>
                              {task.assignedBy.avatar}
                            </div>
                            {task.sharedWith.map((u, i) => (
                              <div key={i} className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 flex items-center justify-center text-[10px] font-bold border-2 border-white relative z-0">
                                {u.avatar}
                              </div>
                            ))}
                          </div>
                          <div className={`flex items-center gap-1.5 text-xs font-semibold ${task.overdue ? 'text-red-600' : 'text-[#64748B]'}`}>
                            <CalendarDays size={14} />
                            {formatDate(task.dueDate)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // --- LIST VIEW ---
            <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm h-full flex flex-col">
              <div className="p-4 border-b border-[#E2E8F0] flex gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search tasks..." 
                    className="w-full pl-10 pr-4 py-2 border border-[#E2E8F0] rounded-lg text-sm focus:outline-none focus:border-[#2563EB] transition-colors"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-auto custom-scrollbar">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead className="bg-[#F8FAFC] sticky top-0 z-10 border-b border-[#E2E8F0]">
                    <tr>
                      <th className="px-5 py-3 text-xs font-bold tracking-wider text-[#64748B] uppercase">Priority</th>
                      <th className="px-5 py-3 text-xs font-bold tracking-wider text-[#64748B] uppercase">Task</th>
                      <th className="px-5 py-3 text-xs font-bold tracking-wider text-[#64748B] uppercase">Project</th>
                      <th className="px-5 py-3 text-xs font-bold tracking-wider text-[#64748B] uppercase">Due Date</th>
                      <th className="px-5 py-3 text-xs font-bold tracking-wider text-[#64748B] uppercase">Effort</th>
                      <th className="px-5 py-3 text-xs font-bold tracking-wider text-[#64748B] uppercase">Status</th>
                      <th className="px-5 py-3 text-xs font-bold tracking-wider text-[#64748B] uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTasks.map(task => (
                      <tr key={task._id} className={`border-b border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors ${task.overdue && task.status !== 'Done' ? 'bg-red-50/30' : ''}`}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${PRIORITY_STYLES[task.priority].dot}`} />
                            <span className="text-sm font-medium text-[#0F172A]">{task.priority}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm font-bold text-[#0F172A] hover:text-[#2563EB] cursor-pointer" onClick={() => setSelectedTask(task)}>
                            {task.title}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs bg-[#EFF6FF] text-[#2563EB] font-bold px-2 py-0.5 rounded">{task.project.name}</span>
                        </td>
                        <td className="px-5 py-4">
                          <div className={`text-sm ${task.overdue && task.status !== 'Done' ? 'text-red-600 font-bold' : 'text-[#64748B]'}`}>
                            {formatDate(task.dueDate)}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="text-sm text-[#0F172A] flex items-center gap-1.5">
                            <span className="font-bold">{task.effortPoints}</span> <span className="text-xs text-[#64748B]">pts</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {task.status === 'Blocked' ? (
                            <span className="text-xs font-bold px-2 py-1 rounded bg-red-100 text-red-700">Blocked</span>
                          ) : (
                            <span className="text-xs font-bold px-2 py-1 rounded bg-slate-100 text-slate-700">{task.status}</span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button 
                            onClick={() => setSelectedTask(task)}
                            className="text-[#64748B] hover:text-[#2563EB] p-2 rounded-lg hover:bg-[#E2E8F0] transition-colors"
                          >
                            <Eye size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Detail Modal */}
      <TaskDetailModal 
        task={selectedTask} 
        onClose={() => setSelectedTask(null)} 
        onStatusChange={handleStatusChange}
      />

    </PageWrapper>
  );
}
