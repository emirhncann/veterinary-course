'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingCart, 
  Search, 
  Filter, 
  MoreHorizontal,
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';

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
import { apiFetch } from '@/lib/fetcher';

interface Order {
  id: string;
  courseId: string;
  course: {
    id: string;
    title: string;
    thumbnail: string;
    price: number;
  };
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod?: string;
  createdAt: string;
  paidAt?: string;
  coupon?: string;
  discount?: number;
}

interface AdminOrdersResponse {
  items: Order[];
  total: number;
  page: number;
  limit: number;
  totalRevenue: number;
}

async function getOrders(filters: { 
  search?: string; 
  status?: string; 
  page?: number; 
}): Promise<AdminOrdersResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (filters.search) searchParams.append('search', filters.search);
    if (filters.status) searchParams.append('status', filters.status);
    if (filters.page) searchParams.append('page', filters.page.toString());
    searchParams.append('limit', '20');

    const response = await apiFetch<AdminOrdersResponse>(`/admin/orders?${searchParams}`);
    return response;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return { 
      items: [], 
      total: 0, 
      page: 1, 
      limit: 20, 
      totalRevenue: 0 
    };
  }
}

async function updateOrderStatus(orderId: string, status: string): Promise<boolean> {
  try {
    await apiFetch(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: { status },
    });
    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState({
    search: '',
    status: '',
  });

  const fetchOrders = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getOrders({ ...filters, page: currentPage });
      setOrders(data.items);
      setTotal(data.total);
      setTotalRevenue(data.totalRevenue);
    } catch (error) {
      console.error('Error loading orders:', error);
      toast.error('Siparişler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: string, orderInfo: string) => {
    if (!confirm(`${orderInfo} siparişinin durumunu "${newStatus}" olarak değiştirmek istediğinize emin misiniz?`)) {
      return;
    }

    const success = await updateOrderStatus(orderId, newStatus);
    if (success) {
      toast.success('Sipariş durumu güncellendi');
      fetchOrders();
    } else {
      toast.error('Sipariş durumu güncellenirken bir hata oluştu');
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
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"><CheckCircle className="h-3 w-3 mr-1" />Ödendi</Badge>;
      case 'pending':
        return <Badge variant="secondary"><Clock className="h-3 w-3 mr-1" />Bekliyor</Badge>;
      case 'failed':
        return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Başarısız</Badge>;
      case 'refunded':
        return <Badge variant="outline">İade Edildi</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600';
      case 'pending': return 'text-yellow-600';
      case 'failed': return 'text-red-600';
      case 'refunded': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  if (loading) {
    return (
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <div key={index} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
    );
  }

  return (
    <AuthGuard requiredRole="admin">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sipariş Yönetimi
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {total} sipariş bulundu
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-lg font-bold">{formatCurrency(totalRevenue)}</div>
                  <div className="text-xs text-muted-foreground">Toplam Gelir</div>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-lg font-bold">{total}</div>
                  <div className="text-xs text-muted-foreground">Toplam Sipariş</div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Sipariş ara (ID, email, kurs)..."
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
                  <SelectItem value="paid">Ödendi</SelectItem>
                  <SelectItem value="pending">Bekliyor</SelectItem>
                  <SelectItem value="failed">Başarısız</SelectItem>
                  <SelectItem value="refunded">İade Edildi</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={fetchOrders}>
                <Filter className="h-4 w-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardContent className="p-0">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <ShoppingCart className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Sipariş bulunamadı</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Arama kriterlerinizi değiştirerek tekrar deneyin.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left p-4 font-medium">Sipariş</th>
                      <th className="text-left p-4 font-medium">Müşteri</th>
                      <th className="text-left p-4 font-medium">Kurs</th>
                      <th className="text-left p-4 font-medium">Tutar</th>
                      <th className="text-left p-4 font-medium">Durum</th>
                      <th className="text-left p-4 font-medium">Tarih</th>
                      <th className="text-left p-4 font-medium">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="p-4">
                          <div>
                            <h4 className="font-medium">#{order.id.slice(0, 8)}</h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {order.paymentMethod || 'Kredi Kartı'}
                            </p>
                            {order.coupon && (
                              <Badge variant="outline" className="mt-1 text-xs">
                                Kupon: {order.coupon}
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <h4 className="font-medium">
                              {order.user.first_name} {order.user.last_name}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-300">
                              {order.user.email}
                            </p>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-8 rounded overflow-hidden">
                              <Image
                                src={order.course.thumbnail}
                                alt={order.course.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-sm line-clamp-1">
                                {order.course.title}
                              </h4>
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                {formatCurrency(order.course.price)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>
                            <div className="font-medium">{formatCurrency(order.amount)}</div>
                            {order.discount && order.discount > 0 && (
                              <p className="text-xs text-green-600">
                                -{formatCurrency(order.discount)} indirim
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(order.status)}
                        </td>
                        <td className="p-4">
                          <div className="text-sm">
                            <div>{formatDate(order.createdAt)}</div>
                            {order.paidAt && (
                              <p className="text-xs text-gray-600 dark:text-gray-300">
                                Ödendi: {formatDate(order.paidAt)}
                              </p>
                            )}
                          </div>
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
                                <Link href={`/admin/orders/${order.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Detayları Görüntüle
                                </Link>
                              </DropdownMenuItem>
                              {order.status === 'pending' && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(
                                    order.id, 
                                    'paid', 
                                    `#${order.id.slice(0, 8)}`
                                  )}
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Ödendi Olarak İşaretle
                                </DropdownMenuItem>
                              )}
                              {order.status === 'pending' && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(
                                    order.id, 
                                    'failed', 
                                    `#${order.id.slice(0, 8)}`
                                  )}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Başarısız Olarak İşaretle
                                </DropdownMenuItem>
                              )}
                              {order.status === 'paid' && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(
                                    order.id, 
                                    'refunded', 
                                    `#${order.id.slice(0, 8)}`
                                  )}
                                  className="text-orange-600 focus:text-orange-600"
                                >
                                  İade Et
                                </DropdownMenuItem>
                              )}
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
        {total > 20 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, total)} / {total} sipariş
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
                disabled={currentPage * 20 >= total}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                Sonraki
              </Button>
            </div>
          </div>
        )}
      </div>
  );
}
