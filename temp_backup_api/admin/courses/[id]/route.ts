import { NextRequest, NextResponse } from 'next/server';

// Mock courses data (same as in courses/route.ts)
const mockCourses = [
  {
    id: '1',
    slug: 'react-js-temelleri',
    title: 'React.js Temelleri - Sıfırdan İleri Seviyeye',
    summary: 'Modern web uygulamaları geliştirmek için React.js öğrenin. Hooks, Context API ve daha fazlası.',
    price: 299,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
    level: 'beginner',
    language: 'Türkçe',
    rating: 4.8,
    totalLessons: 45,
    duration: 1200,
    instructor: {
      name: 'Ahmet Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    },
  },
  // ... other courses would be here
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const course = mockCourses.find(c => c.id === resolvedParams.id);
    
    if (!course) {
      return NextResponse.json(
        { error: 'Kurs bulunamadı' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Get course error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const courseIndex = mockCourses.findIndex(c => c.id === resolvedParams.id);
    
    if (courseIndex === -1) {
      return NextResponse.json(
        { error: 'Kurs bulunamadı' },
        { status: 404 }
      );
    }

    // Update course
    mockCourses[courseIndex] = {
      ...mockCourses[courseIndex],
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(mockCourses[courseIndex]);
  } catch (error) {
    console.error('Update course error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const courseIndex = mockCourses.findIndex(c => c.id === resolvedParams.id);
    
    if (courseIndex === -1) {
      return NextResponse.json(
        { error: 'Kurs bulunamadı' },
        { status: 404 }
      );
    }

    // Remove course
    mockCourses.splice(courseIndex, 1);

    return NextResponse.json({ message: 'Kurs başarıyla silindi' });
  } catch (error) {
    console.error('Delete course error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
