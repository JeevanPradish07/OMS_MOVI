import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'framer-motion';

export default function PageWrapper({ children }) {
  const [collapsed, setCollapsed] = useState(() => {
    try { return localStorage.getItem('owms_sidebar_collapsed') === 'true'; } catch { return false; }
  });

  const handleSetCollapsed = (val) => {
    setCollapsed(val);
    try { localStorage.setItem('owms_sidebar_collapsed', String(val)); } catch {}
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body">
      <Sidebar collapsed={collapsed} setCollapsed={handleSetCollapsed} />
      <Header sidebarCollapsed={collapsed} />
      <main className={`${collapsed ? 'lg:pl-20' : 'lg:pl-72'} pt-20 min-h-screen overflow-hidden transition-all duration-300`}>
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="p-6 lg:p-8"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
