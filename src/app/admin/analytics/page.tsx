'use client';

import * as React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  DollarSign,
  Users,
  BookOpen,
  ShoppingCart,
  Calendar
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/fetcher';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    revenueChange: number;
    totalStudents: number;
    studentsChange: number;
    totalCourses: number;
    coursesChange: number;
    totalOrders: number;
    ordersChange: number;
  };
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
  }>;
  topCourses: Array<{
    id: string;
    title: string;
    students: number;
    revenue: number;
  }>;
  recentActivity: Array<{
    id: string;
    type: 'enrollment' | 'purchase' | 'course_created';
    message: string;
    timestamp: string;
  }>;
}

async function getAnalytics(): Promise<AnalyticsData | null> {
  try {
    const response = await apiFetch<AnalyticsData>('/admin/analytics');
    return response;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return null;
  }
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = React.useState<AnalyticsData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const data = await getAnalytics();
        setAnalytics(data);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? (
      <TrendingUp className="h-4 w-4 text-green-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-red-600" />
    );
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-32 bg-muted rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-64 bg-muted rounded"></div>
            </div>
          </div>
        </div>
    );
  }

  if (!analytics) {
    return (
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Analitik veriler yüklenemedi</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Lütfen daha sonra tekrar deneyin.
            </p>
          </div>
        </div>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Analitikler
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Platform performansı ve istatistikleri
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(analytics.overview.totalRevenue)}
                  </div>
                  <div className="text-sm text-muted-foreground">Toplam Gelir</div>
                  <div className={`flex items-center gap-1 text-sm mt-1 ${getChangeColor(analytics.overview.revenueChange)}`}>
                    {getChangeIcon(analytics.overview.revenueChange)}
                    {formatPercentage(analytics.overview.revenueChange)} bu ay
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">
                    {analytics.overview.totalStudents.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">Toplam Öğrenci</div>
                  <div className={`flex items-center gap-1 text-sm mt-1 ${getChangeColor(analytics.overview.studentsChange)}`}>
                    {getChangeIcon(analytics.overview.studentsChange)}
                    {formatPercentage(analytics.overview.studentsChange)} bu ay
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{analytics.overview.totalCourses}</div>
                  <div className="text-sm text-muted-foreground">Toplam Kurs</div>
                  <div className={`flex items-center gap-1 text-sm mt-1 ${getChangeColor(analytics.overview.coursesChange)}`}>
                    {getChangeIcon(analytics.overview.coursesChange)}
                    {formatPercentage(analytics.overview.coursesChange)} bu ay
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{analytics.overview.totalOrders}</div>
                  <div className="text-sm text-muted-foreground">Toplam Sipariş</div>
                  <div className={`flex items-center gap-1 text-sm mt-1 ${getChangeColor(analytics.overview.ordersChange)}`}>
                    {getChangeIcon(analytics.overview.ordersChange)}
                    {formatPercentage(analytics.overview.ordersChange)} bu ay
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Revenue Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Aylık Gelir Trendi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.monthlyRevenue.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.month}</span>
                    <span className="text-sm">{formatCurrency(item.revenue)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Courses */}
          <Card>
            <CardHeader>
              <CardTitle>En Popüler Kurslar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analytics.topCourses.map((course, index) => (
                  <div key={course.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{index + 1}</Badge>
                      <div>
                        <h4 className="font-medium text-sm">{course.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {course.students} öğrenci
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {formatCurrency(course.revenue)}
                      </div>
                    </div>
                  </div>
                ))}
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
            <div className="space-y-4">
              {analytics.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                    {activity.type === 'enrollment' && <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                    {activity.type === 'purchase' && <ShoppingCart className="h-4 w-4 text-green-600 dark:text-green-400" />}
                    {activity.type === 'course_created' && <BookOpen className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.timestamp).toLocaleString('tr-TR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
  );
}
