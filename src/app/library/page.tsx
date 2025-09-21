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
import { apiFetch } from '@/lib/fetcher';
import type { Enrollment, EnrollmentsResponse } from '@/types/api';

async function getEnrollments(): Promise<EnrollmentsResponse> {
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Kitaplığım
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Kayıtlı olduğunuz kurslar ve ilerleme durumunuz
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              Tüm Kurslar ({allCourses.length})
            </TabsTrigger>
            <TabsTrigger value="in-progress">
              Devam Eden ({inProgressCourses.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Tamamlanan ({completedCourses.length})
            </TabsTrigger>
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
        <p className="text-muted-foreground">Bu kategoride kurs bulunmuyor.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((enrollment) => (
        <CourseCard key={enrollment.id} enrollment={enrollment} />
      ))}
    </div>
  );
}

function CourseCard({ enrollment }: { enrollment: Enrollment }) {
  const { course, progress, enrolledAt, lastLessonId } = enrollment;
  
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

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/50">
            <Play className="h-5 w-5 mr-2" />
            {progress > 0 ? 'Devam Et' : 'Başla'}
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-2 mb-2">
              {course.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {course.summary}
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Progress Bar */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{getProgressText(progress)}</span>
              <span className="text-sm text-muted-foreground">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Course Info */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{Math.floor(course.duration / 60)}s</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.totalLessons} ders</span>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {course.level === 'beginner' && 'Başlangıç'}
              {course.level === 'intermediate' && 'Orta'}
              {course.level === 'advanced' && 'İleri'}
            </Badge>
          </div>

          {/* Instructor & Date */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <span className="text-xs text-white font-medium">
                  {course.instructor.name?.charAt(0) || 'E'}
                </span>
              </div>
              <span className="text-muted-foreground">{course.instructor.name}</span>
            </div>
            <span className="text-muted-foreground">
              {formatDate(enrolledAt)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button asChild className="flex-1">
              <Link href={lastLessonId ? `/player/${course.id}/${lastLessonId}` : `/courses/${course.slug}`}>
                {progress > 0 ? 'Devam Et' : 'Başla'}
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link href={`/courses/${course.slug}`}>
                Detay
              </Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}