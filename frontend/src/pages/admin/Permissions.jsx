import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Eye, EyeOff, Lock, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import PageWrapper from '../../components/PageWrapper';
import ConfirmDialog from '../../components/shared/ConfirmDialog';
import { adminAPI } from '../../utils/api';

const RESOURCE_FILTERS = ['All', 'Users', 'Departments', 'Roles', 'Permissions', 'Reports', 'Audit Logs', 'Projects', 'Tasks'];

export default function AdminPermissions() {
  const navigate = useNavigate();
  const [permissions, setPermissions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [resourceFilter, setResourceFilter] = useState('All');
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.getPermissions();
      setPermissions(res.data.data || []);
    } catch (err) {
      toast.error('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  // Derived filtered list
  const filteredPermissions = permissions.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.label.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesResource = resourceFilter === 'All' || p.resource === resourceFilter;
    return matchesSearch && matchesResource;
  });

  const totalPages = Math.ceil(filteredPermissions.length / itemsPerPage);
  const paginatedPermissions = filteredPermissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedRows(paginatedPermissions.map(p => p._id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleSelectRow = (id) => {
    if (selectedRows.includes(id)) {
      setSelectedRows(selectedRows.filter(rowId => rowId !== id));
    } else {
      setSelectedRows([...selectedRows, id]);
    }
  };

  const [deleteTarget, setDeleteTarget] = useState(null);

  const executeDelete = async () => {
    if (deleteTarget.ids) {
      // bulk — no deletePermission API exists yet, log TODO
      console.warn('TODO: bulk permission delete endpoint not implemented');
      setDeleteTarget(null);
      return;
    }
    // single — no deletePermission API either; mark inactive as fallback
    await adminAPI.updatePermissionStatus(deleteTarget.id, 'Inactive');
    setDeleteTarget(null);
    await fetchPermissions();
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await adminAPI.updatePermissionStatus(id, newStatus);
      setPermissions(permissions.map(p => {
        if (p._id === id) {
          return { ...p, status: newStatus };
        }
        return p;
      }));
      toast.success(`Permission ${newStatus === 'Active' ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const getResourceColor = (resource) => {
    switch (resource) {
      case 'Users': return 'bg-blue-100 text-blue-700';
      case 'Departments': return 'bg-violet-100 text-violet-700';
      case 'Roles': return 'bg-indigo-100 text-indigo-700';
      case 'Reports': return 'bg-cyan-100 text-cyan-700';
      case 'Audit Logs': return 'bg-slate-100 text-slate-700';
      case 'Projects': return 'bg-emerald-100 text-emerald-700';
      case 'Tasks': return 'bg-amber-100 text-amber-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'Create': return 'bg-blue-100 text-blue-700';
      case 'Read': return 'bg-slate-100 text-slate-700';
      case 'Update': return 'bg-amber-100 text-amber-700';
      case 'Delete': return 'bg-red-100 text-red-700';
      case 'Export': return 'bg-purple-100 text-purple-700';
      case 'Manage': return 'bg-indigo-100 text-indigo-700';
      case 'Schedule': return 'bg-teal-100 text-teal-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] w-full flex flex-col h-full gap-6">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#0F172A]">Permissions</h1>
            <p className="text-sm text-[#64748B] mt-1">Manage system-wide access control permissions</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                placeholder="Search permissions..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border border-[#E2E8F0] rounded-lg py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-[#2563EB] transition-colors"
              />
            </div>
            <select 
              value={resourceFilter}
              onChange={(e) => setResourceFilter(e.target.value)}
              className="border border-[#E2E8F0] rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-[#2563EB] bg-white cursor-pointer"
            >
              {RESOURCE_FILTERS.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            <button 
              onClick={() => navigate('/admin/permissions/new')}
              className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <Plus size={16} />
              New Permission
            </button>
          </div>
        </div>

        {/* Bulk Action Bar */}
        <AnimatePresence>
          {selectedRows.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="sticky top-0 z-20 bg-[#EFF6FF] border border-[#2563EB] rounded-lg p-3 flex items-center justify-between shadow-sm"
            >
              <span className="text-sm font-medium text-[#1E3A8A]">
                {selectedRows.length} permission(s) selected
              </span>
              <div className="flex items-center gap-2">
                <button className="text-sm font-medium text-[#2563EB] bg-white border border-[#BFDBFE] hover:bg-[#DBEAFE] px-3 py-1.5 rounded transition-colors">Activate</button>
                <button className="text-sm font-medium text-[#475569] bg-white border border-[#CBD5E1] hover:bg-[#F1F5F9] px-3 py-1.5 rounded transition-colors">Deactivate</button>
                <button onClick={() => setDeleteTarget({ ids: selectedRows, name: `${selectedRows.length} selected permission(s)` })} className="text-sm font-medium text-[#DC2626] bg-white border border-[#FECACA] hover:bg-[#FEE2E2] px-3 py-1.5 rounded transition-colors">Delete</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm overflow-hidden flex-1">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse whitespace-nowrap min-w-[800px]">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="px-4 py-3 w-12 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedRows.length === paginatedPermissions.length && paginatedPermissions.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer" 
                    />
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Permission Name</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Resource</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Action</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Assigned Roles</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Created Date</th>
                  <th className="px-4 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-[#64748B]">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <div className="w-6 h-6 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
                        Loading permissions...
                      </div>
                    </td>
                  </tr>
                ) : paginatedPermissions.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-8 text-center text-sm text-[#64748B]">
                      No permissions found matching your criteria.
                    </td>
                  </tr>
                ) : paginatedPermissions.map(p => (
                  <tr key={p._id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors last:border-0">
                    <td className="px-4 py-3 text-center">
                      <input 
                        type="checkbox" 
                        checked={selectedRows.includes(p._id)}
                        onChange={() => handleSelectRow(p._id)}
                        className="w-4 h-4 rounded border-[#CBD5E1] text-[#2563EB] focus:ring-[#2563EB] cursor-pointer" 
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Lock size={14} className="text-[#64748B]" />
                        <span className="font-mono text-sm font-bold text-[#0F172A]">{p.name}</span>
                      </div>
                      <span className="text-xs text-[#64748B] block mt-0.5">{p.label}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getResourceColor(p.resource)}`}>
                        {p.resource}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium ${getActionColor(p.action)}`}>
                        {p.action}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => navigate('/admin/access-matrix')}
                        className="inline-flex px-2 py-1 bg-white border border-[#E2E8F0] hover:bg-[#F1F5F9] hover:border-[#CBD5E1] rounded text-xs font-medium text-[#475569] transition-colors"
                      >
                        {p.assignedRolesCount || 0} Roles
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${p.status === 'Active' ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#E2E8F0] text-[#64748B]'}`}>
                        {p.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-[#64748B]">
                      {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button className="text-[#64748B] hover:text-[#2563EB] transition-colors" title="Edit">
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteTarget({ id: p._id, name: p.name }); }}
                          className="text-[#64748B] hover:text-[#DC2626] transition-colors"
                          title="Delete permission"
                        >
                          <Trash2 size={16} />
                        </button>
                        <button
                          onClick={() => toggleStatus(p._id, p.status)}
                          className={`transition-colors ${p.status === 'Active' ? 'text-[#64748B] hover:text-[#DC2626]' : 'text-[#64748B] hover:text-[#16A34A]'}`} 
                          title={p.status === 'Active' ? 'Deactivate' : 'Activate'}
                        >
                          {p.status === 'Active' ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredPermissions.length > 0 && (
            <div className="px-4 py-3 border-t border-[#E2E8F0] bg-white flex items-center justify-between">
              <p className="text-sm text-[#64748B]">
                Showing <span className="font-medium text-[#0F172A]">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-[#0F172A]">{Math.min(currentPage * itemsPerPage, filteredPermissions.length)}</span> of <span className="font-medium text-[#0F172A]">{filteredPermissions.length}</span>
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-[#E2E8F0] rounded text-sm text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-[#E2E8F0] rounded text-sm text-[#0F172A] hover:bg-[#F8FAFC] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        entityName={deleteTarget?.name}
        entityLabel={deleteTarget?.ids ? 'selection' : 'permission'}
        onConfirm={executeDelete}
      />
    </PageWrapper>
  );
}
