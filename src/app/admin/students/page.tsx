'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  BookOpen,
  Eye,
  Ban,
  UserCheck
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
import type { User } from '@/types/api';

interface AdminStudentsResponse {
  items: User[];
  total: number;
  page: number;
  limit: number;
}

async function getStudents(filters: { 
  search?: string; 
  status?: string; 
  page?: number; 
}): Promise<AdminStudentsResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (filters.search) searchParams.append('search', filters.search);
    if (filters.status) searchParams.append('status', filters.status);
    if (filters.page) searchParams.append('page', filters.page.toString());
    searchParams.append('limit', '20');

    const response = await apiFetch<AdminStudentsResponse>(`/admin/students?${searchParams}`);
    return response;
  } catch (error) {
    console.error('Error fetching students:', error);
    return { items: [], total: 0, page: 1, limit: 20 };
  }
}

async function updateStudentStatus(studentId: string, status: 'active' | 'inactive'): Promise<boolean> {
  try {
    await apiFetch(`/admin/students/${studentId}/status`, {
      method: 'PATCH',
      body: { status },
    });
    return true;
  } catch (error) {
    console.error('Error updating student status:', error);
    return false;
  }
}

export default function AdminStudentsPage() {
  const [students, setStudents] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [total, setTotal] = React.useState(0);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [filters, setFilters] = React.useState({
    search: '',
    status: '',
  });

  const fetchStudents = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await getStudents({ ...filters, page: currentPage });
      setStudents(data.items);
      setTotal(data.total);
    } catch (error) {
      console.error('Error loading students:', error);
      toast.error('Öğrenciler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  React.useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleStatusUpdate = async (studentId: string, currentStatus: string, name: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'aktif' : 'pasif';
    
    if (!confirm(`${name} adlı öğrenciyi ${action} yapmak istediğinize emin misiniz?`)) {
      return;
    }

    const success = await updateStudentStatus(studentId, newStatus);
    if (success) {
      toast.success(`Öğrenci durumu ${action} olarak güncellendi`);
      fetchStudents();
    } else {
      toast.error('Öğrenci durumu güncellenirken bir hata oluştu');
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (role?: string) => {
    switch (role) {
      case 'admin': return <Badge variant="destructive">Admin</Badge>;
      case 'instructor': return <Badge variant="default">Eğitmen</Badge>;
      case 'student': return <Badge variant="secondary">Öğrenci</Badge>;
      default: return <Badge variant="outline">Bilinmiyor</Badge>;
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
              Öğrenci Yönetimi
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              {total} öğrenci bulundu
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <div className="text-lg font-bold">{total}</div>
                  <div className="text-xs text-muted-foreground">Toplam Öğrenci</div>
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
                  placeholder="Öğrenci ara (isim, email)..."
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
                  <SelectItem value="inactive">Pasif</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={fetchStudents}>
                <Filter className="h-4 w-4 mr-2" />
                Filtrele
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Students Table */}
        <Card>
          <CardContent className="p-0">
            {students.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Users className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Öğrenci bulunamadı</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Arama kriterlerinizi değiştirerek tekrar deneyin.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left p-4 font-medium">Öğrenci</th>
                      <th className="text-left p-4 font-medium">İletişim</th>
                      <th className="text-left p-4 font-medium">Rol</th>
                      <th className="text-left p-4 font-medium">Kayıt Tarihi</th>
                      <th className="text-left p-4 font-medium">Kurslar</th>
                      <th className="text-left p-4 font-medium">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                              {student.avatar ? (
                                <Image
                                  src={student.avatar}
                                  alt={`${student.first_name} ${student.last_name}`}
                                  width={40}
                                  height={40}
                                  className="rounded-full object-cover"
                                />
                              ) : (
                                <span className="text-sm font-medium text-primary-foreground">
                                  {student.first_name.charAt(0)}{student.last_name.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium">
                                {student.first_name} {student.last_name}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                ID: {student.national_id || 'Belirtilmemiş'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span>{student.email}</span>
                            </div>
                            {student.phone && (
                              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span>{student.phone}</span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(student.role)}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-3 w-3 text-gray-400" />
                            <span>{formatDate(student.created_at)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-sm">
                            <BookOpen className="h-3 w-3 text-gray-400" />
                            <span>{Math.floor(Math.random() * 5)} kurs</span>
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
                                <Link href={`/admin/students/${student.id}`}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  Detayları Görüntüle
                                </Link>
                              </DropdownMenuItem>
                              {student.role === 'student' && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(
                                    student.id.toString(), 
                                    'active', 
                                    `${student.first_name} ${student.last_name}`
                                  )}
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Durumu Değiştir
                                </DropdownMenuItem>
                              )}
                              {student.role === 'student' && (
                                <DropdownMenuItem
                                  onClick={() => handleStatusUpdate(
                                    student.id.toString(), 
                                    'inactive', 
                                    `${student.first_name} ${student.last_name}`
                                  )}
                                  className="text-red-600 focus:text-red-600"
                                >
                                  <Ban className="h-4 w-4 mr-2" />
                                  Hesabı Askıya Al
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
              {((currentPage - 1) * 20) + 1} - {Math.min(currentPage * 20, total)} / {total} öğrenci
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
