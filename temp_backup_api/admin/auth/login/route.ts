import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Mock admin authentication
    if (email === 'admin@example.com' && password === 'admin123') {
      const adminUser = {
        id: 1,
        first_name: 'Admin',
        last_name: 'User',
        email: 'admin@example.com',
        national_id: '12345678901',
        phone: '+90 555 123 4567',
        role: 'admin',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        created_at: '2024-01-01T00:00:00Z',
      };

      return NextResponse.json({
        user: adminUser,
        token: 'mock-admin-token',
      });
    }

    return NextResponse.json(
      { error: 'Geçersiz admin bilgileri' },
      { status: 401 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
