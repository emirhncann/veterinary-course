'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity,
  Eye,
  BarChart3,
  Settings,
  Bell,
  Calendar,
  Clock,
  Award,
  ShoppingCart
} from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [adminData, setAdminData] = React.useState<any>(null);
  const [stats, setStats] = React.useState({
    totalCourses: 45,
    totalStudents: 1234,
    totalRevenue: 125000,
    monthlyRevenue: 15000,
    activeUsers: 89,
    completionRate: 78
  });

  React.useEffect(() => {
    // localStorage'dan admin bilgilerini al
    const adminUser = localStorage.getItem('admin_user');
    if (adminUser) {
      setAdminData(JSON.parse(adminUser));
    } else {
      // Admin giriş yapmamışsa login sayfasına yönlendir
      router.push('/adminlogin');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    router.push('/adminlogin');
  };

  if (!adminData) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: '#64748b' }}>Dashboard yükleniyor...</p>
        </div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color, change }: any) => (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      transition: 'transform 0.2s, box-shadow 0.2s'
    }}
    onMouseOver={(e) => {
      e.currentTarget.style.transform = 'translateY(-2px)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 8px 0' }}>{title}</p>
          <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1e293b', margin: '0 0 4px 0' }}>
            {typeof value === 'number' && value > 1000 ? 
              `${(value / 1000).toFixed(1)}k` : 
              value.toLocaleString()
            }
          </p>
          {change && (
            <p style={{ 
              fontSize: '12px', 
              color: change > 0 ? '#059669' : '#dc2626',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <TrendingUp size={12} />
              {change > 0 ? '+' : ''}{change}%
            </p>
          )}
        </div>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={24} color={color} />
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ title, description, icon: Icon, onClick, color }: any) => (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '16px',
        border: '1px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = '#f8fafc';
        e.currentTarget.style.borderColor = color;
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = 'white';
        e.currentTarget.style.borderColor = '#e2e8f0';
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        backgroundColor: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={20} color={color} />
      </div>
      <div>
        <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>
          {title}
        </h4>
        <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
          {description}
        </p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        padding: '24px'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: 'bold', 
                color: '#1e293b', 
                margin: '0 0 8px 0' 
              }}>
                Admin Dashboard
              </h1>
              <p style={{ color: '#64748b', margin: 0 }}>
                Hoş geldiniz, <strong>{adminData.email}</strong> • {new Date().toLocaleDateString('tr-TR')}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button
                onClick={() => router.push('/admin/settings')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: '#475569'
                }}
              >
                <Settings size={16} />
                Ayarlar
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc2626',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  color: 'white',
                  fontSize: '14px'
                }}
              >
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '24px',
          marginBottom: '24px'
        }}>
          <StatCard
            title="Toplam Kurs"
            value={stats.totalCourses}
            icon={BookOpen}
            color="#3b82f6"
            change={12}
          />
          <StatCard
            title="Toplam Öğrenci"
            value={stats.totalStudents}
            icon={Users}
            color="#059669"
            change={8}
          />
          <StatCard
            title="Toplam Gelir"
            value={`₺${stats.totalRevenue.toLocaleString()}`}
            icon={DollarSign}
            color="#dc2626"
            change={15}
          />
          <StatCard
            title="Aktif Kullanıcı"
            value={stats.activeUsers}
            icon={Activity}
            color="#7c3aed"
            change={5}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Main Content */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Quick Actions */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#1e293b', 
                margin: '0 0 16px 0' 
              }}>
                Hızlı İşlemler
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <QuickAction
                  title="Yeni Kurs Ekle"
                  description="Yeni bir kurs oluştur"
                  icon={BookOpen}
                  color="#3b82f6"
                  onClick={() => router.push('/admin/courses/new')}
                />
                <QuickAction
                  title="Öğrencileri Görüntüle"
                  description="Tüm öğrencileri listele"
                  icon={Users}
                  color="#059669"
                  onClick={() => router.push('/admin/students')}
                />
                <QuickAction
                  title="Siparişleri İncele"
                  description="Son siparişleri kontrol et"
                  icon={ShoppingCart}
                  color="#dc2626"
                  onClick={() => router.push('/admin/orders')}
                />
                <QuickAction
                  title="Raporları Görüntüle"
                  description="Detaylı analitik raporlar"
                  icon={BarChart3}
                  color="#7c3aed"
                  onClick={() => router.push('/admin/analytics')}
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h2 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#1e293b', 
                margin: '0 0 16px 0' 
              }}>
                Son Aktiviteler
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { action: 'Yeni öğrenci kaydı', user: 'Ahmet Yılmaz', time: '5 dakika önce', type: 'user' },
                  { action: 'Kurs satışı tamamlandı', user: 'React Temelleri', time: '15 dakika önce', type: 'sale' },
                  { action: 'Yeni kurs eklendi', user: 'JavaScript İleri Seviye', time: '1 saat önce', type: 'course' },
                  { action: 'Öğrenci kursu tamamladı', user: 'Zeynep Kaya', time: '2 saat önce', type: 'completion' }
                ].map((activity, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: activity.type === 'user' ? '#3b82f6' : 
                                     activity.type === 'sale' ? '#059669' :
                                     activity.type === 'course' ? '#7c3aed' : '#f59e0b'
                    }}></div>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#1e293b' }}>
                        {activity.action}
                      </p>
                      <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                        {activity.user} • {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* System Status */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1e293b', 
                margin: '0 0 16px 0' 
              }}>
                Sistem Durumu
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>Server Durumu</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }}></div>
                    <span style={{ fontSize: '12px', color: '#059669', fontWeight: '500' }}>Aktif</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>Database</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }}></div>
                    <span style={{ fontSize: '12px', color: '#059669', fontWeight: '500' }}>Bağlı</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>API Durumu</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#059669' }}></div>
                    <span style={{ fontSize: '12px', color: '#059669', fontWeight: '500' }}>Çalışıyor</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ 
                fontSize: '18px', 
                fontWeight: '600', 
                color: '#1e293b', 
                margin: '0 0 16px 0' 
              }}>
                Bu Ay
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>Yeni Kayıtlar</span>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>234</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}>
                    <div style={{ width: '78%', height: '100%', backgroundColor: '#3b82f6', borderRadius: '2px' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>Tamamlanan Kurslar</span>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>89</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}>
                    <div style={{ width: '65%', height: '100%', backgroundColor: '#059669', borderRadius: '2px' }}></div>
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', color: '#64748b' }}>Aylık Gelir</span>
                    <span style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>₺15.2k</span>
                  </div>
                  <div style={{ width: '100%', height: '4px', backgroundColor: '#e2e8f0', borderRadius: '2px' }}>
                    <div style={{ width: '85%', height: '100%', backgroundColor: '#dc2626', borderRadius: '2px' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}