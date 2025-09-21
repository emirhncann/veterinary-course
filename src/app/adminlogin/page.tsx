'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  console.log('🔥 ADMIN LOGIN PAGE LOADED!');
  
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    console.log('🚀 Component mounted successfully!');
    document.title = 'Admin Giriş - Test';
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('✅ Form submitted:', formData);
    
    // Test için basit login (API çalışmıyorsa)
    if (formData.email === 'admin@test.com' && formData.password === 'admin123') {
      console.log('✅ Test login successful!');
      const mockAdmin = {
        id: 1,
        email: 'admin@test.com',
        role: 'admin'
      };
      localStorage.setItem('admin_user', JSON.stringify(mockAdmin));
      console.log('💾 Admin data saved to localStorage');
      console.log('🔄 Redirecting to dashboard...');
      router.push('/admin/dashboard');
      setLoading(false);
      return;
    }
    
    // Boş alan kontrolü
    if (!formData.email || !formData.password) {
      setError('Lütfen tüm alanları doldurun');
      setLoading(false);
      return;
    }
    
    try {
      // PHP API'ye POST request (api.vetmedipedia.com)
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? 'https://api.vetmedipedia.com/admin/login'
        : 'https://api.vetmedipedia.com/admin/login'; // Test için aynı URL
        
      console.log('🌐 Making API request to:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include', // CORS için
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response headers:', response.headers);

      const data = await response.json();
      console.log('🔍 API Response:', data);

      // API response format: { status, message, valid, admin? }
      if (data.status === 'success' && data.valid === true && data.admin) {
        console.log('✅ Login successful!', data.admin);
        
        // Admin bilgilerini localStorage'a kaydet (isteğe bağlı)
        localStorage.setItem('admin_user', JSON.stringify(data.admin));
        
        // Admin dashboard'a yönlendir
        router.push('/admin/dashboard');
      } else {
        // Hata mesajını göster
        throw new Error(data.message || 'Giriş başarısız');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      
      // Network hatası vs API hatası ayırımı
      if (err instanceof TypeError && err.message.includes('fetch')) {
        setError('Sunucu ile bağlantı kurulamadı. Lütfen tekrar deneyin.');
      } else {
        setError(err instanceof Error ? err.message : 'Giriş yapılırken bir hata oluştu');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    console.log(`📝 ${name} changed:`, value);
  };

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
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f3f4f6',
      padding: '1rem'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        padding: '2rem',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '1rem',
          color: '#1f2937'
        }}>
          🔐 Admin Giriş
        </h1>
        
        <div style={{
          backgroundColor: '#f3f4f6',
          border: '1px solid #d1d5db',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '1.5rem',
          fontSize: '0.875rem'
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '600', color: '#374151' }}>
            Test Bilgileri:
          </p>
          <p style={{ margin: '0 0 4px 0', color: '#6b7280' }}>
            Email: <strong>admin@test.com</strong>
          </p>
          <p style={{ margin: '0', color: '#6b7280' }}>
            Şifre: <strong>admin123</strong>
          </p>
        </div>
        
        {!loading && !error && (
          <div style={{
            backgroundColor: '#dbeafe',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            border: '1px solid #93c5fd'
          }}>
            <p style={{ fontSize: '0.875rem', color: '#1e40af', fontWeight: '500', margin: '0 0 0.5rem 0' }}>
              ✅ Sayfa Başarıyla Yüklendi!
            </p>
            <p style={{ fontSize: '0.75rem', color: '#1e40af', margin: 0 }}>
              URL: /adminlogin
            </p>
          </div>
        )}

        {error && (
          <div style={{
            backgroundColor: '#fee2e2',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            border: '1px solid #fca5a5'
          }}>
            <p style={{ fontSize: '0.875rem', color: '#dc2626', fontWeight: '500', margin: 0 }}>
              ❌ {error}
            </p>
          </div>
        )}

        {loading && (
          <div style={{
            backgroundColor: '#fef3c7',
            padding: '1rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            border: '1px solid #fbbf24',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '0.875rem', color: '#92400e', fontWeight: '500', margin: 0 }}>
              🔄 Giriş yapılıyor...
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label htmlFor="email" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.25rem'
            }}>
              E-posta
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="admin@example.com"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <div>
            <label htmlFor="password" style={{
              display: 'block',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '0.25rem'
            }}>
              Şifre
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="••••••••"
              required
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              setFormData({ email: 'admin@test.com', password: 'admin123' });
            }}
            style={{
              width: '100%',
              backgroundColor: '#10b981',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '0.75rem',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            🧪 Test Bilgilerini Doldur
          </button>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              backgroundColor: loading ? '#9ca3af' : '#3b82f6',
              color: 'white',
              padding: '0.75rem 1rem',
              borderRadius: '6px',
              border: 'none',
              fontSize: '1rem',
              fontWeight: '500',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#2563eb')}
            onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#3b82f6')}
          >
            {loading ? (
              <>
                <span style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></span>
                Giriş Yapılıyor...
              </>
            ) : (
              '🚀 Giriş Yap'
            )}
          </button>
        </form>

        <div style={{
          marginTop: '1.5rem',
          padding: '1rem',
          backgroundColor: '#f0f9ff',
          borderRadius: '6px',
          border: '1px solid #0ea5e9'
        }}>
          <p style={{ fontSize: '0.875rem', color: '#0369a1', fontWeight: '500', margin: '0 0 0.5rem 0' }}>
            🔗 API Entegrasyonu Aktif
          </p>
          <p style={{ fontSize: '0.75rem', color: '#0369a1', margin: '0.25rem 0' }}>
            Endpoint: POST https://api.vetmedipedia.com/admin/login
          </p>
          <p style={{ fontSize: '0.75rem', color: '#0369a1', margin: '0.25rem 0' }}>
            Database'den gerçek admin hesabı ile giriş yapın
          </p>
        </div>
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            URL: /adminlogin | PHP API Ready
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
