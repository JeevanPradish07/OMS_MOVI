import { useEffect, useState } from 'react';
import { tasksAPI } from '../../api';
import PageWrapper from '../../components/PageWrapper';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';
import toast from 'react-hot-toast';

export default function PMOApprovals() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tasksAPI.getAll({ status: 'review' }).then(r => setTasks(r.data.data)).finally(() => setLoading(false));
  }, []);

  const handleAction = async (id, action) => {
    try {
      if (action === 'approve') await tasksAPI.approve(id);
      else await tasksAPI.reject(id);
      setTasks(p => p.filter(t => t._id !== id));
      toast.success(`Task ${action}d`);
    } catch { toast.error('Action failed'); }
  };

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="font-headline font-bold text-2xl text-slate-900">Approvals</h1>
          <p className="text-slate-500 text-sm mt-1">Review and approve intern task submissions</p>
        </div>

        {loading ? <LoadingSpinner /> : (
          <div className="space-y-4">
            {tasks.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <span className="material-symbols-outlined text-5xl mb-3 block">approval</span>
                <p className="font-semibold">No pending approvals</p>
                <p className="text-sm mt-1">Submissions will appear here when interns mark tasks as "review"</p>
              </div>
            )}
            {tasks.map(t => (
              <div key={t._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900">{t.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{t.assignedTo?.name} · {t.project?.name || 'No project'} · <StatusBadge status={t.priority?.toLowerCase()} /></p>
                    {t.description && <p className="text-sm text-slate-600 mt-3 leading-relaxed">{t.description}</p>}
                  </div>
                  <div className="flex gap-2 ml-4 flex-shrink-0">
                    <button
                      onClick={() => handleAction(t._id, 'approve')}
                      className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-xl text-sm font-bold hover:bg-emerald-200 transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-base">check_circle</span> Approve
                    </button>
                    <button
                      onClick={() => handleAction(t._id, 'reject')}
                      className="px-4 py-2 bg-rose-100 text-rose-700 rounded-xl text-sm font-bold hover:bg-rose-200 transition-colors flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-base">cancel</span> Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
