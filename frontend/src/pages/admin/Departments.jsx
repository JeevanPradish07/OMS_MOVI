import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';

export default function AdminDepartments() {
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState([]);
  
  const mockDepartments = [
    { id: '1', name: 'Engineering', head: 'Sarah Johnson', users: 142, status: 'Active', created: 'Jan 15, 2023' },
    { id: '2', name: 'Human Resources', head: 'Michael Chen', users: 8, status: 'Active', created: 'Feb 01, 2023' },
    { id: '3', name: 'Finance', head: 'David Smith', users: 12, status: 'Active', created: 'Mar 10, 2023' },
    { id: '4', name: 'Product Management', head: 'Emily Davis', users: 24, status: 'Active', created: 'Mar 15, 2023' },
    { id: '5', name: 'Marketing', head: 'Unassigned', users: 18, status: 'Inactive', created: 'Apr 05, 2023' },
  ];

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedIds(mockDepartments.map(d => d.id));
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
            <h1 className="text-[24px] font-semibold tracking-tight text-[#0F172A]">Departments</h1>
            <p className="text-[14px] text-[#64748B] mt-1">Manage organizational structure and departmental configurations.</p>
          </div>
          <button 
            onClick={() => navigate('/admin/departments/new')}
            className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 py-2 rounded text-[13px] font-medium transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">add</span>
            Create Department
          </button>
        </div>

        {/* Toolbar */}
        <div className="bg-white border border-[#E2E8F0] rounded-md p-3 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[18px]">search</span>
              <input
                className="w-full border border-[#E2E8F0] rounded py-1.5 pl-9 pr-3 text-[13px] focus:outline-none focus:border-[#2563EB] transition-colors"
                placeholder="Search departments..."
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
                    <input type="checkbox" onChange={handleSelectAll} checked={selectedIds.length === mockDepartments.length && mockDepartments.length > 0} className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]" />
                  </th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Department Name</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Head</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Total Users</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Status</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Created Date</th>
                  <th className="px-4 py-3 text-[12px] font-semibold text-[#64748B] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockDepartments.map((dept) => (
                  <tr key={dept.id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors last:border-0 group">
                    <td className="px-4 py-3 text-center">
                      <input type="checkbox" checked={selectedIds.includes(dept.id)} onChange={() => handleSelect(dept.id)} className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB]" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 cursor-pointer hover:underline text-[#0F172A]" onClick={() => navigate(`/admin/departments/${dept.id}`)}>
                        <div className="w-8 h-8 rounded bg-[#E2E8F0] text-[#64748B] flex items-center justify-center">
                          <span className="material-symbols-outlined text-[16px]">domain</span>
                        </div>
                        <span className="text-[14px] font-medium">{dept.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B]">
                      {dept.head === 'Unassigned' ? (
                        <span className="text-[#F59E0B] italic">{dept.head}</span>
                      ) : (
                        <span className="text-[#2563EB] hover:underline cursor-pointer">{dept.head}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B] font-mono">{dept.users}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        dept.status === 'Active' ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#E2E8F0] text-[#64748B]'
                      }`}>
                        {dept.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#64748B]">{dept.created}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => navigate(`/admin/departments/${dept.id}`)} className="text-[#64748B] hover:text-[#2563EB] transition-colors" title="View Details">
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
          
          <div className="px-4 py-3 border-t border-[#E2E8F0] flex items-center justify-between bg-white">
            <p className="text-[13px] text-[#64748B]">Showing <span className="font-medium text-[#0F172A]">1</span> to <span className="font-medium text-[#0F172A]">5</span> of <span className="font-medium text-[#0F172A]">5</span> results</p>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
