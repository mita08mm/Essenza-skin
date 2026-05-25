import ProtectedRoute from '@/features/auth/components/ProtectedRoute';
import DashboardLayout from '@/shared/layout/DashboardLayout';

export default function DashboardGroupLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
