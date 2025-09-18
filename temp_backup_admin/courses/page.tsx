'use client';

import * as React from 'react';
import Link from 'next/link';
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
import type { CourseListItem } from '@/types/api';

// Mock data for admin courses
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

async function getAdminCourses(): Promise<CourseListItem[]> {
  try {
    const response = await apiFetch<CourseListItem[]>('/admin/courses');
    return response;
  } catch (error) {
    console.error('Error fetching admin courses:', error);
    return mockCourses;
  }
}

export default function AdminCoursesPage() {
  const [courses, setCourses] = React.useState<CourseListItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [levelFilter, setLevelFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('newest');

  React.useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const data = await getAdminCourses();
        setCourses(data);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

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
      return `${hours}s ${mins}dk`;
    }
    return `${mins}dk`;
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

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLevel = levelFilter === 'all' || course.level === levelFilter;
    
    return matchesSearch && matchesLevel;
  });

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return 0; // Mock data, no date sorting
      case 'oldest':
        return 0;
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleDeleteCourse = async (courseId: string) => {
    if (confirm('Bu kursu silmek istediğinizden emin misiniz?')) {
      try {
        await apiFetch(`/admin/courses/${courseId}`, {
          method: 'DELETE',
        });
        
        setCourses(prev => prev.filter(course => course.id !== courseId));
      } catch (error) {
        console.error('Error deleting course:', error);
      }
    }
  };

  if (loading) {
    return (
      <AuthGuard requiredRole="admin">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-64 bg-muted rounded"></div>
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
              Tüm kursları yönetin ve düzenleyin
            </p>
          </div>
          <Button asChild>
            <Link href="/admin/courses/new">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Kurs
            </Link>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Kurs ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={levelFilter} onValueChange={setLevelFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Seviye" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tüm Seviyeler</SelectItem>
                  <SelectItem value="beginner">Başlangıç</SelectItem>
                  <SelectItem value="intermediate">Orta</SelectItem>
                  <SelectItem value="advanced">İleri</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sırala" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">En Yeni</SelectItem>
                  <SelectItem value="oldest">En Eski</SelectItem>
                  <SelectItem value="price_asc">Fiyat (Düşük → Yüksek)</SelectItem>
                  <SelectItem value="price_desc">Fiyat (Yüksek → Düşük)</SelectItem>
                  <SelectItem value="rating">En Yüksek Puan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCourses.map((course) => (
            <Card key={course.id} className="group overflow-hidden transition-all duration-300 hover:shadow-lg">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                
                {/* Level Badge */}
                <div className="absolute top-3 left-3">
                  <Badge className={getLevelColor(course.level)}>
                    {getLevelText(course.level)}
                  </Badge>
                </div>

                {/* Price Badge */}
                <div className="absolute top-3 right-3">
                  <Badge variant="secondary" className="bg-black/70 text-white">
                    {formatPrice(course.price)}
                  </Badge>
                </div>

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="secondary" asChild>
                      <Link href={`/courses/${course.slug}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="sm" variant="secondary" asChild>
                      <Link href={`/admin/courses/${course.id}/edit`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  {/* Title */}
                  <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                    {course.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {course.summary}
                  </p>

                  {/* Instructor */}
                  <div className="flex items-center space-x-2">
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="w-6 h-6 rounded-full"
                    />
                    <span className="text-sm text-muted-foreground">
                      {course.instructor.name}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <span>⭐ {course.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>⏱️ {formatDuration(course.duration)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <span>📚 {course.totalLessons} ders</span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <div className="p-4 pt-0">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-bold text-primary">
                    {formatPrice(course.price)}
                  </div>
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
                        onClick={() => handleDeleteCourse(course.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Sil
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {sortedCourses.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
              <Search className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Kurs bulunamadı</h3>
            <p className="text-muted-foreground mb-6">
              Aradığınız kriterlere uygun kurs bulunamadı.
            </p>
            <Button asChild>
              <Link href="/admin/courses/new">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Kurs Oluştur
              </Link>
            </Button>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
