'use client';

import * as React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CourseFilters as CourseFiltersType } from '@/types/api';

interface CourseFiltersProps {
  initialFilters: CourseFiltersType;
}

export function CourseFilters({ initialFilters }: CourseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = React.useState(initialFilters.q || '');

  const updateFilters = (newFilters: Partial<CourseFiltersType>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== '') {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    // Reset to first page when filters change
    params.delete('page');
    
    router.push(`/courses?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    router.push('/courses');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchQuery });
  };

  const hasActiveFilters = searchParams.has('q') || 
    searchParams.has('level') || 
    searchParams.has('price') || 
    searchParams.has('language') || 
    searchParams.has('sort');

  return (
    <div className="space-y-6">
      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Kurs, eğitmen veya konu ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button type="submit">Ara</Button>
      </form>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Level Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Seviye</label>
          <Select
            value={initialFilters.level || 'all'}
            onValueChange={(value) => updateFilters({ level: value === 'all' ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tüm seviyeler" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm seviyeler</SelectItem>
              <SelectItem value="beginner">Başlangıç</SelectItem>
              <SelectItem value="intermediate">Orta</SelectItem>
              <SelectItem value="advanced">İleri</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Price Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Fiyat</label>
          <Select
            value={initialFilters.price || 'all'}
            onValueChange={(value) => updateFilters({ price: value === 'all' ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tüm fiyatlar" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm fiyatlar</SelectItem>
              <SelectItem value="free">Ücretsiz</SelectItem>
              <SelectItem value="paid">Ücretli</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Language Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Dil</label>
          <Select
            value={initialFilters.language || 'all'}
            onValueChange={(value) => updateFilters({ language: value === 'all' ? undefined : value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Tüm diller" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tüm diller</SelectItem>
              <SelectItem value="Türkçe">Türkçe</SelectItem>
              <SelectItem value="English">English</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Sort Filter */}
        <div>
          <label className="block text-sm font-medium mb-2">Sıralama</label>
          <Select
            value={initialFilters.sort || 'default'}
            onValueChange={(value) => updateFilters({ sort: value === 'default' ? undefined : value as 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'rating' })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Varsayılan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Varsayılan</SelectItem>
              <SelectItem value="newest">En yeni</SelectItem>
              <SelectItem value="oldest">En eski</SelectItem>
              <SelectItem value="price_asc">Fiyat (Düşük → Yüksek)</SelectItem>
              <SelectItem value="price_desc">Fiyat (Yüksek → Düşük)</SelectItem>
              <SelectItem value="rating">En yüksek puan</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">Aktif filtreler:</span>
          
          {initialFilters.q && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Arama: &quot;{initialFilters.q}&quot;
              <button
                onClick={() => {
                  setSearchQuery('');
                  updateFilters({ q: undefined });
                }}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {initialFilters.level && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Seviye: {initialFilters.level}
              <button
                onClick={() => updateFilters({ level: undefined })}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {initialFilters.price && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Fiyat: {initialFilters.price === 'free' ? 'Ücretsiz' : 'Ücretli'}
              <button
                onClick={() => updateFilters({ price: undefined })}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {initialFilters.language && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Dil: {initialFilters.language}
              <button
                onClick={() => updateFilters({ language: undefined })}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          {initialFilters.sort && (
            <Badge variant="secondary" className="flex items-center gap-1">
              Sıralama: {initialFilters.sort}
              <button
                onClick={() => updateFilters({ sort: undefined })}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-red-500 hover:text-red-700"
          >
            Tümünü Temizle
          </Button>
        </div>
      )}
    </div>
  );
}
