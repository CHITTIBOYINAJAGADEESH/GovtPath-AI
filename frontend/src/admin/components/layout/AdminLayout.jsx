import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import GlobalSearchModal from '../common/GlobalSearchModal';
import { useAdminStore } from '../../../store/useAdminStore';

export default function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { sidebarCollapsed, refreshData } = useAdminStore();

  // Listen to centralized storage updates across tabs and window
  useEffect(() => {
    const handleStorageUpdate = () => {
      refreshData();
    };

    window.addEventListener('govtpath_data_updated', handleStorageUpdate);
    window.addEventListener('storage', handleStorageUpdate);

    return () => {
      window.removeEventListener('govtpath_data_updated', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [refreshData]);

  return (
    <div className="min-h-screen bg-[#F7F8FC] text-slate-800 flex flex-col font-sans antialiased">
      <div className="flex flex-1 min-h-0">
        {/* Desktop Fixed Sidebar */}
        <aside
          className={`hidden lg:block shrink-0 sticky top-0 h-screen transition-all duration-300 ease-in-out z-20 ${
            sidebarCollapsed ? 'w-20' : 'w-64'
          }`}
        >
          <AdminSidebar />
        </aside>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileMenuOpen(false)}
                className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm"
              />

              <motion.aside
                initial={{ x: -280 }}
                animate={{ x: 0 }}
                exit={{ x: -280 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="relative z-10 h-full w-72 bg-white shadow-2xl"
              >
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute right-3 top-4 z-20 rounded-xl p-1 text-admin-muted hover:bg-slate-100 transition"
                >
                  <X size={18} />
                </button>
                <AdminSidebar onNavigate={() => setMobileMenuOpen(false)} />
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader onMenuOpen={() => setMobileMenuOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Global Quick Search Modal */}
      <GlobalSearchModal />
    </div>
  );
}
