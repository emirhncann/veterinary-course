'use client';

import * as React from 'react';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Course } from '@/types/api';

interface StickyBuyBoxProps {
  course: Course;
}

export function StickyBuyBox({ course }: StickyBuyBoxProps) {
  const formatPrice = (price: number) => {
    if (price === 0) return 'Ücretsiz';
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
    }).format(price);
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-lg font-bold text-primary">
                {formatPrice(course.price)}
              </div>
              <div className="text-sm text-muted-foreground">
                {course.price === 0 ? 'Ücretsiz başla' : 'Tek seferlik ödeme'}
              </div>
            </div>
            <Button className="flex-1 ml-4" size="lg" asChild>
              <Link href={`/checkout/${course.id}`}>
                {course.price === 0 ? 'Ücretsiz Başla' : 'Satın Al'}
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
