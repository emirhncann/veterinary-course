'use client';

import * as React from 'react';
import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, SortAsc } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CourseGrid } from '@/components/CourseGrid';
import { CourseFilters } from '@/components/CourseFilters';
import { apiFetch } from '@/lib/fetcher';
import type { CourseListItem, CourseFilters as CourseFiltersType } from '@/types/api';

// Client-side data fetching hook
function useCourses() {
  const searchParams = useSearchParams();
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const filters: CourseFiltersType = {
    q: searchParams.get('q') || undefined,
    level: (searchParams.get('level') as 'beginner' | 'intermediate' | 'advanced') || undefined,
    price: (searchParams.get('price') as 'free' | 'paid') || undefined,
    language: searchParams.get('language') || undefined,
    sort: (searchParams.get('sort') as 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'rating') || undefined,
    page: searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1,
    limit: 12,
  };

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const searchParamsStr = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) searchParamsStr.append(key, value.toString());
        });
        
        const response = await apiFetch<{ items: CourseListItem[]; total: number }>(`/courses?${searchParamsStr}`);
        setCourses(response.items);
        setTotal(response.total);
      } catch (error) {
        console.error('Error fetching courses:', error);
        setCourses([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [searchParams]);

  return { courses, total, loading, filters };
}

function CoursesContent() {
  const { courses, total, loading, filters } = useCourses();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Kurslar yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          Tüm Kurslar
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          {total > 0 ? `${total} kurs bulundu` : 'Kurs bulunamadı'}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <CourseFilters initialFilters={filters} />
        </div>

        {/* Course Grid */}
        <div className="lg:col-span-3">
          {courses.length > 0 ? (
            <CourseGrid courses={courses} />
          ) : (
            <div className="text-center py-12">
              <div className="mb-4">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Kurs bulunamadı
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Arama kriterlerinizi değiştirerek tekrar deneyin.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Kurslar yükleniyor...</p>
        </div>
      </div>
    }>
      <CoursesContent />
    </Suspense>
  );
}