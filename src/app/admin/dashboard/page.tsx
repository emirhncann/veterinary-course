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
  const [isClient, setIsClient] = React.useState(false);
  const [stats, setStats] = React.useState({
    totalCourses: 0,
    totalInstructors: 0,
    totalCategories: 0,
    totalUsers: 0,
    systemStatus: {
      api: false,
      database: false,
      fileSystem: true
    }
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    setIsClient(true);
    // localStorage'dan admin bilgilerini al
    const adminUser = localStorage.getItem('admin_user');
    if (adminUser) {
      setAdminData(JSON.parse(adminUser));
      loadDashboardData();
    } else {
      // Admin giriş yapmamışsa login sayfasına yönlendir
      router.push('/adminlogin');
    }
  }, [router]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Paralel olarak tüm verileri yükle
      const [coursesRes, instructorsRes, categoriesRes] = await Promise.allSettled([
        fetch('https://api.vetmedipedia.com/courses?limit=1'),
        fetch('https://api.vetmedipedia.com/instructors'),
        fetch('https://api.vetmedipedia.com/categories')
      ]);

      // Kurs sayısını al
      if (coursesRes.status === 'fulfilled' && coursesRes.value.ok) {
        const coursesData = await coursesRes.value.json();
        setStats(prev => ({ ...prev, totalCourses: coursesData.total || 0 }));
      }

      // Eğitmen sayısını al
      if (instructorsRes.status === 'fulfilled' && instructorsRes.value.ok) {
        const instructorsData = await instructorsRes.value.json();
        setStats(prev => ({ ...prev, totalInstructors: instructorsData.items?.length || 0 }));
      }

      // Kategori sayısını al
      if (categoriesRes.status === 'fulfilled' && categoriesRes.value.ok) {
        const categoriesData = await categoriesRes.value.json();
        setStats(prev => ({ ...prev, totalCategories: categoriesData.items?.length || 0 }));
      }

      // Sistem durumunu güncelle
      setStats(prev => ({
        ...prev,
        systemStatus: {
          api: coursesRes.status === 'fulfilled' && coursesRes.value.ok,
          database: instructorsRes.status === 'fulfilled' && instructorsRes.value.ok,
          fileSystem: true
        }
      }));

    } catch (error) {
      console.error('Dashboard verileri yüklenirken hata:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_user');
    router.push('/adminlogin');
  };

  if (!isClient) {
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
          <p style={{ color: '#64748b' }}>Yükleniyor...</p>
        </div>
      </div>
    );
  }

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
            value={loading ? '...' : stats.totalCourses}
            icon={BookOpen}
            color="#3b82f6"
          />
          <StatCard
            title="Eğitmenler"
            value={loading ? '...' : stats.totalInstructors}
            icon={Users}
            color="#059669"
          />
          <StatCard
            title="Kategoriler"
            value={loading ? '...' : stats.totalCategories}
            icon={Award}
            color="#7c3aed"
          />
          <StatCard
            title="Sistem Durumu"
            value={stats.systemStatus.api && stats.systemStatus.database ? 'Aktif' : 'Hata'}
            icon={Activity}
            color={stats.systemStatus.api && stats.systemStatus.database ? '#059669' : '#dc2626'}
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
                  title="Kurs Yönetimi"
                  description="Tüm kursları listele ve düzenle"
                  icon={BookOpen}
                  color="#059669"
                  onClick={() => router.push('/admin/courses')}
                />
                <QuickAction
                  title="Eğitmen Yönetimi"
                  description="Eğitmenleri yönet"
                  icon={Users}
                  color="#7c3aed"
                  onClick={() => router.push('/admin/instructors')}
                />
                <QuickAction
                  title="Kategori Yönetimi"
                  description="Kurs kategorilerini yönet"
                  icon={Award}
                  color="#f59e0b"
                  onClick={() => router.push('/admin/categories')}
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
                  <span style={{ fontSize: '14px', color: '#64748b' }}>API Sunucusu</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: stats.systemStatus.api ? '#059669' : '#dc2626' 
                    }}></div>
                    <span style={{ 
                      fontSize: '12px', 
                      color: stats.systemStatus.api ? '#059669' : '#dc2626', 
                      fontWeight: '500' 
                    }}>
                      {stats.systemStatus.api ? 'Çevrimiçi' : 'Çevrimdışı'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>Veritabanı</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: stats.systemStatus.database ? '#059669' : '#dc2626' 
                    }}></div>
                    <span style={{ 
                      fontSize: '12px', 
                      color: stats.systemStatus.database ? '#059669' : '#dc2626', 
                      fontWeight: '500' 
                    }}>
                      {stats.systemStatus.database ? 'Bağlı' : 'Bağlantı Hatası'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '14px', color: '#64748b' }}>Dosya Sistemi</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <div style={{ 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      backgroundColor: stats.systemStatus.fileSystem ? '#059669' : '#dc2626' 
                    }}></div>
                    <span style={{ 
                      fontSize: '12px', 
                      color: stats.systemStatus.fileSystem ? '#059669' : '#dc2626', 
                      fontWeight: '500' 
                    }}>
                      Aktif
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* API Endpoints Info */}
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
                API Endpoint'leri
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>
                    Kurs Yönetimi
                  </h4>
                  <ul style={{ fontSize: '12px', color: '#64748b', margin: 0, paddingLeft: '16px' }}>
                    <li>POST /courses - Kurs oluştur</li>
                    <li>GET /courses - Kurs listesi</li>
                    <li>GET /courses/{'{id}'} - Kurs detayı</li>
                    <li>PUT /courses/{'{id}'} - Kurs güncelle</li>
                    <li>DELETE /courses/{'{id}'} - Kurs sil</li>
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', margin: '0 0 8px 0' }}>
                    Diğer Servisler
                  </h4>
                  <ul style={{ fontSize: '12px', color: '#64748b', margin: 0, paddingLeft: '16px' }}>
                    <li>POST /instructors - Eğitmen ekle</li>
                    <li>GET /instructors - Eğitmen listesi</li>
                    <li>POST /categories - Kategori ekle</li>
                    <li>GET /categories - Kategori listesi</li>
                    <li>POST /register - Kullanıcı kayıt</li>
                    <li>POST /login - Kullanıcı giriş</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}