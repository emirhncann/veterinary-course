'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  console.log('🔥 ADMIN LOGIN PAGE LOADED!');
  
  const router = useRouter();
  const [formData, setFormData] = React.useState({
    email: 'admin@example.com',
    password: 'admin123',
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
    
    try {
      // Simulated API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Test için basit validation
      if (formData.email === 'admin@example.com' && formData.password === 'admin123') {
        console.log('✅ Login successful!');
        
        // Başarılı giriş - admin dashboard'a yönlendir
        router.push('/admin/dashboard');
      } else {
        throw new Error('Hatalı e-posta veya şifre!');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setError(err instanceof Error ? err.message : 'Giriş yapılırken bir hata oluştu');
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
          marginBottom: '1.5rem',
          color: '#1f2937'
        }}>
          🔐 Admin Giriş
        </h1>
        
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
            📋 Demo Bilgiler:
          </p>
          <p style={{ fontSize: '0.75rem', color: '#0369a1', margin: '0.25rem 0' }}>
            Email: admin@example.com
          </p>
          <p style={{ fontSize: '0.75rem', color: '#0369a1', margin: '0.25rem 0' }}>
            Şifre: admin123
          </p>
        </div>
        
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.75rem', color: '#6b7280' }}>
            Test Route: /adminlogin (tek kelime)
          </p>
        </div>
      </div>
    </div>
    </>
  );
}
