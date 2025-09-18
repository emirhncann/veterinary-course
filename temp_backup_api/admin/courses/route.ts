import { NextRequest, NextResponse } from 'next/server';

// Mock courses data
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
  {
    id: '2',
    slug: 'python-veri-bilimi',
    title: 'Python ile Veri Bilimi ve Makine Öğrenmesi',
    summary: 'Pandas, NumPy, Matplotlib ve Scikit-learn ile veri analizi ve makine öğrenmesi projeleri.',
    price: 399,
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=225&fit=crop',
    level: 'intermediate',
    language: 'Türkçe',
    rating: 4.9,
    totalLessons: 60,
    duration: 1800,
    instructor: {
      name: 'Elif Demir',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    },
  },
  {
    id: '3',
    slug: 'ui-ux-tasarim',
    title: 'UI/UX Tasarım - Figma ile Modern Arayüz Tasarımı',
    summary: 'Figma kullanarak profesyonel UI/UX tasarımları oluşturun. Kullanıcı deneyimi prensipleri.',
    price: 249,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=225&fit=crop',
    level: 'beginner',
    language: 'Türkçe',
    rating: 4.7,
    totalLessons: 35,
    duration: 900,
    instructor: {
      name: 'Mehmet Kaya',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
  },
  {
    id: '4',
    slug: 'javascript-algoritma',
    title: 'JavaScript Algoritma ve Veri Yapıları',
    summary: 'JavaScript ile algoritma problemlerini çözün. Mülakat hazırlığı ve kodlama becerileri.',
    price: 199,
    thumbnail: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=400&h=225&fit=crop',
    level: 'intermediate',
    language: 'Türkçe',
    rating: 4.6,
    totalLessons: 50,
    duration: 1500,
    instructor: {
      name: 'Ayşe Özkan',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    },
  },
  {
    id: '5',
    slug: 'node-js-backend',
    title: 'Node.js ile Backend Geliştirme',
    summary: 'Express.js, MongoDB ve RESTful API geliştirme. Modern backend uygulamaları oluşturun.',
    price: 349,
    thumbnail: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=400&h=225&fit=crop',
    level: 'intermediate',
    language: 'Türkçe',
    rating: 4.8,
    totalLessons: 55,
    duration: 1650,
    instructor: {
      name: 'Can Yıldız',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    },
  },
  {
    id: '6',
    slug: 'flutter-mobil',
    title: 'Flutter ile Mobil Uygulama Geliştirme',
    summary: 'Dart ve Flutter ile iOS ve Android uygulamaları geliştirin. Cross-platform mobil geliştirme.',
    price: 449,
    thumbnail: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=225&fit=crop',
    level: 'beginner',
    language: 'Türkçe',
    rating: 4.9,
    totalLessons: 70,
    duration: 2100,
    instructor: {
      name: 'Zeynep Arslan',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
    },
  },
  {
    id: '7',
    slug: 'aws-cloud',
    title: 'AWS Cloud Computing - Sıfırdan Uzmanlığa',
    summary: 'Amazon Web Services ile bulut bilişim öğrenin. EC2, S3, Lambda ve daha fazlası.',
    price: 599,
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=225&fit=crop',
    level: 'advanced',
    language: 'Türkçe',
    rating: 4.7,
    totalLessons: 80,
    duration: 2400,
    instructor: {
      name: 'Oğuzhan Kılıç',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
  },
  {
    id: '8',
    slug: 'docker-kubernetes',
    title: 'Docker ve Kubernetes - Container Orchestration',
    summary: 'Container teknolojileri ve orchestration. Modern DevOps pratikleri.',
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=400&h=225&fit=crop',
    level: 'intermediate',
    language: 'Türkçe',
    rating: 4.8,
    totalLessons: 40,
    duration: 1200,
    instructor: {
      name: 'Deniz Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(mockCourses);
  } catch (error) {
    console.error('Get courses error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Mock course creation
    const newCourse = {
      id: (mockCourses.length + 1).toString(),
      slug: body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      ...body,
      rating: 0,
      totalLessons: body.sections?.reduce((acc: number, section: { lessons: unknown[] }) => acc + section.lessons.length, 0) || 0,
      duration: body.sections?.reduce((acc: number, section: { lessons: { duration: number }[] }) => 
        acc + section.lessons.reduce((lessonAcc: number, lesson: { duration: number }) => lessonAcc + lesson.duration, 0), 0
      ) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockCourses.push(newCourse);

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Create course error:', error);
    return NextResponse.json(
      { error: 'Sunucu hatası' },
      { status: 500 }
    );
  }
}
