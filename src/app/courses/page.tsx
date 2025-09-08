import * as React from 'react';
import { Suspense } from 'react';
import { Search, Filter, SortAsc } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CourseGrid } from '@/components/CourseGrid';
import { CourseFilters } from '@/components/CourseFilters';
import { apiFetch, createMockResponse, isDevelopment } from '@/lib/fetcher';
import type { CourseListItem, CourseFilters as CourseFiltersType } from '@/types/api';

// Mock data for development
const mockCourses: CourseListItem[] = [
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
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
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

async function getCourses(filters: CourseFiltersType): Promise<{ items: CourseListItem[]; total: number }> {
  if (isDevelopment) {
    // Mock filtering logic
    let filteredCourses = [...mockCourses];
    
    if (filters.q) {
      const query = filters.q.toLowerCase();
      filteredCourses = filteredCourses.filter(course => 
        course.title.toLowerCase().includes(query) ||
        course.summary.toLowerCase().includes(query) ||
        course.instructor.name.toLowerCase().includes(query)
      );
    }
    
    if (filters.level) {
      filteredCourses = filteredCourses.filter(course => course.level === filters.level);
    }
    
    if (filters.price === 'free') {
      filteredCourses = filteredCourses.filter(course => course.price === 0);
    } else if (filters.price === 'paid') {
      filteredCourses = filteredCourses.filter(course => course.price > 0);
    }
    
    if (filters.language) {
      filteredCourses = filteredCourses.filter(course => course.language === filters.language);
    }
    
    // Mock sorting
    if (filters.sort) {
      switch (filters.sort) {
        case 'newest':
          // Mock: reverse order
          filteredCourses.reverse();
          break;
        case 'price_asc':
          filteredCourses.sort((a, b) => a.price - b.price);
          break;
        case 'price_desc':
          filteredCourses.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filteredCourses.sort((a, b) => b.rating - a.rating);
          break;
      }
    }
    
    return createMockResponse({
      items: filteredCourses,
      total: filteredCourses.length,
    }, 500);
  }

  try {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
    
    const response = await apiFetch<{ items: CourseListItem[]; total: number }>(`/courses?${searchParams}`);
    return response;
  } catch (error) {
    console.error('Error fetching courses:', error);
    return { items: [], total: 0 };
  }
}

interface CoursesPageProps {
  searchParams: Promise<{
    q?: string;
    level?: string;
    price?: string;
    language?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const resolvedSearchParams = await searchParams;
  const filters: CourseFiltersType = {
    q: resolvedSearchParams.q,
    level: resolvedSearchParams.level as any,
    price: resolvedSearchParams.price as any,
    language: resolvedSearchParams.language,
    sort: resolvedSearchParams.sort as any,
    page: resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1,
    limit: 12,
  };

  const { items: courses, total } = await getCourses(filters);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Tüm Kurslar
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {total} kurs bulundu
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtreler ve Arama
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Yükleniyor...</div>}>
              <CourseFilters initialFilters={filters} />
            </Suspense>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold">
              Sonuçlar ({total})
            </h2>
            {filters.q && (
              <Badge variant="secondary">
                Arama: "{filters.q}"
              </Badge>
            )}
            {filters.level && (
              <Badge variant="secondary">
                Seviye: {filters.level}
              </Badge>
            )}
            {filters.price && (
              <Badge variant="secondary">
                Fiyat: {filters.price === 'free' ? 'Ücretsiz' : filters.price === 'paid' ? 'Ücretli' : 'Tümü'}
              </Badge>
            )}
          </div>
        </div>

        <Suspense fallback={<CourseGrid courses={[]} loading={true} />}>
          <CourseGrid courses={courses} />
        </Suspense>
      </div>

      {/* Pagination would go here */}
      {total > 12 && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            Daha Fazla Yükle
          </Button>
        </div>
      )}
    </div>
  );
}
