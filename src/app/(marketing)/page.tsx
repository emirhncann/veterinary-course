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

// Client-side data fetching hook
function useFeaturedCourses() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await apiFetch<{ items: CourseListItem[] }>('/courses?featured=true&limit=6');
        setCourses(response.items);
      } catch (error) {
        console.error('Error fetching featured courses:', error);
        setCourses([]);
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">50+</div>
              <div className="text-gray-600 dark:text-gray-300">Uzman Eğitmen</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">200+</div>
              <div className="text-gray-600 dark:text-gray-300">Kaliteli Kurs</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600 dark:text-gray-300">Aktif Öğrenci</div>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">95%</div>
              <div className="text-gray-600 dark:text-gray-300">Memnuniyet</div>
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
                <h3 className="text-xl font-semibold mb-2">Sertifikalı Eğitim</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Tamamladığınız kurslar için geçerli sertifikalar kazanın
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Courses Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Öne Çıkan Kurslar
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              En popüler ve kaliteli kurslarımızla veteriner hekimlik kariyerinizi geliştirin
            </p>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-300">Kurslar yükleniyor...</p>
            </div>
          ) : featuredCourses.length > 0 ? (
            <CourseGrid courses={featuredCourses} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-300">
                Öne çıkan kurslar yüklenirken bir sorun oluştu.
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/courses">
                Tüm Kursları Görüntüle
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
            Veteriner Kariyerinizi Geliştirmeye Hazır mısınız?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Uzman eğitmenlerimizle birlikte veteriner hekimlik alanında uzmanlaşın ve kariyerinizi bir üst seviyeye taşıyın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">
                Ücretsiz Hesap Oluştur
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600" asChild>
              <Link href="/courses">
                Kursları İncele
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}