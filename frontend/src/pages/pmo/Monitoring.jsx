import { useEffect, useState } from 'react';
import { projectsAPI } from '../../api';
import PageWrapper from '../../components/PageWrapper';
import LoadingSpinner from '../../components/LoadingSpinner';
import StatusBadge from '../../components/StatusBadge';

export default function PMOMonitoring() {
  const [projects, setProjects] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    projectsAPI.getAll().then(async res => {
      const projs = res.data.data;
      setProjects(projs);
      const prog = {};
      await Promise.all(projs.map(async p => {
        const r = await projectsAPI.progress(p._id);
        prog[p._id] = r.data.data;
      }));
      setProgress(prog);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <PageWrapper>
      <div className="space-y-6">
        <div>
          <h1 className="font-headline font-bold text-2xl text-slate-900">Project Monitoring</h1>
          <p className="text-slate-500 text-sm mt-1">Real-time task progress per project</p>
        </div>

        {loading ? <LoadingSpinner /> : projects.map(p => {
          const prog = progress[p._id] || { total: 0, done: 0, inProgress: 0, pending: 0, progress: 0 };
          return (
            <div key={p._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-slate-400 font-mono">#{p.code}</span>
                    <StatusBadge status={p.health} />
                  </div>
                  <h3 className="font-headline font-bold text-lg text-slate-900">{p.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-primary">{prog.progress}%</p>
                  <p className="text-xs text-slate-400">Complete</p>
                </div>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 mb-5">
                <div className="bg-gradient-to-r from-primary to-blue-400 rounded-full h-3 transition-all duration-500"
                  style={{ width: `${prog.progress}%` }} />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[['Total', prog.total, 'text-slate-700'], ['Done', prog.done, 'text-emerald-600'], ['In Progress', prog.inProgress, 'text-blue-600'], ['Pending', prog.pending, 'text-slate-400']].map(([l, v, c]) => (
                  <div key={l} className="text-center">
                    <p className={`text-xl font-black ${c}`}>{v}</p>
                    <p className="text-xs text-slate-400 font-medium">{l}</p>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {!loading && projects.length === 0 && <p className="text-slate-400 text-sm text-center py-12">No projects to monitor.</p>}
      </div>
    </PageWrapper>
  );
}
