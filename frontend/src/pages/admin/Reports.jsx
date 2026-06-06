import { useEffect, useState } from 'react';
import { adminAPI } from '../../api';
import PageWrapper from '../../components/PageWrapper';
import LoadingSpinner from '../../components/LoadingSpinner';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#4E73F8', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function AdminReports() {
  const [kpis, setKpis] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([adminAPI.kpis(), adminAPI.analytics()])
      .then(([k, a]) => { setKpis(k.data.data); setAnalytics(a.data.data); })
      .finally(() => setLoading(false));
  }, []);

  const taskData = kpis?.tasksByStatus?.map(({ _id, count }) => ({ name: _id.replace('_', ' '), value: count })) || [];
  const roleData = kpis?.usersByRole?.map(({ _id, count }) => ({ name: _id, value: count })) || [];
  const topPerformers = analytics?.topPerformers?.map(p => ({ name: p.user?.name || 'Unknown', tasks: p.completedTasks })) || [];

  return (
    <PageWrapper>
      <div className="space-y-8">
        <div>
          <h1 className="font-headline font-bold text-2xl text-slate-900">Reports & Analytics</h1>
          <p className="text-slate-500 text-sm mt-1">System-wide data insights</p>
        </div>

        {loading ? <LoadingSpinner text="Generating reports..." /> : (
          <>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <p className="text-slate-500 text-sm font-medium">Tasks completed in last 7 days</p>
              <p className="text-5xl font-black text-primary mt-1">{analytics?.recentCompletions ?? 0}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Task Status Pie */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-4">Tasks by Status</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={taskData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                      {taskData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Users by Role Pie */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-4">Users by Role</h3>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie data={roleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`} fontSize={11}>
                      {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Top performers bar */}
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h3 className="font-bold text-slate-900 mb-4">Top Performers</h3>
                {topPerformers.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-8">No completed tasks yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={topPerformers} layout="vertical" margin={{ left: 10 }}>
                      <XAxis type="number" tick={{ fontSize: 11 }} />
                      <YAxis dataKey="name" type="category" tick={{ fontSize: 11 }} width={80} />
                      <Tooltip />
                      <Bar dataKey="tasks" fill="#4E73F8" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </PageWrapper>
  );
}
