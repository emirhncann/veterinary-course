import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock dashboard stats
    const stats = {
      totalCourses: 8,
      totalStudents: 1247,
      totalRevenue: 45680,
      monthlyRevenue: 12340,
      recentCourses: [
        {
          id: '1',
          title: 'React.js Temelleri',
          students: 234,
          revenue: 70020,
          status: 'active',
          createdAt: '2024-01-15',
        },
        {
          id: '2',
          title: 'Python ile Veri Bilimi',
          students: 189,
          revenue: 75510,
          status: 'active',
          createdAt: '2024-01-10',
        },
        {
          id: '3',
          title: 'UI/UX Tasarım',
          students: 156,
          revenue: 38940,
          status: 'active',
          createdAt: '2024-01-05',
        },
      ],
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
