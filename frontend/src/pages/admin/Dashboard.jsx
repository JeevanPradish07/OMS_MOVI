import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/PageWrapper';
import { adminAPI } from '../../utils/api';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [metrics, setMetrics] = useState({ totalUsers: null, totalRoles: null });
  const [activityFeed, setActivityFeed] = useState([]);
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [activityLoading, setActivityLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      setMetricsLoading(true);
      try {
        const [usersRes, rolesRes] = await Promise.all([
          adminAPI.getUsers({ limit: 1 }),
          adminAPI.getRoles(),
        ]);
        setMetrics({
          totalUsers: usersRes.data.pagination?.total ?? usersRes.data.data?.length ?? 0,
          totalRoles: rolesRes.data.data?.length ?? 0,
        });
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setMetricsLoading(false);
      }
    };

    const fetchActivity = async () => {
      setActivityLoading(true);
      try {
        const res = await adminAPI.getAuditLogs({ limit: 10 });
        setActivityFeed(res.data.data || []);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      } finally {
        setActivityLoading(false);
      }
    };

    fetchMetrics();
    fetchActivity();
  }, []);

  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] max-w-[1440px] mx-auto space-y-6 pb-10">
        
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E2E8F0] pb-4 h-auto sm:h-[64px] shrink-0">
          <div>
            <h1 className="text-[24px] font-semibold tracking-tight text-[#0F172A]">Administration Dashboard</h1>
            <p className="text-[14px] text-[#64748B] mt-0.5">Manage system operations, users, and organizational security.</p>
          </div>
          <div className="text-[13px] font-medium text-[#64748B] mt-4 sm:mt-0 flex items-center gap-4">
            <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {/* SECTION 1: Overview Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-[#E2E8F0] rounded-md p-4 shadow-sm flex flex-col justify-between h-[96px]">
            <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Total Users</span>
            <div className="flex items-end justify-between">
              {metricsLoading ? (
                <div className="h-6 w-12 bg-[#E2E8F0] rounded animate-pulse" />
              ) : (
                <span className="text-[24px] font-medium text-[#0F172A] leading-none">{metrics.totalUsers ?? '—'}</span>
              )}
            </div>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-md p-4 shadow-sm flex flex-col justify-between h-[96px]">
            <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Active Sessions</span>
            <div className="flex items-end justify-between">
              {/* TODO: No backend endpoint for active sessions yet */}
              <span className="text-[13px] text-[#94A3B8] italic">Not connected</span>
            </div>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-md p-4 shadow-sm flex flex-col justify-between h-[96px]">
            <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Roles</span>
            <div className="flex items-end justify-between">
              {metricsLoading ? (
                <div className="h-6 w-8 bg-[#E2E8F0] rounded animate-pulse" />
              ) : (
                <span className="text-[24px] font-medium text-[#0F172A] leading-none">{metrics.totalRoles ?? '—'}</span>
              )}
            </div>
          </div>
          <div className="bg-white border border-[#E2E8F0] rounded-md p-4 shadow-sm flex flex-col justify-between h-[96px]">
            <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Pending Requests</span>
            <div className="flex items-end justify-between">
              {/* TODO: No backend endpoint for pending requests yet */}
              <span className="text-[13px] text-[#94A3B8] italic">Not connected</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* SECTION 3: Recent Administrative Activity */}
            <div className="bg-white border border-[#E2E8F0] rounded-md shadow-sm flex flex-col">
              <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] rounded-t-md flex justify-between items-center">
                <h2 className="text-[16px] font-semibold text-[#0F172A]">Recent Administrative Activity</h2>
                <button onClick={() => navigate('/admin/audit')} className="text-[13px] font-medium text-[#2563EB] hover:underline">View All Activity</button>
              </div>
              <div className="p-0 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] bg-white">
                      <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase w-[200px]">Timestamp</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase w-[180px]">User</th>
                      <th className="px-5 py-3 text-[12px] font-semibold text-[#64748B] uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityLoading ? (
                      [...Array(5)].map((_, i) => (
                        <tr key={i} className="border-b border-[#F1F5F9] animate-pulse">
                          <td className="px-5 py-3.5"><div className="h-4 bg-[#E2E8F0] rounded w-32" /></td>
                          <td className="px-5 py-3.5"><div className="h-4 bg-[#E2E8F0] rounded w-24" /></td>
                          <td className="px-5 py-3.5"><div className="h-4 bg-[#E2E8F0] rounded w-48" /></td>
                        </tr>
                      ))
                    ) : activityFeed.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-5 py-10 text-center text-[#94A3B8] text-sm">
                          No recent activity found.
                        </td>
                      </tr>
                    ) : activityFeed.map((log) => (
                      <tr key={log._id} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors last:border-0">
                        <td className="px-5 py-3.5 text-[13px] text-[#64748B]">
                          {log.createdAt ? new Date(log.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : '—'}
                        </td>
                        <td className="px-5 py-3.5 text-[13px] font-medium text-[#0F172A]">
                          {log.user?.name || log.performedBy?.name || 'System'}
                        </td>
                        <td className="px-5 py-3.5 text-[13px] text-[#475569]">
                          {log.action}{log.resource ? ` — ${log.resource}` : ''}{log.details ? `: ${log.details}` : ''}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6">

            {/* SECTION 2: Pending Actions */}
            <div className="bg-white border border-[#E2E8F0] rounded-md shadow-sm">
              <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] rounded-t-md">
                <h2 className="text-[16px] font-semibold text-[#0F172A]">Pending Actions</h2>
              </div>
              <div className="p-0">
                <div className="divide-y divide-[#E2E8F0]">
                  <div className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#E0E7FF] text-[#4338CA] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">vpn_key</span>
                      </div>
                      <div>
                        <h3 className="text-[13px] font-semibold text-[#0F172A]">Access Requests</h3>
                        <p className="text-[12px] text-[#64748B]">3 pending system access requests</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#64748B] group-hover:text-[#2563EB] transition-colors">chevron_right</span>
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">badge</span>
                      </div>
                      <div>
                        <h3 className="text-[13px] font-semibold text-[#0F172A]">Role Changes</h3>
                        <p className="text-[12px] text-[#64748B]">2 users awaiting role assignments</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#64748B] group-hover:text-[#2563EB] transition-colors">chevron_right</span>
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">person_check</span>
                      </div>
                      <div>
                        <h3 className="text-[13px] font-semibold text-[#0F172A]">Account Activations</h3>
                        <p className="text-[12px] text-[#64748B]">1 new account awaiting activation</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#64748B] group-hover:text-[#2563EB] transition-colors">chevron_right</span>
                  </div>
                  <div className="p-4 flex items-center justify-between hover:bg-[#F8FAFC] transition-colors cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-[#F1F5F9] text-[#475569] flex items-center justify-center">
                        <span className="material-symbols-outlined text-[16px]">rule</span>
                      </div>
                      <div>
                        <h3 className="text-[13px] font-semibold text-[#0F172A]">Permission Reviews</h3>
                        <p className="text-[12px] text-[#64748B]">2 groups require auditing</p>
                      </div>
                    </div>
                    <span className="material-symbols-outlined text-[#64748B] group-hover:text-[#2563EB] transition-colors">chevron_right</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: System Status */}
            <div className="bg-white border border-[#E2E8F0] rounded-md shadow-sm">
              <div className="px-5 py-4 border-b border-[#E2E8F0] bg-[#F8FAFC] rounded-t-md">
                <h2 className="text-[16px] font-semibold text-[#0F172A]">System Status</h2>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-[#F1F5F9] last:border-0 last:pb-0">
                  <span className="text-[13px] text-[#64748B]">Database Status</span>
                  <span className="text-[13px] font-medium text-[#16A34A] flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#16A34A]"></span> Healthy</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#F1F5F9] last:border-0 last:pb-0">
                  <span className="text-[13px] text-[#64748B]">API Availability</span>
                  <span className="text-[13px] font-medium text-[#16A34A] flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#16A34A]"></span> Online</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#F1F5F9] last:border-0 last:pb-0">
                  <span className="text-[13px] text-[#64748B]">Storage Utilization</span>
                  <span className="text-[13px] font-medium text-[#D97706] flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#F59E0B]"></span> 68%</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#F1F5F9] last:border-0 last:pb-0">
                  <span className="text-[13px] text-[#64748B]">Last Backup</span>
                  <span className="text-[13px] font-medium text-[#0F172A]">Today, 02:00 AM</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[#F1F5F9] last:border-0 last:pb-0">
                  <span className="text-[13px] text-[#64748B]">Application Version</span>
                  <span className="text-[13px] font-medium text-[#0F172A]">v2.4.1</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </PageWrapper>
  );
}
