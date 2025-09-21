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
  Settings,
  AlertCircle,
  AlertTriangle
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuthGuard } from '@/components/AuthGuard';
import { apiFetch } from '@/lib/fetcher';
import { useToast } from '@/lib/stores/useToast';
import { useAdminLogs } from '@/lib/stores/useAdminLogs';
import { useAdminActions } from '@/lib/hooks/useAdminActions';

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  monthlyRevenue: number;
  recentCourses: Array<{
    id: string;
    title: string;
    students: number;
    revenue: number;
    status: string;
    createdAt: string;
  }>;
}

async function getDashboardStats(): Promise<DashboardStats | null> {
  try {
    const response = await apiFetch<{ status: string; data: DashboardStats }>('/admin/dashboard');
    
    if (response.status === 'success' && response.data) {
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return null;
  }
}

export default function AdminDashboard() {
  const [stats, setStats] = React.useState<DashboardStats | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { success, error, loading: toastLoading } = useToast();
  const { logInfo, logError, logSuccess, getRecentLogs, clearLogs } = useAdminLogs();
  const { executeWithLoading, notifySuccess } = useAdminActions();

  React.useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      
      try {
        const data = await executeWithLoading(
          () => getDashboardStats(),
          {
            category: 'system',
            action: 'Dashboard yükleme',
            successMessage: 'Dashboard Yüklendi',
            errorMessage: 'Dashboard Yüklenemedi',
            loadingMessage: 'Dashboard Yükleniyor'
          }
        );
        setStats(data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [executeWithLoading]);

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

  if (loading || !stats) {
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

        {/* Recent Activity - Gerçek Log Verileri */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Son Aktiviteler</CardTitle>
              <Button variant="outline" size="sm" onClick={() => {
                clearLogs();
                notifySuccess('system', 'Admin logları temizlendi', 'Loglar Temizlendi', 'Kullanıcı tarafından manuel olarak temizlendi');
              }}>
                Logları Temizle
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {getRecentLogs(10).length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>Henüz aktivite yok</p>
                  <p className="text-sm">Admin işlemleri burada görünecek</p>
                </div>
              ) : (
                getRecentLogs(10).map((log) => {
                  const getLogIcon = () => {
                    switch (log.level) {
                      case 'success': return <Plus className="h-4 w-4 text-green-600 dark:text-green-400" />;
                      case 'error': return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />;
                      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
                      default: return <Eye className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
                    }
                  };

                  const getLogColor = () => {
                    switch (log.level) {
                      case 'success': return 'bg-green-100 dark:bg-green-900';
                      case 'error': return 'bg-red-100 dark:bg-red-900';
                      case 'warning': return 'bg-yellow-100 dark:bg-yellow-900';
                      default: return 'bg-blue-100 dark:bg-blue-900';
                    }
                  };

                  return (
                    <div key={log.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`w-8 h-8 ${getLogColor()} rounded-full flex items-center justify-center`}>
                        {getLogIcon()}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm">
                          <span className="font-medium capitalize">{log.category}:</span> {log.action}
                        </p>
                        {log.details && (
                          <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(log.timestamp).toLocaleString('tr-TR')}
                        </p>
                      </div>
                      <Badge variant={log.level === 'error' ? 'destructive' : log.level === 'success' ? 'default' : 'secondary'}>
                        {log.level}
                      </Badge>
                    </div>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
