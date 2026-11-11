import { create } from 'zustand';
import { adminService } from '../services/admin/adminService';

export const useAdminStore = create((set, get) => ({
  adminUser: adminService.getCurrentAdmin(),
  sidebarCollapsed: false,
  globalSearchOpen: false,
  dateRangeFilter: 'Last 30 Days',
  dataVersion: 0, // Incremented on real-time data update events

  setAdminUser: (user) => set({ adminUser: user }),
  
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
  
  setGlobalSearchOpen: (open) => set({ globalSearchOpen: open }),
  setDateRangeFilter: (filter) => set({ dateRangeFilter: filter }),
  
  refreshData: () => set((state) => ({ dataVersion: state.dataVersion + 1 })),

  login: async (email, password) => {
    const res = await adminService.login(email, password);
    if (res.success) {
      set({ adminUser: res.user });
    }
    return res;
  },

  logout: () => {
    adminService.logout();
    set({ adminUser: null });
  },
}));
