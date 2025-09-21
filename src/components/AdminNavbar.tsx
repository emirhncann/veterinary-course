'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ShoppingCart, 
  Settings, 
  LogOut,
  Menu,
  X,
  BarChart3,
  FileText
} from 'lucide-react';

const adminNavItems = [
  {
    href: '/admin/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    href: '/admin/courses',
    label: 'Kurslar',
    icon: BookOpen,
  },
  {
    href: '/admin/students',
    label: 'Öğrenciler',
    icon: Users,
  },
  {
    href: '/admin/orders',
    label: 'Siparişler',
    icon: ShoppingCart,
  },
  {
    href: '/admin/analytics',
    label: 'Analitikler',
    icon: BarChart3,
  },
  {
    href: '/admin/logs',
    label: 'Loglar',
    icon: FileText,
  },
  {
    href: '/admin/settings',
    label: 'Ayarlar',
    icon: Settings,
  },
];

export function AdminNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [adminData, setAdminData] = React.useState<any>(null);

  React.useEffect(() => {
    // localStorage'dan admin bilgilerini al
    const adminUser = localStorage.getItem('admin_user');
    if (adminUser) {
      setAdminData(JSON.parse(adminUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    router.push('/adminlogin');
  };

  const isActiveRoute = (href: string) => {
    return pathname === href;
  };

  return (
    <nav style={{
      backgroundColor: 'white',
      borderBottom: '1px solid #e2e8f0',
      padding: '0 24px',
      height: '64px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
        <Link href="/admin/dashboard" style={{ 
          textDecoration: 'none', 
          fontSize: '20px', 
          fontWeight: 'bold', 
          color: '#1e293b' 
        }}>
          Admin Panel
        </Link>
      </div>

      {/* Desktop Navigation */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        display: window.innerWidth > 768 ? 'flex' : 'none'
      }}>
        {adminNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);
          
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '500',
                color: isActive ? '#3b82f6' : '#64748b',
                backgroundColor: isActive ? '#eff6ff' : 'transparent',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.color = '#475569';
                }
              }}
              onMouseOut={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#64748b';
                }
              }}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* User Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {adminData && (
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            padding: '8px 12px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            fontSize: '14px',
            color: '#475569'
          }}>
            <div style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#059669'
            }}></div>
            {adminData.email}
          </div>
        )}
        
        <button
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            backgroundColor: '#dc2626',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
        >
          <LogOut size={16} />
          Çıkış
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{
            display: window.innerWidth <= 768 ? 'flex' : 'none',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40px',
            height: '40px',
            backgroundColor: 'transparent',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = isActiveRoute(item.href);
            
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: isActive ? '#3b82f6' : '#64748b',
                  backgroundColor: isActive ? '#eff6ff' : 'transparent'
                }}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </nav>
  );
}