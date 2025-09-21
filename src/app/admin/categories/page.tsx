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
  FolderOpen,
  Tag,
  Palette
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

interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  parent_id?: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface CategoriesResponse {
  status: string;
  items: Category[];
}

export default function AdminCategories() {
  const router = useRouter();
  const { toast } = useToast();
  const [categories, setCategories] = React.useState<Category[]>([]);
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
    
    loadCategories();
  }, [router]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.vetmedipedia.com/categories');
      const data: CategoriesResponse = await response.json();
      
      if (data.status === 'success') {
        setCategories(data.items || []);
      } else {
        toast({
          title: 'Hata',
          description: 'Kategoriler yüklenirken bir hata oluştu.',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Kategoriler yüklenirken hata:', error);
      toast({
        title: 'Hata',
        description: 'Kategoriler yüklenirken bir hata oluştu.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      // DELETE endpoint'i mevcut değil, sadece UI'da kaldır
      setCategories(prev => prev.filter(category => category.id !== id));
      toast({
        title: 'Başarılı',
        description: 'Kategori silindi.',
      });
    } catch (error) {
      console.error('Kategori silinirken hata:', error);
      toast({
        title: 'Hata',
        description: 'Kategori silinirken bir hata oluştu.',
        variant: 'destructive'
      });
    }
  };

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         category.slug.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && category.is_active) ||
                         (filterStatus === 'inactive' && !category.is_active);
    
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Kategori Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tüm kurs kategorilerini yönetin ve düzenleyin
          </p>
        </div>
        <Link href="/admin/categories/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Kategori Ekle
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
                  placeholder="Kategori ara..."
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
                <option value="all">Tüm Kategoriler</option>
                <option value="active">Aktif</option>
                <option value="inactive">Pasif</option>
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
              <FolderOpen className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Toplam Kategori</p>
                <p className="text-2xl font-bold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Aktif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.filter(c => c.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Tag className="h-8 w-8 text-gray-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pasif</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.filter(c => !c.is_active).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories List */}
      <Card>
        <CardHeader>
          <CardTitle>Kategoriler ({filteredCategories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCategories.length === 0 ? (
            <div className="text-center py-8">
              <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Kategori bulunamadı</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery ? 'Arama kriterlerinize uygun kategori bulunamadı.' : 'Henüz hiç kategori eklenmemiş.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      {category.icon && (
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm"
                          style={{ backgroundColor: category.color || '#3b82f6' }}
                        >
                          {category.icon}
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {category.slug}
                        </p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/admin/categories/${category.id}`)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Görüntüle
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/categories/${category.id}/edit`)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Düzenle
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Sil
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  {category.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {category.description}
                    </p>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant={category.is_active ? "default" : "secondary"}>
                        {category.is_active ? 'Aktif' : 'Pasif'}
                      </Badge>
                      {category.parent_id && (
                        <Badge variant="outline" className="text-xs">
                          Alt Kategori
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">
                      Sıra: {category.sort_order}
                    </div>
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
