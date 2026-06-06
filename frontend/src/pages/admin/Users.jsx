import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';

export default function AdminUsers() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  
  const mockUsers = [
    { id: '1024', name: 'Michael Chen', email: 'michael.chen@movicloud.com', department: 'Engineering', role: 'Employee', status: 'Active', created: 'Oct 12, 2024' },
    { id: '1025', name: 'Sarah Johnson', email: 'sarah.j@movicloud.com', department: 'Human Resources', role: 'HR Manager', status: 'Active', created: 'Oct 14, 2024' },
    { id: '1026', name: 'David Smith', email: 'd.smith@movicloud.com', department: 'Finance', role: 'Employee', status: 'Inactive', created: 'Nov 02, 2024' },
    { id: '1027', name: 'Emily Davis', email: 'emily.d@movicloud.com', department: 'Product', role: 'PMO Manager', status: 'Active', created: 'Nov 05, 2024' },
    { id: '1028', name: 'James Wilson', email: 'j.wilson@movicloud.com', department: 'Engineering', role: 'Intern', status: 'Active', created: 'Dec 01, 2024' },
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(mockUsers.map(u => u.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelect = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] w-full flex flex-col h-full gap-6">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-[24px] font-semibold tracking-tight text-[#0F172A]">Users</h1>
            <p className="text-[14px] text-[#64748B] mt-1">Manage user accounts, roles, and system access.</p>
          </div>
          <button 
            onClick={() => navigate('/admin/users/new')}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded text-[13px] font-medium transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create User
          </button>
        </div>

        {/* User Metrics Snapshot */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E2E8F0] rounded-md p-4 shadow-sm flex flex-col justify-between h-[96px]">
            <div className="flex justify-between items-start">
               <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Total Users</span>
               <span className="material-symbols-outlined text-[18px] text-[#2563EB] bg-[#2563EB]/10 p-1 rounded">group</span>
            </div>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-[24px] font-medium text-[#0F172A] leading-none">245</span>
            </div>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-md p-4 shadow-sm flex flex-col justify-between h-[96px]">
            <div className="flex justify-between items-start">
               <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Active Users</span>
               <span className="material-symbols-outlined text-[18px] text-[#16A34A] bg-[#16A34A]/10 p-1 rounded">how_to_reg</span>
            </div>
            <div className="flex items-end justify-between mt-2">
              <span className="text-[24px] font-medium text-[#0F172A] leading-none">238</span>
              <span className="text-[11px] font-bold text-[#16A34A] bg-[#16A34A]/10 px-1.5 py-0.5 rounded">97%</span>
            </div>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-md p-4 shadow-sm flex flex-col justify-between h-[96px]">
            <div className="flex justify-between items-start">
               <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">New This Week</span>
               <span className="material-symbols-outlined text-[18px] text-[#0F172A] bg-[#F1F5F9] p-1 rounded">person_add</span>
            </div>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-[24px] font-medium text-[#0F172A] leading-none">12</span>
            </div>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-md p-4 shadow-sm flex flex-col justify-between h-[96px]">
            <div className="flex justify-between items-start">
               <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Pending Activation</span>
               <span className="material-symbols-outlined text-[18px] text-[#D97706] bg-[#F59E0B]/10 p-1 rounded">pending_actions</span>
            </div>
            <div className="flex items-end justify-between mt-2">
              <span className="text-[24px] font-medium text-[#0F172A] leading-none">3</span>
              <span className="text-[11px] font-bold text-[#D97706] bg-[#F59E0B]/10 px-1.5 py-0.5 rounded uppercase">Action Req</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-[#E2E8F0] rounded-md p-3 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
              <input
                className="w-full border border-[#E2E8F0] rounded py-1.5 pl-9 pr-3 text-[13px] focus:outline-none focus:border-[#2563EB] transition-colors"
                placeholder="Search users..."
                type="text"
              />
            </div>
            <button className="border border-[#E2E8F0] text-[#0F172A] px-3 py-1.5 rounded text-[13px] font-medium hover:bg-[#F8FAFC] transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">filter_list</span>
              Filters
            </button>
          </div>
          <div className="flex items-center gap-3">
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 mr-4 border-r border-[#E2E8F0] pr-4">
                <span className="text-[13px] text-[#64748B] font-medium">{selectedIds.length} selected</span>
                <button className="text-[12px] font-medium text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] px-2 py-1 rounded transition-colors">Activate</button>
                <button className="text-[12px] font-medium text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] px-2 py-1 rounded transition-colors">Deactivate</button>
                <button className="text-[12px] font-medium text-[#DC2626] bg-[#DC2626]/10 hover:bg-[#DC2626]/20 px-2 py-1 rounded transition-colors">Delete</button>
              </div>
            )}
            <button className="border border-[#E2E8F0] text-[#0F172A] px-3 py-1.5 rounded text-[13px] font-medium hover:bg-[#F8FAFC] transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">download</span>
              Export
            </button>
          </div>
        </div>

        {/* Content Area - Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-md shadow-sm overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="px-4 py-3 w-10 text-center">
                    <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === mockUsers.length && mockUsers.length > 0} className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]" />
                  </th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Name</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Employee ID</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Department</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Role</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Status</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Email</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Created Date</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockUsers.map((user) => (
                  <tr key={user.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors last:border-0 group">
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => handleSelect(user.id)} className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#E2E8F0] text-[#64748B] flex items-center justify-center font-bold text-[12px]">
                          {user.name.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <span className="text-[14px] font-medium text-[#0F172A]">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B] font-mono">{user.id}</td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B]">{user.department}</td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B]">{user.role}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        user.status === 'Active' ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#E2E8F0] text-[#64748B]'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B]">{user.email}</td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B]">{user.created}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => navigate(`/admin/users/${user.id}`)} className="text-[#64748B] hover:text-[#2563EB] transition-colors" title="View Details">
                          <span className="material-symbols-outlined text-[18px]">visibility</span>
                        </button>
                        <button className="text-[#64748B] hover:text-[#2563EB] transition-colors" title="Edit">
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button className="text-[#64748B] hover:text-[#0F172A] transition-colors" title="More actions">
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="px-4 py-3 border-t border-[#E2E8F0] flex items-center justify-between bg-white">
            <p className="text-[13px] text-[#64748B]">Showing <span className="font-medium text-[#0F172A]">1</span> to <span className="font-medium text-[#0F172A]">5</span> of <span className="font-medium text-[#0F172A]">245</span> results</p>
            <div className="flex gap-1">
              <button className="p-1 border border-[#E2E8F0] rounded text-[#64748B] hover:bg-[#F8FAFC] disabled:opacity-50"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
              <button className="p-1 border border-[#E2E8F0] rounded text-[#64748B] hover:bg-[#F8FAFC]"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
            </div>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
