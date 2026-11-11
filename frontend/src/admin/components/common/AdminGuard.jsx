import { Navigate } from 'react-router-dom';
import { useAdminStore } from '../../../store/useAdminStore';
import { adminService } from '../../../services/admin/adminService';

export default function AdminGuard({ children }) {
  const adminUser = useAdminStore((s) => s.adminUser);
  const isAuthenticated = adminUser || adminService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login?tab=admin" replace />;
  }

  return children;
}
