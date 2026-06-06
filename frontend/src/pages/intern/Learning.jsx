import { useEffect, useState } from 'react';
import { resourcesAPI } from '../../api';
import PageWrapper from '../../components/PageWrapper';
import LoadingSpinner from '../../components/LoadingSpinner';

const CATEGORIES = ['All', 'Video', 'Article', 'Course', 'Tool', 'Other'];
const DIFF_COLORS = { Beginner: 'badge-done', Intermediate: 'badge-in_progress', Advanced: 'badge-overdue' };
const CAT_ICONS = { Video: 'play_circle', Article: 'article', Course: 'school', Tool: 'build', Other: 'category' };

export default function InternLearning() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  useEffect(() => {
    resourcesAPI.getAll().then(r => setResources(r.data.data)).finally(() => setLoading(false));
  }, []);

  const filtered = resources.filter(r => {
    const matchCat = activeCategory === 'All' || r.category === activeCategory;
    const matchSearch = r.title.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <PageWrapper>
      <div className="space-y-8">
        <div>
          <h1 className="font-headline font-bold text-2xl text-slate-900">Learning Resources</h1>
          <p className="text-slate-500 text-sm mt-1">Curated materials to accelerate your growth</p>
        </div>

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <div className="bg-white border border-slate-200 rounded-2xl p-1 flex gap-1">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setActiveCategory(c)}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === c ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'text-slate-500 hover:bg-slate-50'}`}>
                {c}
              </button>
            ))}
          </div>
          <input
            className="bg-white border border-slate-200 rounded-2xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 ml-auto"
            placeholder="Search resources..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? <LoadingSpinner text="Loading resources..." /> : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered.length === 0 ? (
              <p className="text-slate-400 text-sm col-span-3 text-center py-12">No resources found.</p>
            ) : filtered.map(r => (
              <div key={r._id} className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 hover:shadow-lg transition-all group">
                {r.isFeatured && (
                  <div className="flex items-center gap-1 mb-3">
                    <span className="material-symbols-outlined text-amber-500 text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Featured</span>
                  </div>
                )}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">{CAT_ICONS[r.category] || 'category'}</span>
                  </div>
                  <div>
                    <span className={`badge ${DIFF_COLORS[r.difficulty] || 'badge-pending'}`}>{r.difficulty}</span>
                  </div>
                </div>
                <h3 className="font-headline font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors">{r.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4">{r.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  {r.duration && (
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium">
                      <span className="material-symbols-outlined text-sm">schedule</span> {r.duration}
                    </span>
                  )}
                  {r.url && (
                    <a href={r.url} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 text-primary text-xs font-bold hover:underline ml-auto">
                      Open <span className="material-symbols-outlined text-sm">open_in_new</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
