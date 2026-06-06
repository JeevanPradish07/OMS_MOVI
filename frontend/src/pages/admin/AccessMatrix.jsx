import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Save, AlertCircle, CheckCircle, ChevronRight, Lock } from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';

const RESOURCES = [
  { name: 'Users', actions: ['Read', 'Create', 'Update', 'Delete', 'Export'] },
  { name: 'Departments', actions: ['Read', 'Create', 'Update', 'Delete'] },
  { name: 'Roles', actions: ['Read', 'Create', 'Update', 'Delete'] },
  { name: 'Reports', actions: ['Read', 'Export', 'Schedule'] },
  { name: 'Audit Logs', actions: ['Read', 'Export'] },
  { name: 'Projects', actions: ['Read', 'Create', 'Update', 'Delete'] },
  { name: 'Tasks', actions: ['Read', 'Create', 'Update', 'Delete', 'Export'] },
];

const ROLES = [
  { id: 1, name: 'Super Admin', color: 'bg-red-100 text-red-700', locked: true },
  { id: 2, name: 'HR Manager', color: 'bg-blue-100 text-blue-700', locked: false },
  { id: 3, name: 'PMO Lead', color: 'bg-purple-100 text-purple-700', locked: false },
  { id: 4, name: 'Department Head', color: 'bg-amber-100 text-amber-700', locked: false },
  { id: 5, name: 'Intern', color: 'bg-green-100 text-green-700', locked: false },
  { id: 6, name: 'Viewer', color: 'bg-gray-100 text-gray-700', locked: false },
];

// Helper to generate full permissions true object
const generateFullAccess = () => {
  const perms = {};
  RESOURCES.forEach(r => {
    r.actions.forEach(a => {
      perms[`${r.name}.${a}`] = true;
    });
  });
  return perms;
};

// Helper to generate limited access object based on some rules
const generateLimitedAccess = (readOnlyList, writeList) => {
  const perms = {};
  RESOURCES.forEach(r => {
    r.actions.forEach(a => {
      if (writeList && writeList.includes(r.name)) {
        perms[`${r.name}.${a}`] = true;
      } else if (readOnlyList && readOnlyList.includes(r.name) && a === 'Read') {
        perms[`${r.name}.${a}`] = true;
      } else {
        perms[`${r.name}.${a}`] = false;
      }
    });
  });
  return perms;
};

const initialMatrix = {
  'Super Admin': generateFullAccess(),
  'HR Manager': generateLimitedAccess(['Roles', 'Audit Logs', 'Projects', 'Tasks'], ['Users', 'Departments', 'Reports']),
  'PMO Lead': generateLimitedAccess(['Users', 'Departments', 'Roles'], ['Projects', 'Tasks', 'Reports']),
  'Department Head': generateLimitedAccess(['Roles', 'Audit Logs'], ['Users', 'Departments', 'Projects', 'Tasks', 'Reports']),
  'Intern': generateLimitedAccess(['Users', 'Departments', 'Projects', 'Tasks'], []),
  'Viewer': generateLimitedAccess(['Users', 'Departments', 'Roles', 'Reports', 'Audit Logs', 'Projects', 'Tasks'], []),
};

export default function AdminAccessMatrix() {
  const navigate = useNavigate();
  const [matrix, setMatrix] = useState(initialMatrix);
  const [originalMatrix, setOriginalMatrix] = useState(initialMatrix);
  const [isDirty, setIsDirty] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleToggle = (roleName, resourceName, actionName) => {
    const role = ROLES.find(r => r.name === roleName);
    if (role.locked) return;

    const key = `${resourceName}.${actionName}`;
    setMatrix(prev => {
      const newMatrix = {
        ...prev,
        [roleName]: {
          ...prev[roleName],
          [key]: !prev[roleName][key]
        }
      };
      setIsDirty(true);
      return newMatrix;
    });
  };

  const handleDiscard = () => {
    setMatrix(originalMatrix);
    setIsDirty(false);
  };

  const handleSave = () => {
    setOriginalMatrix(matrix);
    setIsDirty(false);
    setShowToast(true);
    // Auto dismiss
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] w-full flex flex-col h-full gap-6 pb-20 relative">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-1.5 text-sm text-[#64748B] mb-1.5">
              <span>Admin</span>
              <ChevronRight size={14} />
              <span>Access Control</span>
              <ChevronRight size={14} />
              <span className="text-[#0F172A] font-medium">Access Matrix</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A]">Access Matrix</h1>
            <p className="text-sm text-[#64748B] mt-1">Role-based permission overview across all system resources</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="border border-[#E2E8F0] text-[#0F172A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#F8FAFC] transition-colors flex items-center gap-2">
              <Download size={16} />
              Export Matrix
            </button>
            <button 
              onClick={handleSave}
              disabled={!isDirty}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 text-white ${isDirty ? 'bg-[#2563EB] hover:bg-blue-700' : 'bg-[#94A3B8] cursor-not-allowed'}`}
            >
              <Save size={16} />
              Save Changes
              {isDirty && <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>}
            </button>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm flex-1 flex flex-col relative overflow-hidden">
          <div className="overflow-x-auto w-full custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                {/* First Header Row - Resource Groups */}
                <tr className="bg-[#F8FAFC]">
                  <th className="sticky left-0 top-0 z-30 bg-[#F8FAFC] border-b border-r border-[#E2E8F0] min-w-[180px] max-w-[180px] p-0"></th>
                  {RESOURCES.map((res, i) => (
                    <th 
                      key={res.name} 
                      colSpan={res.actions.length} 
                      className={`px-4 py-2 text-center font-semibold text-[#0F172A] border-b border-[#E2E8F0] bg-[#F1F5F9] ${i !== RESOURCES.length - 1 ? 'border-r' : ''}`}
                    >
                      {res.name}
                    </th>
                  ))}
                </tr>
                {/* Second Header Row - Actions */}
                <tr className="bg-white">
                  <th className="sticky left-0 top-0 z-30 bg-[#F8FAFC] px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider border-b border-r border-[#E2E8F0] min-w-[180px] max-w-[180px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    Role Name
                  </th>
                  {RESOURCES.map((res, resIdx) => (
                    res.actions.map((act, actIdx) => (
                      <th 
                        key={`${res.name}-${act}`}
                        className={`w-[52px] min-w-[52px] text-center text-xs font-medium text-[#64748B] px-1 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] ${actIdx === res.actions.length - 1 && resIdx !== RESOURCES.length - 1 ? 'border-r' : ''}`}
                      >
                        {act}
                      </th>
                    ))
                  ))}
                </tr>
              </thead>
              <tbody>
                {ROLES.map((role) => (
                  <tr key={role.name} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors last:border-0 group">
                    {/* Sticky Role Column */}
                    <td className="sticky left-0 z-20 bg-white min-w-[180px] max-w-[180px] px-4 py-3 border-r border-[#E2E8F0] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] group-hover:bg-[#F8FAFC]">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase ${role.color}`}>
                          {role.name}
                        </span>
                        {role.locked && <Lock size={14} className="text-[#64748B] ml-1" />}
                      </div>
                    </td>
                    
                    {/* Checkbox Cells */}
                    {RESOURCES.map((res, resIdx) => (
                      res.actions.map((act, actIdx) => {
                        const key = `${res.name}.${act}`;
                        const isChecked = matrix[role.name][key];
                        const isLastInGroup = actIdx === res.actions.length - 1 && resIdx !== RESOURCES.length - 1;

                        return (
                          <td 
                            key={`${role.name}-${key}`} 
                            className={`w-[52px] min-w-[52px] text-center px-1 py-3 ${isLastInGroup ? 'border-r border-[#E2E8F0]' : ''}`}
                          >
                            {role.locked ? (
                              <div className="flex items-center justify-center">
                                <div className="w-5 h-5 rounded-sm bg-[#E2E8F0] border border-[#CBD5E1] flex items-center justify-center cursor-not-allowed">
                                  <Lock size={11} className="text-[#94A3B8]" />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center justify-center">
                                <div 
                                  onClick={() => handleToggle(role.name, res.name, act)}
                                  className={`
                                    flex items-center justify-center w-5 h-5 rounded-sm border transition-colors cursor-pointer
                                    ${isChecked 
                                      ? 'bg-[#2563EB] border-[#2563EB] text-white' 
                                      : 'bg-white border-[#CBD5E1] text-transparent hover:border-[#94A3B8]'}
                                  `}
                                >
                                  <CheckCircle size={14} className={isChecked ? 'text-white' : 'text-transparent'} />
                                </div>
                              </div>
                            )}
                          </td>
                        );
                      })
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Unsaved Changes Banner */}
        <AnimatePresence>
          {isDirty && (
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#1E293B] text-white px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] lg:pl-72" // lg:pl-72 accounts for standard sidebar width approx
            >
              <div className="flex items-center gap-3">
                <AlertCircle className="text-[#F59E0B]" size={20} />
                <p className="text-sm font-medium">You have unsaved changes to the Access Matrix</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button 
                  onClick={handleDiscard}
                  className="flex-1 sm:flex-none px-4 py-2 rounded-lg text-sm font-medium border border-[#64748B] text-white hover:bg-[#334155] transition-colors"
                >
                  Discard
                </button>
                <button 
                  onClick={handleSave}
                  className="flex-1 sm:flex-none bg-[#2563EB] hover:bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Toast */}
        <AnimatePresence>
          {showToast && (
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed top-4 right-4 z-50 bg-[#16A34A] text-white rounded-lg px-4 py-3 flex items-center gap-2 shadow-lg"
            >
              <CheckCircle size={18} />
              <span className="text-sm font-medium">Access Matrix saved successfully</span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </PageWrapper>
  );
}
