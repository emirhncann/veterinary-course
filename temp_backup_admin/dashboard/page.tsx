'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus,
  Edit,
  Eye,
  BarChart3,
  Settings
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthGuard } from '@/components/AuthGuard';
import { apiFetch } from '@/lib/fetcher';

// Mock data for dashboard
const mockStats = {
  totalCourses: 8,
  totalStudents: 1247,
  totalRevenue: 45680,
  monthlyRevenue: 12340,
  recentCourses: [
    {
      id: '1',
      title: 'React.js Temelleri',
      students: 234,
      revenue: 70020,
      status: 'active',
      createdAt: '2024-01-15',
    },
    {
      id: '2',
      title: 'Python ile Veri Bilimi',
      students: 189,
      revenue: 75510,
      status: 'active',
      createdAt: '2024-01-10',
    },
    {
      id: '3',
      title: 'UI/UX Tasarım',
      students: 156,
      revenue: 38940,
      status: 'active',
      createdAt: '2024-01-05',
    },
  ],
};

async function getDashboardStats() {
  try {
    const response = await apiFetch('/admin/dashboard/stats');
    return response;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return mockStats;
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = React.useState(mockStats);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getDashboardStats();
        setStats(data as typeof stats);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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

  if (loading) {
    return (
      <AuthGuard requiredRole="admin">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 bg-muted rounded"></div>
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
              Admin Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Kurs platformu yönetim paneli
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild>
              <Link href="/admin/courses/new">
                <Plus className="h-4 w-4 mr-2" />
                Yeni Kurs
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/admin/settings">
                <Settings className="h-4 w-4 mr-2" />
                Ayarlar
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalCourses}</div>
                  <div className="text-sm text-muted-foreground">Toplam Kurs</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{stats.totalStudents.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Toplam Öğrenci</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
                  <div className="text-sm text-muted-foreground">Toplam Gelir</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{formatCurrency(stats.monthlyRevenue)}</div>
                  <div className="text-sm text-muted-foreground">Bu Ay Gelir</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Courses */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Son Eklenen Kurslar</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/admin/courses">
                    Tümünü Gör
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentCourses.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{course.title}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                        <span>{course.students} öğrenci</span>
                        <span>{formatCurrency(course.revenue)} gelir</span>
                        <span>{formatDate(course.createdAt)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={course.status === 'active' ? 'default' : 'secondary'}>
                        {course.status === 'active' ? 'Aktif' : 'Pasif'}
                      </Badge>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/courses/${course.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hızlı İşlemler</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button asChild className="h-20 flex-col">
                  <Link href="/admin/courses/new">
                    <Plus className="h-6 w-6 mb-2" />
                    Yeni Kurs Ekle
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="h-20 flex-col">
                  <Link href="/admin/courses">
                    <BookOpen className="h-6 w-6 mb-2" />
                    Kursları Yönet
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="h-20 flex-col">
                  <Link href="/admin/students">
                    <Users className="h-6 w-6 mb-2" />
                    Öğrencileri Gör
                  </Link>
                </Button>
                
                <Button variant="outline" asChild className="h-20 flex-col">
                  <Link href="/admin/analytics">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    Analitikler
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Son Aktiviteler</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Yeni kurs eklendi:</span> React.js Temelleri
                  </p>
                  <p className="text-xs text-muted-foreground">2 saat önce</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Yeni öğrenci kaydı:</span> 15 öğrenci
                  </p>
                  <p className="text-xs text-muted-foreground">4 saat önce</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <DollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm">
                    <span className="font-medium">Yeni satış:</span> {formatCurrency(2990)}
                  </p>
                  <p className="text-xs text-muted-foreground">6 saat önce</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
