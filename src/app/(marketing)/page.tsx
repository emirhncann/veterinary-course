import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Users, Award, Star, Play } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CourseGrid } from '@/components/CourseGrid';
import { apiFetch, createMockResponse, isDevelopment } from '@/lib/fetcher';
import type { CourseListItem } from '@/types/api';

// Mock data for development
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
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face',
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
];

async function getFeaturedCourses(): Promise<CourseListItem[]> {
  if (isDevelopment) {
    return createMockResponse(mockCourses.slice(0, 6), 500);
  }

  try {
    const response = await apiFetch<{ items: CourseListItem[] }>('/courses?featured=true&limit=6');
    return response.items;
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    return [];
  }
}

export default async function HomePage() {
  const featuredCourses = await getFeaturedCourses();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Star className="h-3 w-3 mr-1" />
              Türkiye'nin En Popüler Eğitim Platformu
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Modern{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Online Eğitim
              </span>
              <br />
              Deneyimi
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Uzman eğitmenlerden kaliteli kurslar alın. Programlama, tasarım, iş dünyası ve 
              daha fazlası için binlerce kurs arasından seçim yapın.
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
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600 dark:text-gray-300">Aktif Öğrenci</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
              <div className="text-gray-600 dark:text-gray-300">Kurs</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Uzman Eğitmen</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">4.8</div>
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
              Neden KursPlatform?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Modern eğitim deneyimi için ihtiyacınız olan her şey burada
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Kaliteli İçerik</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Uzman eğitmenler tarafından hazırlanan, güncel ve pratik kurslar
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Topluluk</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Binlerce öğrenci ve eğitmenle etkileşim kurun, birlikte öğrenin
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Sertifika</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Kursları tamamladığınızda alacağınız geçerli sertifikalar
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
              Öne Çıkan Kurslar
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              En popüler ve yüksek puanlı kurslarımızı keşfedin
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
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hemen Başlayın
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Binlerce kurs arasından seçim yapın ve kariyerinizi bir üst seviyeye taşıyın
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                Ücretsiz Hesap Oluştur
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-blue-600" asChild>
              <Link href="/courses">
                <Play className="mr-2 h-4 w-4" />
                Kursları İncele
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
