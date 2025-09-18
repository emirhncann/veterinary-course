'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Play, Heart, Stethoscope, Shield, GraduationCap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CourseGrid } from '@/components/CourseGrid';
import { Logo } from '@/components/Logo';
import { apiFetch } from '@/lib/fetcher';
import type { CourseListItem } from '@/types/api';

// Mock data removed - using API instead

// Mock featured courses as fallback
const mockFeaturedCourses: CourseListItem[] = [
  {
    id: '1',
    slug: 'kucuk-hayvan-cerrahisi',
    title: 'Küçük Hayvan Cerrahisi - Temel İlkeler',
    summary: 'Küçük hayvan cerrahisinin temel prensipleri ve pratik uygulamaları. Sterilizasyon, anestezi ve cerrahi teknikler.',
    price: 299,
    thumbnail: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=225&fit=crop',
    level: 'intermediate',
    language: 'Türkçe',
    rating: 4.8,
    totalLessons: 45,
    duration: 1200,
    instructor: {
      name: 'Prof. Dr. Mehmet Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
    },
  },
  {
    id: '2',
    slug: 'buyuk-hayvan-hastaliklari',
    title: 'Büyük Hayvan Hastalıkları ve Tedavisi',
    summary: 'Sığır, at ve koyun hastalıklarının tanı ve tedavi yöntemleri. Klinik muayene teknikleri.',
    price: 399,
    thumbnail: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400&h=225&fit=crop',
    level: 'advanced',
    language: 'Türkçe',
    rating: 4.9,
    totalLessons: 60,
    duration: 1800,
    instructor: {
      name: 'Prof. Dr. Ayşe Demir',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    },
  },
  {
    id: '3',
    slug: 'veteriner-radyoloji',
    title: 'Veteriner Radyoloji - Görüntüleme Teknikleri',
    summary: 'X-ray, ultrasonografi ve ileri görüntüleme yöntemleri. Radyolojik bulgular ve yorumlama.',
    price: 449,
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=225&fit=crop',
    level: 'intermediate',
    language: 'Türkçe',
    rating: 4.7,
    totalLessons: 35,
    duration: 900,
    instructor: {
      name: 'Doç. Dr. Can Özkan',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face',
    },
  },
  {
    id: '4',
    slug: 'veteriner-anestezi',
    title: 'Veteriner Anestezi ve Yoğun Bakım',
    summary: 'Anestezi protokolleri, monitörizasyon ve yoğun bakım prensipleri. Güvenli anestezi uygulamaları.',
    price: 349,
    thumbnail: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=400&h=225&fit=crop',
    level: 'advanced',
    language: 'Türkçe',
    rating: 4.8,
    totalLessons: 50,
    duration: 1500,
    instructor: {
      name: 'Dr. Elif Kaya',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face',
    },
  },
  {
    id: '5',
    slug: 'veteriner-patoloji',
    title: 'Veteriner Patoloji - Hastalık Mekanizmaları',
    summary: 'Patolojik değişiklikler ve hastalık süreçleri. Histopatoloji ve nekropsi teknikleri.',
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=225&fit=crop',
    level: 'intermediate',
    language: 'Türkçe',
    rating: 4.9,
    totalLessons: 40,
    duration: 1200,
    instructor: {
      name: 'Prof. Dr. Zeynep Arslan',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face',
    },
  },
  {
    id: '6',
    slug: 'veteriner-farmakoloji',
    title: 'Veteriner Farmakoloji - İlaç Tedavisi',
    summary: 'Veteriner ilaçları, dozaj hesaplamaları ve tedavi protokolleri. Klinik farmakoloji uygulamaları.',
    price: 299,
    thumbnail: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=400&h=225&fit=crop',
    level: 'beginner',
    language: 'Türkçe',
    rating: 4.6,
    totalLessons: 30,
    duration: 800,
    instructor: {
      name: 'Doç. Dr. Oğuzhan Yıldız',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=face',
    },
  },
];

// Client-side data fetching hook
function useFeaturedCourses() {
  const [courses, setCourses] = useState<CourseListItem[]>(mockFeaturedCourses);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiFetch<{ items: CourseListItem[] }>('/courses?featured=true&limit=6');
        setCourses(response.items);
      } catch (error) {
        console.error('Error fetching featured courses:', error);
        // API başarısız olursa mock data kullan
        setCourses(mockFeaturedCourses);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  return { courses, loading };
}

export default function HomePage() {
  const { courses: featuredCourses, loading } = useFeaturedCourses();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <Logo width={120} height={120} />
            </div>
            <Badge variant="secondary" className="mb-4">
              <Heart className="h-3 w-3 mr-1" />
              Türkiye&apos;nin En Kapsamlı Veteriner Eğitim Platformu
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Veteriner{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
                Eğitim
              </span>
              <br />
              Merkezi
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Uzman veteriner hekimlerden kaliteli eğitimler alın. Küçük hayvan cerrahisi, büyük hayvan hastalıkları, 
              radyoloji ve daha fazlası için kapsamlı kurslar.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/courses">
                  Kursları Keşfet
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/register">
                  Ücretsiz Başla
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">2,500+</div>
              <div className="text-gray-600 dark:text-gray-300">Veteriner Hekim</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">150+</div>
              <div className="text-gray-600 dark:text-gray-300">Uzmanlık Kursu</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">25+</div>
              <div className="text-gray-600 dark:text-gray-300">Profesör Doktor</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">4.9</div>
              <div className="text-gray-600 dark:text-gray-300">Ortalama Puan</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Neden VetMediPedia?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Veteriner hekimlik alanında uzmanlaşmak için ihtiyacınız olan her şey burada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Uzman Eğitim</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Profesör doktorlar ve uzman veteriner hekimler tarafından hazırlanan kurslar
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Güvenilir İçerik</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Bilimsel temelli, güncel ve pratik veteriner hekimlik bilgileri
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Mesleki Gelişim</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Sürekli mesleki gelişim için geçerli sertifikalar ve uzmanlık belgeleri
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Öne Çıkan Veteriner Kursları
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              En popüler ve yüksek puanlı veteriner hekimlik kurslarımızı keşfedin
            </p>
          </div>

          <CourseGrid courses={featuredCourses} />

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" asChild>
              <Link href="/courses">
                Tüm Kursları Gör
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Veteriner Hekimlik Kariyerinizi Geliştirin
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Uzman veteriner hekimlerden eğitim alın ve mesleki gelişiminizi sürdürün
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                Ücretsiz Hesap Oluştur
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-green-600" asChild>
              <Link href="/courses">
                <Play className="mr-2 h-4 w-4" />
                Veteriner Kurslarını İncele
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
