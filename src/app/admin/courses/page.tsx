'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Search,
  Filter,
  ArrowUpDown
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AuthGuard } from '@/components/AuthGuard';
import { apiFetch } from '@/lib/fetcher';
import { useAdminActions } from '@/lib/hooks/useAdminActions';
import type { CourseListItem } from '@/types/api';

interface AdminCoursesResponse {
  items: CourseListItem[];
  total: number;
  page: number;
  limit: number;
}

async function getCourses(filters: { 
  search?: string; 
  status?: string; 
  level?: string; 
  page?: number; 
}): Promise<AdminCoursesResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (filters.search) searchParams.append('search', filters.search);
    if (filters.status) searchParams.append('status', filters.status);
    if (filters.level) searchParams.append('level', filters.level);
    if (filters.page) searchParams.append('page', filters.page.toString());
    searchParams.append('limit', '10');

    const response = await apiFetch<{ status: string; data: AdminCoursesResponse }>(`/admin/courses?${searchParams}`);
    
    if (response.status === 'success' && response.data) {
      return response.data;
    }
    
    return { items: [], total: 0, page: 1, limit: 10 };
  } catch (error) {
    console.error('Error fetching admin courses:', error);
    return { items: [], total: 0, page: 1, limit: 10 };
  }
}

async function deleteCourse(courseId: string): Promise<boolean> {
  try {
    await apiFetch(`/admin/courses/${courseId}`, {
      method: 'DELETE',
    });
    return true;
  } catch (error) {
    console.error('Error deleting course:', error);
    throw error; // Hata fırlatarak executeWithLoading'in handle etmesini sağlıyoruz
  }
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = React.useState<CourseListItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState({
    search: '',
    status: '',
    level: '',
  });
  
  const { executeWithLoading, notifySuccess, notifyError } = useAdminActions();

  const fetchCourses = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await executeWithLoading(
        () => getCourses({ ...filters, page: currentPage }),
        {
          category: 'courses',
          action: 'Kursları yükle',
          successMessage: 'Kurslar Yüklendi',
          errorMessage: 'Kurslar Yüklenemedi',
          loadingMessage: 'Kurslar Yükleniyor'
        }
      );
      setCourses(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage, executeWithLoading]);

  React.useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const handleDeleteCourse = async (courseId: string, title: string) => {
    if (!confirm(`"${title}" kursunu silmek istediğinize emin misiniz?`)) {
      return;
    }

    try {
      await executeWithLoading(
        () => deleteCourse(courseId),
        {
          category: 'courses',
          action: `"${title}" kursunu sil`,
          successMessage: 'Kurs Silindi',
          errorMessage: 'Kurs Silinemedi',
          loadingMessage: 'Kurs Siliniyor'
        }
      );
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'beginner': return 'secondary';
      case 'intermediate': return 'default';
      case 'advanced': return 'destructive';
      default: return 'secondary';
    }
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Başlangıç';
      case 'intermediate': return 'Orta';
      case 'advanced': return 'İleri';
      default: return level;
    }
  };

  if (loading) {
    return (
      <AuthGuard requiredRole="admin">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-20 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Kurs Yönetimi
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {total} kurs bulundu
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/courses/new">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Kurs Ekle
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Kurs ara..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Durum" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tümü</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="draft">Taslak</SelectItem>
                  <SelectItem value="inactive">Pasif</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filters.level} onValueChange={(value) => handleFilterChange('level', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seviye" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Tümü</SelectItem>
                  <SelectItem value="beginner">Başlangıç</SelectItem>
                  <SelectItem value="intermediate">Orta</SelectItem>
                  <SelectItem value="advanced">İleri</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={fetchCourses}>
                <Filter className="h-4 w-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Courses Table */}
        <Card>
          <CardContent className="p-0">
            {courses.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Kurs bulunamadı</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Arama kriterlerinizi değiştirin veya yeni bir kurs ekleyin.
                </p>
                <Button asChild>
                  <Link href="/admin/courses/new">
                    <Plus className="h-4 w-4 mr-2" />
                    İlk Kursunuzu Ekleyin
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left p-4 font-medium">Kurs</th>
                      <th className="text-left p-4 font-medium">Fiyat</th>
                      <th className="text-left p-4 font-medium">Seviye</th>
                      <th className="text-left p-4 font-medium">Öğrenci</th>
                      <th className="text-left p-4 font-medium">Durum</th>
                      <th className="text-left p-4 font-medium">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-16 h-12 rounded overflow-hidden">
                              <Image
                                src={course.thumbnail}
                                alt={course.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium line-clamp-1">{course.title}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-1">
                                {course.summary}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-medium">
                            {course.price === 0 ? 'Ücretsiz' : formatCurrency(course.price)}
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant={getLevelBadgeVariant(course.level)}>
                            {getLevelText(course.level)}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            {Math.floor(Math.random() * 500)} öğrenci
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge variant="default">
                            Aktif
                          </Badge>
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem asChild>
                                <Link href={`/courses/${course.slug}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Görüntüle
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/courses/${course.id}/edit`}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Düzenle
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteCourse(course.id, course.title)}
                                className="text-red-600 focus:text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Sil
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {total > 10 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {((currentPage - 1) * 10) + 1} - {Math.min(currentPage * 10, total)} / {total} kurs
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              >
                Önceki
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage * 10 >= total}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Sonraki
              </Button>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}