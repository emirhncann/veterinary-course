'use client';

import { usePathname } from 'next/navigation';
import { AdminNavbar } from '../../components/AdminNavbar';
import { AuthGuard } from '../../components/AuthGuard';
import { ToastContainer } from '../../components/ui/toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Login sayfası için layout'u bypass et
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <AdminNavbar />
        <main>{children}</main>
        <ToastContainer />
      </div>
    </AuthGuard>
  );
}
