'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Clock, Users, Play, CheckCircle, BookOpen, Award } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StickyBuyBox } from '@/components/StickyBuyBox';
import { Curriculum } from '@/components/Curriculum';
import { ReviewList } from '@/components/ReviewList';
import { apiFetch } from '@/lib/fetcher';
import type { Course } from '@/types/api';

// Static params for export
export async function generateStaticParams() {
  return [
    { slug: 'kucuk-hayvan-cerrahisi' },
    { slug: 'buyuk-hayvan-hastaliklari' },
    { slug: 'veteriner-radyoloji' },
    { slug: 'veteriner-anestezi' },
    { slug: 'veteriner-patoloji' },
    { slug: 'veteriner-farmakoloji' },
  ];
}

// Client-side course data fetching hook
function useCourse() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const response = await apiFetch<Course>(`/courses/${slug}`);
        setCourse(response);
      } catch (error) {
        console.error('Error fetching course:', error);
        // API başarısız olursa mock data kullan
        const mockCourse = mockCourses[slug];
        if (mockCourse) {
          setCourse(mockCourse);
        } else {
          setNotFound(true);
        }
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  return { course, loading, notFound };
}

// Mock courses data for static export
const mockCourses: { [key: string]: Course } = {
  'kucuk-hayvan-cerrahisi': {
    id: '1',
    slug: 'kucuk-hayvan-cerrahisi',
    title: 'Küçük Hayvan Cerrahisi - Temel İlkeler',
    summary: 'Küçük hayvan cerrahisinin temel prensipleri ve pratik uygulamaları. Sterilizasyon, anestezi ve cerrahi teknikler.',
    description: `
      Bu kapsamlı küçük hayvan cerrahisi kursunda, veteriner hekimlik pratiğinde sıkça karşılaştığınız cerrahi vakaları öğreneceksiniz.

      **Kurs İçeriği:**
      - Cerrahi ekipman ve aletler
      - Sterilizasyon teknikleri
      - Anestezi protokolleri
      - Yumuşak doku cerrahisi
      - Ortopedik cerrahi temelleri
      - Post-operatif bakım
      - Komplikasyon yönetimi
      - Cerrahi teknikler ve dikişler

      **Bu kursu tamamladığınızda:**
      - Temel cerrahi prosedürleri uygulayabileceksiniz
      - Anestezi protokollerini güvenle kullanabileceksiniz
      - Cerrahi komplikasyonları yönetebileceksiniz
      - Modern cerrahi teknikleri uygulayabileceksiniz
    `,
    price: 299,
    thumbnail: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800&h=450&fit=crop',
    level: 'intermediate',
    language: 'Türkçe',
    rating: 4.8,
    totalLessons: 45,
    duration: 1200,
    instructor: {
      name: 'Prof. Dr. Mehmet Yılmaz',
      bio: '20+ yıllık deneyime sahip veteriner cerrah. Küçük hayvan cerrahisi alanında uzman.',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    },
    sections: [
      {
        id: '1',
        title: 'Cerrahi Temelleri',
        lessons: [
          {
            id: '1',
            title: 'Cerrahi Ekipman ve Aletler',
            duration: 25,
            preview: true,
            description: 'Cerrahi aletlerin tanıtımı ve kullanımı',
          },
          {
            id: '2',
            title: 'Sterilizasyon Teknikleri',
            duration: 30,
            preview: true,
            description: 'Otoklavlama ve kimyasal sterilizasyon',
          },
          {
            id: '3',
            title: 'Cerrahi Alan Hazırlığı',
            duration: 20,
            preview: false,
            description: 'Hasta hazırlığı ve cerrahi alan sterilizasyonu',
          },
        ],
      },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  'buyuk-hayvan-hastaliklari': {
    id: '2',
    slug: 'buyuk-hayvan-hastaliklari',
    title: 'Büyük Hayvan Hastalıkları ve Tedavisi',
    summary: 'Sığır, at ve koyun hastalıklarının tanı ve tedavi yöntemleri. Klinik muayene teknikleri.',
    description: `
      Büyük hayvan hastalıkları alanında uzmanlaşmak için kapsamlı eğitim programı.

      **Kurs İçeriği:**
      - Büyük hayvan anatomisi
      - Klinik muayene teknikleri
      - Sığır hastalıkları
      - At hastalıkları
      - Koyun-keçi hastalıkları
      - Üreme hastalıkları
      - Beslenme bozuklukları
      - Zoonoz hastalıklar

      **Bu kursu tamamladığınızda:**
      - Büyük hayvan muayenesi yapabileceksiniz
      - Hastalık tanısı koyabileceksiniz
      - Tedavi protokollerini uygulayabileceksiniz
      - Halk sağlığı risklerini değerlendirebileceksiniz
    `,
    price: 399,
    thumbnail: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=800&h=450&fit=crop',
    level: 'advanced',
    language: 'Türkçe',
    rating: 4.9,
    totalLessons: 60,
    duration: 1800,
    instructor: {
      name: 'Prof. Dr. Ayşe Demir',
      bio: '25+ yıllık büyük hayvan hastalıkları uzmanı. Saha deneyimi ve akademik kariyeri bulunan uzman veteriner.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    },
    sections: [
      {
        id: '1',
        title: 'Büyük Hayvan Muayenesi',
        lessons: [
          {
            id: '1',
            title: 'Klinik Muayene Teknikleri',
            duration: 40,
            preview: true,
            description: 'Büyük hayvan muayene protokolleri',
          },
        ],
      },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  'veteriner-radyoloji': {
    id: '3',
    slug: 'veteriner-radyoloji',
    title: 'Veteriner Radyoloji - Görüntüleme Teknikleri',
    summary: 'X-ray, ultrasonografi ve ileri görüntüleme yöntemleri. Radyolojik bulgular ve yorumlama.',
    description: `
      Veteriner radyoloji alanında uzmanlaşmak için kapsamlı görüntüleme eğitimi.

      **Kurs İçeriği:**
      - X-ray teknikleri
      - Ultrasonografi
      - CT ve MRI temelleri
      - Radyolojik bulgular
      - Görüntü yorumlama
      - Radyasyon güvenliği
      - Kontrast madde kullanımı
      - Dijital görüntüleme

      **Bu kursu tamamladığınızda:**
      - X-ray çekimi yapabileceksiniz
      - Ultrason muayenesi gerçekleştirebileceksiniz
      - Radyolojik bulguları yorumlayabileceksiniz
      - İleri görüntüleme yöntemlerini kullanabileceksiniz
    `,
    price: 449,
    thumbnail: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=450&fit=crop',
    level: 'intermediate',
    language: 'Türkçe',
    rating: 4.7,
    totalLessons: 35,
    duration: 900,
    instructor: {
      name: 'Doç. Dr. Can Özkan',
      bio: 'Veteriner radyoloji uzmanı. 15+ yıllık deneyim ve ileri görüntüleme teknikleri konusunda uzman.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    },
    sections: [
      {
        id: '1',
        title: 'Görüntüleme Temelleri',
        lessons: [
          {
            id: '1',
            title: 'X-ray Teknikleri',
            duration: 35,
            preview: true,
            description: 'X-ray çekimi ve pozisyonlama',
          },
        ],
      },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  'veteriner-anestezi': {
    id: '4',
    slug: 'veteriner-anestezi',
    title: 'Veteriner Anestezi ve Yoğun Bakım',
    summary: 'Anestezi protokolleri, monitörizasyon ve yoğun bakım prensipleri. Güvenli anestezi uygulamaları.',
    description: `
      Veteriner anestezi ve yoğun bakım alanında uzmanlaşmak için kapsamlı eğitim.

      **Kurs İçeriği:**
      - Anestezi protokolleri
      - Premedikasyon
      - İndüksiyon teknikleri
      - Anestezi monitörizasyonu
      - Yoğun bakım prensipleri
      - Anestezi komplikasyonları
      - Ağrı yönetimi
      - Kardiyopulmoner resüsitasyon

      **Bu kursu tamamladığınızda:**
      - Güvenli anestezi uygulayabileceksiniz
      - Anestezi monitörizasyonu yapabileceksiniz
      - Komplikasyonları yönetebileceksiniz
      - Yoğun bakım hastalarını takip edebileceksiniz
    `,
    price: 349,
    thumbnail: 'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=800&h=450&fit=crop',
    level: 'advanced',
    language: 'Türkçe',
    rating: 4.8,
    totalLessons: 50,
    duration: 1500,
    instructor: {
      name: 'Dr. Elif Kaya',
      bio: 'Veteriner anestezi uzmanı. 12+ yıllık anestezi ve yoğun bakım deneyimi.',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    },
    sections: [
      {
        id: '1',
        title: 'Anestezi Temelleri',
        lessons: [
          {
            id: '1',
            title: 'Anestezi Protokolleri',
            duration: 45,
            preview: true,
            description: 'Anestezi planlaması ve protokol seçimi',
          },
        ],
      },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  'veteriner-patoloji': {
    id: '5',
    slug: 'veteriner-patoloji',
    title: 'Veteriner Patoloji - Hastalık Mekanizmaları',
    summary: 'Patolojik değişiklikler ve hastalık süreçleri. Histopatoloji ve nekropsi teknikleri.',
    description: `
      Veteriner patoloji alanında uzmanlaşmak için kapsamlı hastalık mekanizmaları eğitimi.

      **Kurs İçeriği:**
      - Genel patoloji
      - Hücresel değişiklikler
      - İnflamasyon
      - Nekropsi teknikleri
      - Histopatoloji
      - Özel patoloji
      - Tümör patolojisi
      - Mikroskopi teknikleri

      **Bu kursu tamamladığınızda:**
      - Nekropsi yapabileceksiniz
      - Histopatolojik değerlendirme yapabileceksiniz
      - Hastalık mekanizmalarını anlayabileceksiniz
      - Patolojik tanı koyabileceksiniz
    `,
    price: 0,
    thumbnail: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=450&fit=crop',
    level: 'intermediate',
    language: 'Türkçe',
    rating: 4.9,
    totalLessons: 40,
    duration: 1200,
    instructor: {
      name: 'Prof. Dr. Zeynep Arslan',
      bio: 'Veteriner patoloji uzmanı. 18+ yıllık patoloji ve histopatoloji deneyimi.',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    },
    sections: [
      {
        id: '1',
        title: 'Genel Patoloji',
        lessons: [
          {
            id: '1',
            title: 'Hücresel Değişiklikler',
            duration: 40,
            preview: true,
            description: 'Hücresel adaptasyon ve hasar mekanizmaları',
          },
        ],
      },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
  'veteriner-farmakoloji': {
    id: '6',
    slug: 'veteriner-farmakoloji',
    title: 'Veteriner Farmakoloji - İlaç Tedavisi',
    summary: 'Veteriner ilaçları, dozaj hesaplamaları ve tedavi protokolleri. Klinik farmakoloji uygulamaları.',
    description: `
      Veteriner farmakoloji alanında uzmanlaşmak için kapsamlı ilaç tedavisi eğitimi.

      **Kurs İçeriği:**
      - Farmakokinetik
      - Farmakodinamik
      - İlaç dozaj hesaplamaları
      - Antibiyotik kullanımı
      - Analjezik ve antiinflamatuar ilaçlar
      - Kardiyak ilaçlar
      - İlaç etkileşimleri
      - Toksikoloji

      **Bu kursu tamamladığınızda:**
      - Doğru ilaç seçimi yapabileceksiniz
      - Dozaj hesaplamaları yapabileceksiniz
      - İlaç etkileşimlerini değerlendirebileceksiniz
      - Toksik vakaları yönetebileceksiniz
    `,
    price: 299,
    thumbnail: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=450&fit=crop',
    level: 'beginner',
    language: 'Türkçe',
    rating: 4.6,
    totalLessons: 30,
    duration: 800,
    instructor: {
      name: 'Doç. Dr. Oğuzhan Yıldız',
      bio: 'Veteriner farmakoloji uzmanı. 14+ yıllık ilaç tedavisi ve toksikoloji deneyimi.',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    },
    sections: [
      {
        id: '1',
        title: 'Farmakoloji Temelleri',
        lessons: [
          {
            id: '1',
            title: 'Farmakokinetik Prensipleri',
            duration: 35,
            preview: true,
            description: 'İlaçların vücuttaki yolculuğu',
          },
        ],
      },
    ],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T15:30:00Z',
  },
};

export default function CourseDetailPage() {
  const { course, loading, notFound: courseNotFound } = useCourse();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Kurs yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (courseNotFound || !course) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Kurs Bulunamadı
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Aradığınız kurs mevcut değil veya kaldırılmış olabilir.
          </p>
          <Button asChild>
            <Link href="/courses">
              Tüm Kursları Görüntüle
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    if (price === 0) return 'Ücretsiz';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours} saat ${mins} dakika`;
    }
    return `${mins} dakika`;
  };

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'Başlangıç';
      case 'intermediate':
        return 'Orta';
      case 'advanced':
        return 'İleri';
      default:
        return level;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Course Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={getLevelColor(course.level)}>
                {getLevelText(course.level)}
              </Badge>
              <Badge variant="outline">{course.language}</Badge>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              {course.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {course.summary}
            </p>

            {/* Course Stats */}
            <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{Number(course.rating || 0).toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatDuration(course.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                <span>{course.totalLessons} ders</span>
              </div>
            </div>
          </div>

          {/* Course Thumbnail */}
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={course.thumbnail}
              alt={course.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Button size="lg" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                <Play className="h-5 w-5 mr-2" />
                Önizle
              </Button>
            </div>
          </div>

          {/* Course Tabs */}
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Açıklama</TabsTrigger>
              <TabsTrigger value="curriculum">Müfredat</TabsTrigger>
              <TabsTrigger value="reviews">Yorumlar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="space-y-4">
              <div className="prose dark:prose-invert max-w-none">
                {course.description?.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="curriculum">
              <Curriculum sections={course.sections} />
            </TabsContent>
            
            <TabsContent value="reviews">
              <ReviewList courseId={course.id} />
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            {/* Price Card */}
            <Card>
              <CardHeader>
                <div className="text-3xl font-bold text-primary">
                  {formatPrice(course.price)}
                </div>
                {course.price > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Tek seferlik ödeme
                  </div>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" size="lg" asChild>
                  <Link href={`/checkout/${course.id}`}>
                    {course.price === 0 ? 'Ücretsiz Başla' : 'Satın Al'}
                  </Link>
                </Button>
                
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Ömür boyu erişim</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Mobil ve masaüstü erişim</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Sertifika</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>30 gün para iade garantisi</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructor Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Eğitmen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={course.instructor.avatar}
                    alt={course.instructor.name}
                    width={60}
                    height={60}
                    className="rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold">{course.instructor.name}</h3>
                    <p className="text-sm text-muted-foreground">Uzman Eğitmen</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {course.instructor.bio}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Sticky Buy Box for Mobile */}
      <StickyBuyBox course={course} />
    </div>
  );
}
