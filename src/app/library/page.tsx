'use client';

import * as React from 'react';
import Link from 'next/link';
import { BookOpen, Play, Clock, CheckCircle } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthGuard } from '@/components/AuthGuard';
import { apiFetch, createMockResponse, isDevelopment } from '@/lib/fetcher';
import type { Enrollment, EnrollmentsResponse } from '@/types/api';

// Mock data for development
const mockEnrollments: Enrollment[] = [
  {
    id: '1',
    courseId: '1',
    course: {
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
    enrolledAt: '2024-01-15T10:00:00Z',
    progress: 65,
    lastLessonId: '7',
  },
  {
    id: '2',
    courseId: '2',
    course: {
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
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
      },
    },
    enrolledAt: '2024-01-10T14:30:00Z',
    progress: 30,
    lastLessonId: '12',
  },
  {
    id: '3',
    courseId: '3',
    course: {
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
    enrolledAt: '2024-01-05T09:15:00Z',
    progress: 100,
    lastLessonId: '35',
  },
];

const mockEnrollmentsResponse: EnrollmentsResponse = {
  items: mockEnrollments,
  total: 3,
};

async function getEnrollments(): Promise<EnrollmentsResponse> {
  if (isDevelopment) {
    return createMockResponse(mockEnrollmentsResponse, 500);
  }

  try {
    const response = await apiFetch<EnrollmentsResponse>('/enrollments/me');
    return response;
  } catch (error) {
    console.error('Error fetching enrollments:', error);
    return { items: [], total: 0 };
  }
}

export default function LibraryPage() {
  const [enrollments, setEnrollments] = React.useState<EnrollmentsResponse | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      try {
        const data = await getEnrollments();
        setEnrollments(data);
      } catch (error) {
        console.error('Error loading enrollments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const getProgressText = (progress: number) => {
    if (progress === 100) return 'Tamamlandı';
    if (progress >= 50) return 'Devam ediyor';
    if (progress >= 25) return 'Başlandı';
    return 'Yeni başlandı';
  };

  const inProgressCourses = enrollments?.items.filter(e => e.progress > 0 && e.progress < 100) || [];
  const completedCourses = enrollments?.items.filter(e => e.progress === 100) || [];
  const allCourses = enrollments?.items || [];

  if (loading) {
    return (
      <AuthGuard>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="aspect-video bg-muted rounded mb-4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Kitaplığım
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Kayıtlı olduğunuz kurslar ve ilerleme durumunuz
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{allCourses.length}</div>
                  <div className="text-sm text-muted-foreground">Toplam Kurs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{completedCourses.length}</div>
                  <div className="text-sm text-muted-foreground">Tamamlanan</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center">
                  <Play className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{inProgressCourses.length}</div>
                  <div className="text-sm text-muted-foreground">Devam Eden</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Courses Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Tümü ({allCourses.length})</TabsTrigger>
            <TabsTrigger value="in-progress">Devam Eden ({inProgressCourses.length})</TabsTrigger>
            <TabsTrigger value="completed">Tamamlanan ({completedCourses.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <CourseGrid courses={allCourses} />
          </TabsContent>

          <TabsContent value="in-progress" className="mt-6">
            <CourseGrid courses={inProgressCourses} />
          </TabsContent>

          <TabsContent value="completed" className="mt-6">
            <CourseGrid courses={completedCourses} />
          </TabsContent>
        </Tabs>

        {allCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Henüz kurs kaydınız yok</h3>
            <p className="text-muted-foreground mb-6">
              İlk kursunuzu keşfetmek için kurslarımıza göz atın
            </p>
            <Button asChild>
              <Link href="/courses">
                Kursları Keşfet
              </Link>
            </Button>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

function CourseGrid({ courses }: { courses: Enrollment[] }) {
  if (courses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Bu kategoride kurs bulunamadı.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((enrollment) => (
        <Card key={enrollment.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
          <div className="relative aspect-video overflow-hidden">
            <Image
              src={enrollment.course.thumbnail}
              alt={enrollment.course.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Progress Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>{getProgressText(enrollment.progress)}</span>
                <span>{enrollment.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-1">
                <div
                  className={`h-1 rounded-full transition-all duration-300 ${getProgressColor(enrollment.progress)}`}
                  style={{ width: `${enrollment.progress}%` }}
                />
              </div>
            </div>

            {/* Completed Badge */}
            {enrollment.progress === 100 && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-green-500 text-white">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Tamamlandı
                </Badge>
              </div>
            )}
          </div>

          <CardContent className="p-4">
            <h3 className="font-semibold text-lg leading-tight mb-2 line-clamp-2">
              {enrollment.course.title}
            </h3>
            
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {enrollment.course.summary}
            </p>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>Kayıt: {formatDate(enrollment.enrolledAt)}</span>
              </div>
            </div>

            <Button className="w-full" asChild>
              <Link href={`/player/${enrollment.courseId}/${enrollment.lastLessonId || '1'}`}>
                {enrollment.progress === 100 ? 'Tekrar İzle' : 'Devam Et'}
              </Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function getProgressText(progress: number) {
  if (progress === 100) return 'Tamamlandı';
  if (progress >= 50) return 'Devam ediyor';
  if (progress >= 25) return 'Başlandı';
  return 'Yeni başlandı';
}

function getProgressColor(progress: number) {
  if (progress === 100) return 'bg-green-500';
  if (progress >= 50) return 'bg-blue-500';
  if (progress >= 25) return 'bg-yellow-500';
  return 'bg-gray-500';
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
