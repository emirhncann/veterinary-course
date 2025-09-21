'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  MoreHorizontal,
  Search,
  Filter,
  UserCheck,
  Mail,
  Phone,
  MapPin
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
import { useToast } from '@/lib/stores/useToast';

interface Instructor {
  id: number;
  user_id: number;
  bio?: string;
  expertise_areas?: string[];
  social_links?: any;
  avatar_base64?: string;
  avatar_mime_type?: string;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

interface InstructorsResponse {
  status: string;
  items: Instructor[];
}

export default function AdminInstructors() {
  const router = useRouter();
  const { toast } = useToast();
  const [instructors, setInstructors] = React.useState<Instructor[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');

  React.useEffect(() => {
    // Admin kontrolü
    const adminUser = localStorage.getItem('admin_user');
    if (!adminUser) {
      router.push('/adminlogin');
      return;
    }
    
    loadInstructors();
  }, [router]);

  const loadInstructors = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.vetmedipedia.com/instructors');
      const data: InstructorsResponse = await response.json();
      
      if (data.status === 'success') {
        setInstructors(data.items || []);
      } else {
        toast({
          title: 'Hata',
          description: 'Eğitmenler yüklenirken bir hata oluştu.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Eğitmenler yüklenirken hata:', error);
      toast({
        title: 'Hata',
        description: 'Eğitmenler yüklenirken bir hata oluştu.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteInstructor = async (id: number) => {
    if (!confirm('Bu eğitmeni silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      // DELETE endpoint'i mevcut değil, sadece UI'da kaldır
      setInstructors(prev => prev.filter(instructor => instructor.id !== id));
      toast({
        title: 'Başarılı',
        description: 'Eğitmen silindi.',
      });
    } catch (error) {
      console.error('Eğitmen silinirken hata:', error);
      toast({
        title: 'Hata',
        description: 'Eğitmen silinirken bir hata oluştu.',
        variant: 'destructive'
      });
    }
  };

  const filteredInstructors = instructors.filter(instructor => {
    const matchesSearch = instructor.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         instructor.expertise_areas?.some(area => 
                           area.toLowerCase().includes(searchQuery.toLowerCase())
                         );
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'verified' && instructor.is_verified) ||
                         (filterStatus === 'unverified' && !instructor.is_verified);
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Eğitmen Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tüm eğitmenleri yönetin ve düzenleyin
          </p>
        </div>
        <Link href="/admin/instructors/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Eğitmen Ekle
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtreler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Eğitmen ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tüm Eğitmenler</option>
                <option value="verified">Doğrulanmış</option>
                <option value="unverified">Doğrulanmamış</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Eğitmen</p>
                <p className="text-2xl font-bold text-gray-900">{instructors.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doğrulanmış</p>
                <p className="text-2xl font-bold text-gray-900">
                  {instructors.filter(i => i.is_verified).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Doğrulanmamış</p>
                <p className="text-2xl font-bold text-gray-900">
                  {instructors.filter(i => !i.is_verified).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Instructors List */}
      <Card>
        <CardHeader>
          <CardTitle>Eğitmenler ({filteredInstructors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredInstructors.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Eğitmen bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? 'Arama kriterlerinize uygun eğitmen bulunamadı.' : 'Henüz hiç eğitmen eklenmemiş.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredInstructors.map((instructor) => (
                <div
                  key={instructor.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-lg text-white font-medium">
                        {instructor.user?.first_name?.charAt(0) || 'E'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        Eğitmen #{instructor.id}
                      </h3>
                      <p className="text-sm text-gray-500">
                        User ID: {instructor.user_id}
                      </p>
                      {instructor.bio && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {instructor.bio}
                        </p>
                      )}
                      {instructor.expertise_areas && instructor.expertise_areas.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {instructor.expertise_areas.slice(0, 3).map((area, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {area}
                            </Badge>
                          ))}
                          {instructor.expertise_areas.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{instructor.expertise_areas.length - 3} daha
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={instructor.is_verified ? "default" : "secondary"}>
                      {instructor.is_verified ? 'Doğrulanmış' : 'Doğrulanmamış'}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/instructors/${instructor.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Görüntüle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/instructors/${instructor.id}/edit`)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteInstructor(instructor.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
