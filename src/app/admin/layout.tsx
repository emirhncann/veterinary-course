'use client';

import { usePathname } from 'next/navigation';
import { AdminNavbar } from '../../components/AdminNavbar';
import { ToastContainer } from '../../components/ui/toast';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  // Admin login sayfası artık /adminlogin'de, burada bypass gerekmiyor

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminNavbar />
      <main>{children}</main>
      <ToastContainer />
    </div>
  );
}
