'use client';

import * as React from 'react';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Users, Play, CheckCircle, BookOpen, Award } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StickyBuyBox } from '@/components/StickyBuyBox';
import { Curriculum } from '@/components/Curriculum';
import { ReviewList } from '@/components/ReviewList';
import { apiFetch } from '@/lib/fetcher';
import type { Course } from '@/types/api';


// Client-side course data fetching hook
function useCourse() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await apiFetch<Course>(`/courses/${slug}`);
        setCourse(response);
      } catch (error) {
        console.error('Error fetching course:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  return { course, loading, notFound };
}

export default function CourseDetailPage() {
  const { course, loading, notFound: courseNotFound } = useCourse();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Kurs yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (courseNotFound || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Kurs bulunamadı
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Aradığınız kurs mevcut değil veya kaldırılmış olabilir.
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
          >
            Kurslara Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              <div className="mb-4">
                <Badge variant="secondary" className="mb-2">
                  {course.level === 'beginner' && 'Başlangıç'}
                  {course.level === 'intermediate' && 'Orta'}
                  {course.level === 'advanced' && 'İleri'}
                </Badge>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                  {course.title}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {course.summary}
                </p>
              </div>

              {/* Course Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-300 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="font-medium">{course.rating}</span>
                  <span>({Math.floor(Math.random() * 1000) + 100} değerlendirme)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{Math.floor(Math.random() * 5000) + 1000} öğrenci</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{Math.floor(course.duration / 60)} saat</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <span>{course.totalLessons} ders</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  <span>Sertifika</span>
                </div>
              </div>

              {/* Instructor */}
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-lg text-white font-medium">
                    {course.instructor.name?.charAt(0) || 'E'}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Eğitmen</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {course.instructor.name}
                  </p>
                </div>
              </div>
            </div>

            {/* Course Thumbnail */}
            <div className="lg:col-span-1">
              <div className="sticky top-8">
                <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/50">
                      <Play className="h-5 w-5 mr-2" />
                      Önizleme
                    </Button>
                  </div>
                </div>
                <StickyBuyBox course={course} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="about">Hakkında</TabsTrigger>
                <TabsTrigger value="curriculum">Müfredat</TabsTrigger>
                <TabsTrigger value="reviews">Değerlendirmeler</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Kurs Hakkında</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose dark:prose-invert max-w-none">
                      {course.description ? (
                        <div dangerouslySetInnerHTML={{ __html: course.description.replace(/\n/g, '<br />') }} />
                      ) : (
                        <p>{course.summary}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Instructor Bio */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle>Eğitmen Hakkında</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <span className="text-xl text-white font-medium">
                          {course.instructor.name?.charAt(0) || 'E'}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">{course.instructor.name}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{course.instructor.bio}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="curriculum" className="mt-6">
                <Curriculum course={course} />
              </TabsContent>
              
              <TabsContent value="reviews" className="mt-6">
                <ReviewList courseId={course.id} />
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Course Features */}
              <Card>
                <CardHeader>
                  <CardTitle>Bu kursta neler var?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">{course.totalLessons} video ders</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">{Math.floor(course.duration / 60)} saat içerik</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Yaşam boyu erişim</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Mobil ve masaüstü erişim</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">Tamamlama sertifikası</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span className="text-sm">30 gün para iade garantisi</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}