import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Star, Clock, Users, Play, CheckCircle, BookOpen, Award } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StickyBuyBox } from '@/components/StickyBuyBox';
import { Curriculum } from '@/components/Curriculum';
import { ReviewList } from '@/components/ReviewList';
import { apiFetch, createMockResponse, isDevelopment } from '@/lib/fetcher';
import type { Course } from '@/types/api';

// Mock data for development
const mockCourse: Course = {
  id: '1',
  slug: 'react-js-temelleri',
  title: 'React.js Temelleri - Sıfırdan İleri Seviyeye',
  summary: 'Modern web uygulamaları geliştirmek için React.js öğrenin. Hooks, Context API ve daha fazlası.',
  description: `
    Bu kapsamlı React.js kursunda, modern web uygulamaları geliştirmek için ihtiyacınız olan tüm temel ve ileri seviye konuları öğreneceksiniz. 

    **Kurs İçeriği:**
    - React.js temelleri ve JSX
    - Component yapısı ve props
    - State yönetimi (useState, useEffect)
    - Hooks (custom hooks dahil)
    - Context API ve state management
    - Routing (React Router)
    - Form handling ve validation
    - API entegrasyonu
    - Testing (Jest, React Testing Library)
    - Deployment ve production optimizasyonu

    **Bu kursu tamamladığınızda:**
    - React.js ile modern web uygulamaları geliştirebileceksiniz
    - Component-based architecture anlayışına sahip olacaksınız
    - State management çözümlerini uygulayabileceksiniz
    - Real-world projeler geliştirebileceksiniz
  `,
  price: 299,
  thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop',
  level: 'beginner',
  language: 'Türkçe',
  rating: 4.8,
  totalLessons: 45,
  duration: 1200,
  instructor: {
    name: 'Ahmet Yılmaz',
    bio: '10+ yıllık deneyime sahip full-stack developer. React, Node.js ve modern web teknolojileri konularında uzman.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  sections: [
    {
      id: '1',
      title: 'React.js Temelleri',
      lessons: [
        {
          id: '1',
          title: 'React.js Nedir ve Neden Kullanılır?',
          duration: 15,
          preview: true,
          description: 'React.js kütüphanesinin temel kavramları ve avantajları',
        },
        {
          id: '2',
          title: 'Geliştirme Ortamının Kurulumu',
          duration: 20,
          preview: true,
          description: 'Node.js, npm ve Create React App kurulumu',
        },
        {
          id: '3',
          title: 'İlk React Uygulaması',
          duration: 25,
          preview: false,
          description: 'Hello World uygulaması oluşturma',
        },
      ],
    },
    {
      id: '2',
      title: 'JSX ve Component Yapısı',
      lessons: [
        {
          id: '4',
          title: 'JSX Nedir ve Nasıl Kullanılır?',
          duration: 30,
          preview: true,
          description: 'JSX syntax ve kuralları',
        },
        {
          id: '5',
          title: 'Functional Component Oluşturma',
          duration: 35,
          preview: false,
          description: 'İlk functional component yazımı',
        },
        {
          id: '6',
          title: 'Props Kullanımı',
          duration: 40,
          preview: false,
          description: 'Component\'lere veri geçirme',
        },
      ],
    },
    {
      id: '3',
      title: 'State Yönetimi',
      lessons: [
        {
          id: '7',
          title: 'useState Hook',
          duration: 45,
          preview: false,
          description: 'Component state yönetimi',
        },
        {
          id: '8',
          title: 'useEffect Hook',
          duration: 50,
          preview: false,
          description: 'Side effect yönetimi',
        },
        {
          id: '9',
          title: 'Custom Hooks',
          duration: 55,
          preview: false,
          description: 'Kendi hook\'larınızı yazma',
        },
      ],
    },
  ],
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T15:30:00Z',
};

async function getCourse(slug: string): Promise<Course | null> {
  if (isDevelopment) {
    // Mock course data
    if (slug === 'react-js-temelleri') {
      return createMockResponse(mockCourse, 500);
    }
    return null;
  }

  try {
    const response = await apiFetch<Course>(`/courses/${slug}`);
    return response;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

interface CourseDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: CourseDetailPageProps) {
  const resolvedParams = await params;
  const course = await getCourse(resolvedParams.slug);
  
  if (!course) {
    return {
      title: 'Kurs Bulunamadı',
    };
  }

  return {
    title: `${course.title} - KursPlatform`,
    description: course.summary,
    openGraph: {
      title: course.title,
      description: course.summary,
      images: [course.thumbnail],
    },
  };
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
  const resolvedParams = await params;
  const course = await getCourse(resolvedParams.slug);

  if (!course) {
    notFound();
  }

  const formatPrice = (price: number) => {
    if (price === 0) return 'Ücretsiz';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours} saat ${mins} dakika`;
    }
    return `${mins} dakika`;
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Başlangıç';
      case 'intermediate':
        return 'Orta';
      case 'advanced':
        return 'İleri';
      default:
        return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={getLevelColor(course.level)}>
                {getLevelText(course.level)}
              </Badge>
              <Badge variant="outline">{course.language}</Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {course.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {course.summary}
            </p>

            {/* Course Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{course.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.totalLessons} ders</span>
              </div>
            </div>
          </div>

          {/* Course Thumbnail */}
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Play className="h-5 w-5 mr-2" />
                Önizle
              </Button>
            </div>
          </div>

          {/* Course Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Açıklama</TabsTrigger>
              <TabsTrigger value="curriculum">Müfredat</TabsTrigger>
              <TabsTrigger value="reviews">Yorumlar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                {course.description?.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="curriculum">
              <Curriculum sections={course.sections} />
            </TabsContent>
            
            <TabsContent value="reviews">
              <ReviewList courseId={course.id} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Price Card */}
            <Card>
              <CardHeader>
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(course.price)}
                </div>
                {course.price > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Tek seferlik ödeme
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg" asChild>
                  <Link href={`/checkout/${course.id}`}>
                    {course.price === 0 ? 'Ücretsiz Başla' : 'Satın Al'}
                  </Link>
                </Button>
                
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Ömür boyu erişim</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Mobil ve masaüstü erişim</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Sertifika</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>30 gün para iade garantisi</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Eğitmen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{course.instructor.name}</h3>
                    <p className="text-sm text-muted-foreground">Uzman Eğitmen</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {course.instructor.bio}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sticky Buy Box for Mobile */}
      <StickyBuyBox course={course} />
    </div>
  );
}
