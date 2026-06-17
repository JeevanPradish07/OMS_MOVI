import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import PageWrapper from '../../components/PageWrapper';
import { adminAPI } from '../../utils/api';

export default function AdminUserDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [resetting, setResetting] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);
  const [activityLogs, setActivityLogs] = useState([]);
  const [tempPassword, setTempPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchUser = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminAPI.getUser(id);
      setUser(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load user details');
    } finally {
      setLoading(false);
    }
  };

  const fetchActivity = async () => {
    try {
      const res = await adminAPI.getAuditLogs({ limit: 5, userId: id });
      setActivityLogs(res.data.data || []);
    } catch {
      // Non-critical — don't show error
    }
  };

  useEffect(() => {
    fetchUser();
    fetchActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleToggleStatus = async () => {
    if (!user) return;
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    setTogglingStatus(true);
    try {
      await adminAPI.updateUserStatus(id, newStatus);
      toast.success(`User ${newStatus === 'Active' ? 'activated' : 'deactivated'} successfully`);
      await fetchUser();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setTogglingStatus(false);
    }
  };

  const handleResetPassword = async () => {
    setResetting(true);
    setTempPassword('');
    try {
      const res = await adminAPI.resetUserPassword(id);
      const temp = res.data?.data?.tempPassword;
      if (temp) {
        setTempPassword(temp);
      } else {
        toast.success('Password reset email sent');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setResetting(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(tempPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <PageWrapper>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
            <p className="text-[13px] text-[#64748B]">Loading user details...</p>
          </div>
        </div>
      </PageWrapper>
    );
  }

  if (error || !user) {
    return (
      <PageWrapper>
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <span className="material-symbols-outlined text-[48px] text-[#DC2626]">error</span>
          <p className="text-[15px] text-[#0F172A] font-medium">{error || 'User not found'}</p>
          <button onClick={() => navigate('/admin/users')} className="text-[#2563EB] font-medium hover:underline text-[13px]">
            ← Back to Users
          </button>
        </div>
      </PageWrapper>
    );
  }

  const initials = user.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || 'U';
  const isActive = user.status === 'Active';
  const roleName = user.role?.name || (typeof user.role === 'string' ? user.role : 'N/A');
  const deptName = user.department?.name || (typeof user.department === 'string' ? user.department : 'N/A');
  const joinedDate = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A';
  const lastLogin = user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never';

  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] max-w-6xl mx-auto space-y-6 pb-20">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#64748B] font-medium pt-2">
          <button onClick={() => navigate('/admin/users')} className="hover:text-[#2563EB] transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">group</span> Users
          </button>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-[#0F172A]">{user.name}</span>
        </div>

        {/* Profile Summary Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm overflow-hidden p-6 sm:p-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-[32px] font-bold shrink-0 relative border border-[#E2E8F0]">
              {initials}
              <div className={`absolute bottom-1 right-1 w-4 h-4 ${isActive ? 'bg-[#16A34A]' : 'bg-[#94A3B8]'} border-2 border-white rounded-full`}></div>
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1.5">
                <h1 className="text-[28px] font-bold tracking-tight text-[#0F172A] leading-none">{user.name}</h1>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[12px] font-semibold ${isActive ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#E2E8F0] text-[#64748B]'}`}>
                  {user.status || 'Active'}
                </span>
              </div>
              <p className="text-[15px] text-[#0F172A] font-medium mb-1">
                {user.designation || 'Employee'} <span className="text-[#CBD5E1] mx-1">•</span> {deptName}
              </p>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-[#64748B] mt-3">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  <a href={`mailto:${user.email}`} className="text-[#2563EB] hover:underline">{user.email}</a>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">badge</span>
                  Role: <span className="font-medium text-[#0F172A] ml-1">{roleName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-3 shrink-0 flex-wrap">
            <button
              onClick={() => navigate(`/admin/users/${id}/edit`)}
              className="border border-[#E2E8F0] bg-white text-[#0F172A] px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 shadow-sm"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span> Edit Profile
            </button>
            <button
              onClick={handleToggleStatus}
              disabled={togglingStatus}
              className={`border px-4 py-2 rounded-lg text-[13px] font-medium transition-colors flex items-center gap-2 shadow-sm disabled:opacity-60 ${
                isActive
                  ? 'border-[#E2E8F0] bg-white text-[#DC2626] hover:bg-[#FEF2F2]'
                  : 'border-[#16A34A] bg-white text-[#16A34A] hover:bg-[#16A34A]/5'
              }`}
            >
              {togglingStatus ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[18px]">{isActive ? 'block' : 'check_circle'}</span>
              )}
              {isActive ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        </div>

        {/* 3-Column Information Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* Column 1: Identity & Contact */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-[14px] font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              <span className="material-symbols-outlined text-[#64748B]">badge</span>
              Identity & Contact
            </h2>
            <div className="space-y-5">
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Employee ID / System ID</span>
                <span className="text-[14px] font-medium text-[#0F172A] font-mono">{user._id?.slice(-8).toUpperCase() || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Email Address</span>
                <a href={`mailto:${user.email}`} className="text-[14px] font-medium text-[#2563EB] hover:underline flex items-center gap-1.5">
                  {user.email}
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </a>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Employment Type</span>
                <span className="text-[14px] font-medium text-[#0F172A]">{user.employmentType || 'Full-time'}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Joined Organization</span>
                <span className="text-[14px] font-medium text-[#0F172A]">{joinedDate}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Corporate Structure */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-6">
            <h2 className="text-[14px] font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              <span className="material-symbols-outlined text-[#64748B]">account_tree</span>
              Corporate Structure
            </h2>
            <div className="space-y-5">
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Department</span>
                <span className="text-[14px] font-medium text-[#0F172A]">{deptName}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Designation</span>
                <span className="text-[14px] font-medium text-[#0F172A]">{user.designation || 'N/A'}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">System Role</span>
                <span className="inline-flex items-center px-2.5 py-1 rounded text-[12px] font-semibold bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                  {roleName}
                </span>
              </div>
            </div>
          </div>

          {/* Column 3: Access & Security */}
          <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-6 space-y-6 relative">
            <button
              onClick={handleResetPassword}
              disabled={resetting}
              className="absolute top-6 right-6 text-[12px] font-semibold text-[#2563EB] hover:underline flex items-center gap-1 disabled:opacity-60"
            >
              {resetting ? (
                <div className="w-3 h-3 border-2 border-[#2563EB] border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[14px]">lock_reset</span>
              )}
              Reset Password
            </button>
            <h2 className="text-[14px] font-bold text-[#0F172A] uppercase tracking-wider flex items-center gap-2 border-b border-[#E2E8F0] pb-3">
              <span className="material-symbols-outlined text-[#64748B]">security</span>
              Access & Security
            </h2>
            <div className="space-y-5">
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Account Status</span>
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-semibold ${isActive ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#E2E8F0] text-[#64748B]'}`}>
                  {user.status || 'Active'}
                </span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Last Login</span>
                <span className="text-[14px] font-medium text-[#0F172A]">{lastLogin}</span>
              </div>
              <div>
                <span className="block text-[12px] font-medium text-[#64748B] mb-1">Role Slug</span>
                <span className="text-[14px] font-mono text-[#475569]">{user.role?.slug || 'N/A'}</span>
              </div>
              {tempPassword && (
                <div className="bg-[#F0FDF4] border border-[#16A34A]/30 rounded-lg p-3 space-y-2">
                  <span className="block text-[11px] font-semibold text-[#16A34A] uppercase tracking-wider">Temporary Password</span>
                  <div className="flex items-center gap-2">
                    <span className="flex-1 font-mono text-[14px] font-bold text-[#0F172A] bg-white border border-[#E2E8F0] rounded px-3 py-1.5 select-all">
                      {tempPassword}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="shrink-0 p-1.5 rounded border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] transition-colors text-[#64748B]"
                      title="Copy password"
                    >
                      {copied ? <Check size={14} className="text-[#16A34A]" /> : <Copy size={14} />}
                    </button>
                  </div>
                  <p className="text-[11px] text-[#64748B]">Share this with the user. It will not be shown again.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-sm p-8">
          <div className="flex justify-between items-center mb-8 border-b border-[#E2E8F0] pb-4">
            <div>
              <h2 className="text-[18px] font-bold text-[#0F172A]">Recent Activity</h2>
              <p className="text-[13px] text-[#64748B] mt-1">Audit log entries related to this user account.</p>
            </div>
            <button
              onClick={() => navigate('/admin/audit')}
              className="border border-[#E2E8F0] text-[#0F172A] px-4 py-2 rounded-lg text-[13px] font-medium hover:bg-[#F8FAFC] transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">history</span> Full Audit Log
            </button>
          </div>

          {activityLogs.length === 0 ? (
            <p className="text-[13px] text-[#64748B] text-center py-8">No recent activity found.</p>
          ) : (
            <div className="relative pl-4 sm:pl-8">
              <div className="absolute left-[27px] sm:left-[43px] top-4 bottom-4 w-[2px] bg-[#E2E8F0]"></div>
              <div className="space-y-8">
                {activityLogs.map((log, idx) => (
                  <div key={log._id || idx} className="relative flex items-start gap-6 group">
                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center border-4 border-white shadow-sm relative z-10 shrink-0 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[18px]">history</span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pt-2 gap-2">
                      <div>
                        <p className="text-[15px] font-medium text-[#0F172A]">{log.action} in {log.module}</p>
                        {log.details && <p className="text-[13px] text-[#64748B] mt-0.5">{log.details}</p>}
                      </div>
                      <span className="text-[13px] font-medium text-[#94A3B8] whitespace-nowrap">
                        {log.timestamp ? new Date(log.timestamp).toLocaleString() : ''}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </PageWrapper>
  );
}
