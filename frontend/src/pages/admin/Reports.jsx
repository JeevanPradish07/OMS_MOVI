import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart2, Users, Shield, Building2,
  Play, Download, Search, X, ChevronDown, ChevronUp,
  RefreshCw, AlertCircle, Lock
} from 'lucide-react';
import PageWrapper from '../../components/PageWrapper';
import { adminAPI } from '../../utils/api';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const ICON_MAP = {
  Users:    <Users size={20} className="text-blue-600" />,
  Building: <Building2 size={20} className="text-violet-600" />,
  Shield:   <Shield size={20} className="text-red-600" />,
  Lock:     <Lock size={20} className="text-orange-600" />,
};

const ICON_BG = {
  Users:    'bg-blue-100',
  Building: 'bg-violet-100',
  Shield:   'bg-red-100',
  Lock:     'bg-orange-100',
};

const CATEGORY_COLOR = {
  'User Reports':       'bg-blue-100 text-blue-700',
  'Department Reports': 'bg-violet-100 text-violet-700',
  'Permission Reports': 'bg-purple-100 text-purple-700',
  'Security Reports':   'bg-red-100 text-red-700',
};

const RESULT_COLOR = {
  SUCCESS: 'bg-[#DCFCE7] text-[#16A34A]',
  FAILED:  'bg-[#FEE2E2] text-[#DC2626]',
  WARNING: 'bg-[#FEF3C7] text-[#D97706]',
};

const fmt = (val) => (val === undefined || val === null || val === '') ? '—' : String(val);

// ─── Report type card ─────────────────────────────────────────────────────────
const ReportCard = ({ report, onRun }) => (
  <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col gap-4 hover:border-[#2563EB]/40 hover:shadow-sm transition-all">
    <div className="flex items-start justify-between gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${ICON_BG[report.icon] || 'bg-gray-100'}`}>
        {ICON_MAP[report.icon] || <BarChart2 size={20} className="text-gray-600" />}
      </div>
      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${CATEGORY_COLOR[report.category] || 'bg-gray-100 text-gray-700'}`}>
        {report.category}
      </span>
    </div>
    <div>
      <h3 className="text-[15px] font-semibold text-[#0F172A] mb-1">{report.name}</h3>
      <p className="text-[13px] text-[#64748B] leading-relaxed">{report.description}</p>
    </div>
    <div className="mt-auto pt-2 border-t border-[#F1F5F9]">
      <div className="flex flex-wrap gap-1.5 mb-3">
        {report.filters.map(f => (
          <span key={f} className="text-[11px] bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] px-2 py-0.5 rounded">
            {f === 'dateFrom' ? 'Date From' : f === 'dateTo' ? 'Date To' : f.charAt(0).toUpperCase() + f.slice(1)}
          </span>
        ))}
      </div>
      <button
        onClick={() => onRun(report)}
        className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[13px] font-medium py-2 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <Play size={14} /> Run Report
      </button>
    </div>
  </div>
);

// ─── Filter panel ─────────────────────────────────────────────────────────────
const FilterPanel = ({ report, filters, setFilters, departments, roles, onGenerate, onCancel, generating }) => {
  const has = (f) => report.filters.includes(f);
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[14px] font-semibold text-[#0F172A]">
          Configure: <span className="text-[#2563EB]">{report.name}</span>
        </h3>
        <button onClick={onCancel} className="text-[#64748B] hover:text-[#0F172A] transition-colors">
          <X size={18} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {has('dateFrom') && (
          <div>
            <label className="block text-[12px] font-medium text-[#64748B] mb-1">From Date</label>
            <input
              type="date" value={filters.dateFrom || ''}
              onChange={e => setFilters(f => ({ ...f, dateFrom: e.target.value }))}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-[13px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] bg-white"
            />
          </div>
        )}
        {has('dateTo') && (
          <div>
            <label className="block text-[12px] font-medium text-[#64748B] mb-1">To Date</label>
            <input
              type="date" value={filters.dateTo || ''}
              onChange={e => setFilters(f => ({ ...f, dateTo: e.target.value }))}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-[13px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] bg-white"
            />
          </div>
        )}
        {has('department') && (
          <div>
            <label className="block text-[12px] font-medium text-[#64748B] mb-1">Department</label>
            <select
              value={filters.department || ''}
              onChange={e => setFilters(f => ({ ...f, department: e.target.value }))}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-[13px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] bg-white cursor-pointer"
            >
              <option value="">All Departments</option>
              {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
            </select>
          </div>
        )}
        {has('role') && (
          <div>
            <label className="block text-[12px] font-medium text-[#64748B] mb-1">Role</label>
            <select
              value={filters.role || ''}
              onChange={e => setFilters(f => ({ ...f, role: e.target.value }))}
              className="w-full border border-[#E2E8F0] rounded-lg px-3 py-2 text-[13px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] bg-white cursor-pointer"
            >
              <option value="">All Roles</option>
              {roles.map(r => <option key={r._id} value={r._id}>{r.name}</option>)}
            </select>
          </div>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={onGenerate} disabled={generating}
          className="bg-[#2563EB] hover:bg-[#1D4ED8] disabled:opacity-60 text-white text-[13px] font-medium px-5 py-2 rounded-lg transition-colors flex items-center gap-2"
        >
          {generating ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Generating...</>
          ) : (
            <><Play size={14} /> Generate Report</>
          )}
        </button>
        <button
          onClick={onCancel}
          className="text-[13px] font-medium text-[#64748B] hover:text-[#0F172A] transition-colors px-4 py-2"
        >
          Cancel
        </button>
      </div>
    </motion.div>
  );
};

// ─── Summary metrics strip ────────────────────────────────────────────────────
const SummaryStrip = ({ summary }) => {
  const entries = Object.entries(summary);
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-lg px-6 py-3 flex flex-wrap gap-6 items-center shadow-sm">
      {entries.map(([key, val], i) => (
        <div key={key} className="flex items-center gap-3">
          {i > 0 && <div className="w-[1px] h-4 bg-[#E2E8F0]" />}
          <div>
            <div className="text-[11px] text-[#64748B] font-medium capitalize">
              {key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
            </div>
            <div className="text-[18px] font-bold text-[#0F172A]">{fmt(val)}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── Results table ────────────────────────────────────────────────────────────
const ResultsTable = ({ columns, rows, searchQuery }) => {
  const filtered = searchQuery
    ? rows.filter(row => Object.values(row).some(v => String(v).toLowerCase().includes(searchQuery.toLowerCase())))
    : rows;

  if (filtered.length === 0) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl py-16 flex flex-col items-center justify-center text-center">
        <Search size={40} className="text-[#CBD5E1] mb-3" />
        <p className="text-[15px] font-medium text-[#0F172A] mb-1">No data found</p>
        <p className="text-[13px] text-[#64748B]">
          {searchQuery ? 'No rows match your search.' : 'No records match the selected filters.'}
        </p>
      </div>
    );
  }

  // Map column display names to row keys
  const fieldKeys = columns.map(col => {
    const clean = col.toLowerCase().replace(/[^a-z]/g, '');
    // Find best matching key in first row
    const firstRow = rows[0] || {};
    const match = Object.keys(firstRow).find(k => k.toLowerCase().replace(/[^a-z]/g, '') === clean);
    return match || clean;
  });

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
              {columns.map(col => (
                <th key={col} className="px-4 py-3 text-[11px] font-semibold text-[#64748B] uppercase tracking-wider whitespace-nowrap">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((row, i) => (
              <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors">
                {fieldKeys.map((key, j) => {
                  const val = row[key];
                  // Special rendering for result/status badges
                  if (key === 'result' || key === 'status') {
                    const color = RESULT_COLOR[val] || (val === 'Active' ? 'bg-[#DCFCE7] text-[#16A34A]' : 'bg-[#F1F5F9] text-[#64748B]');
                    return (
                      <td key={j} className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${color}`}>
                          {fmt(val)}
                        </span>
                      </td>
                    );
                  }
                  if (key === 'activeratio' || key === 'activeRatio') {
                    return (
                      <td key={j} className="px-4 py-3 whitespace-nowrap">
                        <span className="text-[13px] font-semibold text-[#2563EB]">{fmt(val)}</span>
                      </td>
                    );
                  }
                  return (
                    <td key={j} className="px-4 py-3 text-[13px] text-[#0F172A] whitespace-nowrap max-w-[280px] truncate" title={fmt(val)}>
                      {fmt(val)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-[#F8FAFC] border-t border-[#E2E8F0] px-4 py-2.5 text-[12px] text-[#64748B]">
        {filtered.length} of {rows.length} row{rows.length !== 1 ? 's' : ''}
        {searchQuery && ` matching "${searchQuery}"`}
      </div>
    </div>
  );
};

// ─── Results panel ────────────────────────────────────────────────────────────
const ResultsPanel = ({ result, onExport, exporting }) => {
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-4"
    >
      {/* Panel header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-[15px] font-semibold text-[#0F172A]">{result.title}</h3>
          <p className="text-[12px] text-[#64748B] mt-0.5">
            Generated {new Date(result.generatedAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}
            {' · '}{result.rows?.length ?? 0} row{(result.rows?.length ?? 0) !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onExport} disabled={exporting}
            className="border border-[#E2E8F0] bg-white text-[#0F172A] text-[13px] font-medium px-4 py-2 rounded-lg hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 disabled:opacity-60"
          >
            {exporting ? <div className="w-3.5 h-3.5 border-2 border-[#64748B] border-t-transparent rounded-full animate-spin" /> : <Download size={14} />}
            Export CSV
          </button>
          <button
            onClick={() => setExpanded(e => !e)}
            className="p-2 border border-[#E2E8F0] bg-white rounded-lg text-[#64748B] hover:bg-[#F8FAFC] transition-colors"
          >
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden flex flex-col gap-4"
          >
            {/* Summary */}
            {result.summary && Object.keys(result.summary).length > 0 && (
              <SummaryStrip summary={result.summary} />
            )}

            {/* Search within results */}
            {result.rows?.length > 0 && (
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={15} />
                <input
                  type="text" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search within results..."
                  className="w-full border border-[#E2E8F0] rounded-lg pl-9 pr-4 py-2 text-[13px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] bg-white"
                />
              </div>
            )}

            {/* Data table */}
            {result.columns && result.rows && (
              <ResultsTable columns={result.columns} rows={result.rows} searchQuery={search} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminReports() {
  const [reportTypes, setReportTypes]   = useState([]);
  const [loading, setLoading]           = useState(true);
  const [loadError, setLoadError]       = useState(null);
  const [departments, setDepartments]   = useState([]);
  const [roles, setRoles]               = useState([]);

  // Active run state
  const [activeReport, setActiveReport] = useState(null);   // report type def
  const [filters, setFilters]           = useState({});
  const [generating, setGenerating]     = useState(false);
  const [genError, setGenError]         = useState(null);
  const [result, setResult]             = useState(null);   // latest run result

  // Export state
  const [exporting, setExporting]       = useState(false);

  // Search across all cards
  const [cardSearch, setCardSearch]     = useState('');

  const fetchMeta = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const [typesRes, deptsRes, rolesRes] = await Promise.all([
        adminAPI.getReportTypes(),
        adminAPI.getDepartments(),
        adminAPI.getRoles(),
      ]);
      setReportTypes(typesRes.data?.data || []);
      setDepartments(deptsRes.data?.data || []);
      setRoles(rolesRes.data?.data || []);
    } catch (err) {
      setLoadError('Failed to load reports. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchMeta(); }, [fetchMeta]);

  const handleRun = (report) => {
    setActiveReport(report);
    setFilters({});
    setResult(null);
    setGenError(null);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenError(null);
    setResult(null);
    try {
      const res = await adminAPI.runReport(activeReport.type, filters);
      setResult(res.data?.data || null);
    } catch (err) {
      setGenError(err.response?.data?.message || 'Failed to generate report. Please try again.');
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async () => {
    if (!activeReport) return;
    setExporting(true);
    try {
      const res = await adminAPI.exportReport(activeReport.type, filters);
      const blob = new Blob([res.data], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `OWMS_${activeReport.type}_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setGenError('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleCancel = () => {
    setActiveReport(null);
    setResult(null);
    setGenError(null);
    setFilters({});
  };

  const visibleTypes = cardSearch
    ? reportTypes.filter(r =>
        r.name.toLowerCase().includes(cardSearch.toLowerCase()) ||
        r.description.toLowerCase().includes(cardSearch.toLowerCase()) ||
        r.category.toLowerCase().includes(cardSearch.toLowerCase())
      )
    : reportTypes;

  return (
    <PageWrapper>
      <div className="font-sans text-[#0F172A] w-full flex flex-col gap-6 pb-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#0F172A]">Reports</h1>
            <p className="text-sm text-[#64748B] mt-1">Generate and export administrative data reports from live system data.</p>
          </div>
          <button
            onClick={fetchMeta}
            className="border border-[#E2E8F0] text-[#0F172A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#F8FAFC] transition-colors flex items-center gap-2 self-start sm:self-auto"
          >
            <RefreshCw size={15} /> Refresh
          </button>
        </div>

        {/* Load error */}
        {loadError && (
          <div className="bg-[#FEF2F2] border border-[#DC2626] rounded-lg p-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-[#DC2626]">
              <AlertCircle size={16} />
              <span className="text-[13px] font-medium">{loadError}</span>
            </div>
            <button onClick={fetchMeta} className="text-[13px] font-medium text-[#DC2626] underline">Retry</button>
          </div>
        )}

        {/* Search across cards */}
        {!loading && reportTypes.length > 0 && (
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={17} />
            <input
              type="text" value={cardSearch} onChange={e => setCardSearch(e.target.value)}
              placeholder="Search report types..."
              className="w-full bg-white border border-[#E2E8F0] rounded-lg pl-11 pr-4 py-2.5 text-[14px] text-[#0F172A] focus:outline-none focus:border-[#2563EB] focus:ring-1 focus:ring-[#2563EB] transition-colors"
            />
          </div>
        )}

        {/* Report type cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-[#E2E8F0] rounded-xl p-5 flex flex-col gap-4 animate-pulse">
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 rounded-lg bg-[#F1F5F9]" />
                  <div className="h-5 w-24 bg-[#F1F5F9] rounded" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-[#F1F5F9] rounded w-3/4" />
                  <div className="h-3 bg-[#F1F5F9] rounded w-full" />
                  <div className="h-3 bg-[#F1F5F9] rounded w-2/3" />
                </div>
                <div className="h-9 bg-[#F1F5F9] rounded-lg mt-auto" />
              </div>
            ))}
          </div>
        ) : visibleTypes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {visibleTypes.map(report => (
              <ReportCard key={report.type} report={report} onRun={handleRun} />
            ))}
          </div>
        ) : !loadError && (
          <div className="bg-white border border-[#E2E8F0] rounded-xl py-16 flex flex-col items-center justify-center text-center">
            <BarChart2 size={40} className="text-[#CBD5E1] mb-3" />
            <p className="text-[15px] font-medium text-[#0F172A] mb-1">No report types found</p>
            <p className="text-[13px] text-[#64748B]">
              {cardSearch ? `No reports match "${cardSearch}"` : 'No reports are available.'}
            </p>
            {cardSearch && (
              <button onClick={() => setCardSearch('')} className="text-[13px] text-[#2563EB] hover:underline mt-2">
                Clear search
              </button>
            )}
          </div>
        )}

        {/* Filter panel + results (shown when a report is active) */}
        <AnimatePresence>
          {activeReport && (
            <div className="flex flex-col gap-5">
              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-[1px] bg-[#E2E8F0]" />
                <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">Configure & Run</span>
                <div className="flex-1 h-[1px] bg-[#E2E8F0]" />
              </div>

              <FilterPanel
                report={activeReport}
                filters={filters} setFilters={setFilters}
                departments={departments} roles={roles}
                onGenerate={handleGenerate} onCancel={handleCancel}
                generating={generating}
              />

              {/* Generation error */}
              {genError && (
                <div className="bg-[#FEF2F2] border border-[#DC2626] rounded-lg p-3 flex items-center gap-2">
                  <AlertCircle size={15} className="text-[#DC2626] shrink-0" />
                  <span className="text-[13px] text-[#DC2626] font-medium">{genError}</span>
                </div>
              )}

              {/* Results */}
              {result && (
                <ResultsPanel
                  result={result}
                  onExport={handleExport}
                  exporting={exporting}
                />
              )}
            </div>
          )}
        </AnimatePresence>

      </div>
    </PageWrapper>
  );
}
