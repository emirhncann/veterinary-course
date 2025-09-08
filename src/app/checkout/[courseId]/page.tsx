'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CheckCircle, CreditCard, Lock, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AuthGuard } from '@/components/AuthGuard';
import { apiFetch, createMockResponse, isDevelopment } from '@/lib/fetcher';
import type { Course, OrderRequest, OrderResponse } from '@/types/api';

// Mock data for development
const mockCourse: Course = {
  id: '1',
  slug: 'react-js-temelleri',
  title: 'React.js Temelleri - Sıfırdan İleri Seviyeye',
  summary: 'Modern web uygulamaları geliştirmek için React.js öğrenin. Hooks, Context API ve daha fazlası.',
  description: 'Bu kapsamlı React.js kursunda, modern web uygulamaları geliştirmek için ihtiyacınız olan tüm temel ve ileri seviye konuları öğreneceksiniz.',
  price: 299,
  thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=225&fit=crop',
  level: 'beginner',
  language: 'Türkçe',
  rating: 4.8,
  totalLessons: 45,
  duration: 1200,
  instructor: {
    name: 'Ahmet Yılmaz',
    bio: '10+ yıllık deneyime sahip full-stack developer. React, Node.js ve modern web teknolojileri konularında uzman.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  },
  sections: [],
  createdAt: '2024-01-15T10:00:00Z',
  updatedAt: '2024-01-20T15:30:00Z',
};

async function getCourse(courseId: string): Promise<Course | null> {
  if (isDevelopment) {
    if (courseId === '1') {
      return createMockResponse(mockCourse, 500);
    }
    return null;
  }

  try {
    const response = await apiFetch<Course>(`/courses/${courseId}`);
    return response;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

async function createOrder(orderData: OrderRequest): Promise<OrderResponse> {
  if (isDevelopment) {
    // Mock successful order
    return createMockResponse({
      orderId: 'order_' + Date.now(),
      status: 'paid',
    }, 2000);
  }

  try {
    const response = await apiFetch<OrderResponse>('/orders', {
      method: 'POST',
      body: orderData,
    });
    return response;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
}

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [course, setCourse] = React.useState<Course | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [processing, setProcessing] = React.useState(false);
  const [coupon, setCoupon] = React.useState('');
  const [appliedCoupon, setAppliedCoupon] = React.useState<string | null>(null);
  const [discount, setDiscount] = React.useState(0);

  React.useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const courseData = await getCourse(courseId);
        setCourse(courseData);
      } catch (error) {
        console.error('Error loading course:', error);
        toast.error('Kurs yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  const applyCoupon = () => {
    // Mock coupon logic
    if (coupon.toLowerCase() === 'welcome10') {
      setAppliedCoupon(coupon);
      setDiscount(course ? course.price * 0.1 : 0);
      toast.success('Kupon kodu uygulandı! %10 indirim kazandınız.');
    } else if (coupon.toLowerCase() === 'student20') {
      setAppliedCoupon(coupon);
      setDiscount(course ? course.price * 0.2 : 0);
      toast.success('Kupon kodu uygulandı! %20 indirim kazandınız.');
    } else {
      toast.error('Geçersiz kupon kodu');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCoupon('');
    toast.info('Kupon kodu kaldırıldı');
  };

  const handlePayment = async () => {
    if (!course) return;

    setProcessing(true);
    try {
      const orderData: OrderRequest = {
        courseId: course.id,
        coupon: appliedCoupon || undefined,
      };

      const order = await createOrder(orderData);
      
      if (order.status === 'paid') {
        toast.success('Ödeme başarılı! Kursunuz kitaplığınıza eklendi.');
        router.push('/library');
      } else if (order.paymentUrl) {
        // Redirect to payment gateway
        window.location.href = order.paymentUrl;
      } else {
        toast.error('Ödeme işlemi başarısız');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Ödeme işlemi sırasında bir hata oluştu');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthGuard>
    );
  }

  if (!course) {
    return (
      <AuthGuard>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Kurs bulunamadı</h2>
            <Button onClick={() => router.push('/courses')}>
              Kurslara Dön
            </Button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const finalPrice = course.price - discount;
  const isFree = finalPrice <= 0;

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              onClick={() => router.push(`/courses/${course.slug}`)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kursa Dön
            </Button>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Ödeme
            </h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Course Summary */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Kurs Özeti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="relative w-24 h-16 rounded-lg overflow-hidden">
                      <Image
                        src={course.thumbnail}
                        alt={course.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{course.title}</h3>
                      <p className="text-xs text-muted-foreground mb-2">
                        {course.instructor.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{course.totalLessons} ders</span>
                        <span>•</span>
                        <span>{Math.floor(course.duration / 60)} saat</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Coupon Code */}
              <Card>
                <CardHeader>
                  <CardTitle>Kupon Kodu</CardTitle>
                </CardHeader>
                <CardContent>
                  {appliedCoupon ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <div>
                          <p className="text-sm font-medium text-green-800 dark:text-green-200">
                            Kupon uygulandı: {appliedCoupon}
                          </p>
                          <p className="text-xs text-green-600 dark:text-green-300">
                            {formatPrice(discount)} indirim
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={removeCoupon}
                          className="text-green-600 hover:text-green-700"
                        >
                          Kaldır
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Label htmlFor="coupon">Kupon kodu</Label>
                      <div className="flex gap-2">
                        <Input
                          id="coupon"
                          placeholder="Kupon kodunuzu girin"
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value)}
                        />
                        <Button onClick={applyCoupon} disabled={!coupon.trim()}>
                          Uygula
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Örnek: welcome10 (%10 indirim), student20 (%20 indirim)
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Payment */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ödeme Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                  {isFree ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Ücretsiz Kurs</h3>
                      <p className="text-muted-foreground mb-4">
                        Bu kurs ücretsizdir. Hemen başlayabilirsiniz.
                      </p>
                      <Button
                        onClick={handlePayment}
                        disabled={processing}
                        className="w-full"
                        size="lg"
                      >
                        {processing ? 'İşleniyor...' : 'Ücretsiz Başla'}
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Mock Payment Form */}
                      <div className="space-y-2">
                        <Label htmlFor="cardNumber">Kart Numarası</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Son Kullanma</Label>
                          <Input
                            id="expiry"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input
                            id="cvv"
                            placeholder="123"
                            maxLength={3}
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="cardName">Kart Üzerindeki İsim</Label>
                        <Input
                          id="cardName"
                          placeholder="Ad Soyad"
                        />
                      </div>

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Lock className="h-4 w-4" />
                        <span>Ödeme bilgileriniz güvenli şekilde işlenir</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Order Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>Sipariş Özeti</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Kurs Fiyatı</span>
                      <span>{formatPrice(course.price)}</span>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>İndirim</span>
                        <span>-{formatPrice(discount)}</span>
                      </div>
                    )}
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Toplam</span>
                        <span>{formatPrice(finalPrice)}</span>
                      </div>
                    </div>
                  </div>

                  {!isFree && (
                    <Button
                      onClick={handlePayment}
                      disabled={processing}
                      className="w-full mt-4"
                      size="lg"
                    >
                      {processing ? (
                        'İşleniyor...'
                      ) : (
                        <>
                          <CreditCard className="h-4 w-4 mr-2" />
                          {formatPrice(finalPrice)} Öde
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Security Badges */}
              <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  <span>SSL Güvenli</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  <span>30 Gün Garanti</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
