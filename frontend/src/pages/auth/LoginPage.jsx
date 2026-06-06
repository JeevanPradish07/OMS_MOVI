import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const ROLES = [
  { id: 'intern', icon: 'school', label: 'Intern', desc: 'Access learning modules, task tracking, and mentorship portals.' },
  { id: 'hr', icon: 'groups', label: 'HR', desc: 'Manage talent acquisition, employee relations, and benefits.' },
  { id: 'pmo', icon: 'account_tree', label: 'PMO', desc: 'Oversee project health, resource allocation, and timelines.' },
  { id: 'admin', icon: 'admin_panel_settings', label: 'System Admin', desc: 'Full access to system configurations, security, and logs.' },
];

const ROLE_HOME = { intern: '/intern/dashboard', hr: '/hr/dashboard', pmo: '/pmo/dashboard', admin: '/admin/dashboard' };

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('intern');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedRole) { toast.error('Please select a role first'); return; }
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success(`Welcome back, ${user.name}!`);
      navigate(ROLE_HOME[user.role]);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="font-body text-on-surface min-h-screen flex flex-col relative bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: "url('/assets/conference-bg.jpg')" }}
    >
      <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-[6px] pointer-events-none z-0" />
      
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-md w-full border-b border-white/10 relative z-20">
        <div className="flex items-center justify-between px-6 py-4 sm:px-10 sm:py-5 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-2">
            <img src="/assets/logo.png" alt="Movi Cloud Labs" className="h-14 w-auto object-contain" />
            <span className="text-2xl font-bold text-white font-headline tracking-tight">Movi Cloud Labs</span>
          </div>
          <span className="text-sm text-slate-200 font-medium hidden md:block">Enterprise Operation System v2.4</span>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-4 sm:py-6 relative z-10">
        <div className="w-full max-w-md mx-auto relative">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-white/20 relative overflow-hidden transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary" />
            
            {/* Header / Logo */}
            <div className="text-center mb-6">
              <div className="flex justify-center items-center gap-2 mb-3">
                <img src="/assets/logo.png" alt="Movi Cloud Labs" className="h-10 w-auto object-contain" />
                <span className="text-xl font-extrabold text-slate-900 font-headline tracking-tight">OWMS Portal</span>
              </div>
              <h2 className="font-headline font-bold text-2xl text-slate-800">Sign In</h2>
              <p className="text-slate-500 text-sm mt-1.5 font-semibold">Select your role and enter credentials</p>
            </div>

            {/* Role Select Tabs */}
            <div className="space-y-2 mb-6">
              <label className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-slate-500 pl-1 block">Workspace Identity</label>
              <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100/80 rounded-2xl border border-slate-200/20">
                {ROLES.map(({ id, icon, label }) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setSelectedRole(id)}
                    className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl transition-all duration-300 outline-none
                      ${selectedRole === id 
                        ? 'bg-white text-primary shadow-sm font-bold scale-[1.02]' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-white/40'}`}
                  >
                    <span className="material-symbols-outlined text-lg sm:text-xl" style={{ fontVariationSettings: selectedRole === id ? "'FILL' 1" : "'FILL' 0" }}>{icon}</span>
                    <span className="text-xs sm:text-sm font-bold tracking-tight whitespace-nowrap">{label === 'System Admin' ? 'Admin' : label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Login Form */}
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-slate-500 pl-1">Email Address</label>
                <input
                  className="w-full bg-slate-50/50 border border-slate-200/50 rounded-2xl px-4 py-3.5 focus:bg-white focus:ring-2 focus:ring-primary/20 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-semibold outline-none transition-all"
                  placeholder="name@movicloudlabs.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm uppercase tracking-wider font-extrabold text-slate-500 pl-1">Password</label>
                <div className="relative">
                  <input
                    className="w-full bg-slate-50/50 border border-slate-200/50 rounded-2xl px-4 py-3.5 pr-14 focus:bg-white focus:ring-2 focus:ring-primary/20 text-slate-900 placeholder:text-slate-400 text-sm sm:text-base font-semibold outline-none transition-all"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                    onClick={() => setShowPassword(p => !p)}
                  >
                    <span className="material-symbols-outlined text-lg">{showPassword ? 'visibility_off' : 'visibility'}</span>
                  </button>
                </div>
              </div>

              {selectedRole && (
                <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-xs sm:text-sm text-slate-600 font-semibold leading-relaxed flex gap-2.5 items-start animate-in fade-in duration-300">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>info</span>
                  <div>
                    <span className="text-slate-900 font-extrabold block mb-0.5">Workspace Scope:</span>
                    {ROLES.find(r => r.id === selectedRole)?.desc}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-3 sm:py-3.5 text-sm sm:text-base font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <><div className="spinner" /> Signing in...</>
                ) : (
                  selectedRole
                    ? `Sign In as ${ROLES.find(r => r.id === selectedRole)?.label}`
                    : 'Sign In'
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      <footer className="bg-black/20 backdrop-blur-md border-t border-white/10 relative z-20">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 py-4 sm:px-10 sm:py-5 max-w-screen-2xl mx-auto gap-4">
          <span className="text-sm text-slate-300 font-medium">© 2024 Movi Cloud Labs. All rights reserved.</span>
          <div className="flex gap-8">
            <a className="text-sm text-slate-300 hover:text-white font-medium transition-colors" href="#">Privacy Policy</a>
            <a className="text-sm text-slate-300 hover:text-white font-medium transition-colors" href="#">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
