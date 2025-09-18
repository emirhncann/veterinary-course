'use client';

import * as React from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiFetch } from '@/lib/fetcher';
import type { Review, ReviewsResponse } from '@/types/api';

interface ReviewListProps {
  courseId: string;
}

// Mock data for development
const mockReviews: Review[] = [
  {
    id: '1',
    courseId: '1',
    userId: '1',
    user: {
      name: 'Mehmet Kaya',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    },
    rating: 5,
    comment: 'Harika bir kurs! React.js öğrenmek isteyen herkese tavsiye ederim. Eğitmen çok açıklayıcı ve örnekler çok güzel.',
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: '2',
    courseId: '1',
    userId: '2',
    user: {
      name: 'Ayşe Demir',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face',
    },
    rating: 4,
    comment: 'Çok faydalı bir kurs. Başlangıç seviyesinde olanlar için ideal. Biraz daha ileri konular da eklenebilir.',
    createdAt: '2024-01-18T15:30:00Z',
  },
  {
    id: '3',
    courseId: '1',
    userId: '3',
    user: {
      name: 'Can Yılmaz',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    },
    rating: 5,
    comment: 'Mükemmel! Projeler çok güzel, eğitmen çok deneyimli. React.js öğrenmek isteyen herkese öneririm.',
    createdAt: '2024-01-15T09:15:00Z',
  },
];

const mockReviewsResponse: ReviewsResponse = {
  items: mockReviews,
  total: 3,
  average: 4.7,
};

async function getReviews(courseId: string): Promise<ReviewsResponse> {
  try {
    const response = await apiFetch<ReviewsResponse>(`/reviews?courseId=${courseId}`);
    return response;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return { items: [], total: 0, average: 0 };
  }
}

export function ReviewList({ courseId }: ReviewListProps) {
  const [reviews, setReviews] = React.useState<ReviewsResponse | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await getReviews(courseId);
        setReviews(data);
      } catch (error) {
        console.error('Error loading reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [courseId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating
            ? 'fill-yellow-400 text-yellow-400'
            : 'text-gray-300 dark:text-gray-600'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-4 bg-muted rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-muted rounded-full"></div>
                  <div className="space-y-1">
                    <div className="h-4 bg-muted rounded w-24"></div>
                    <div className="h-3 bg-muted rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-full"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!reviews || reviews.items.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-muted-foreground">
          <Star className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">Henüz yorum yok</h3>
          <p>Bu kurs için henüz yorum yapılmamış. İlk yorumu siz yapın!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Reviews Summary */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Yorumlar ({reviews.total})</h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex items-center gap-1">
              {renderStars(Math.round(reviews.average))}
            </div>
            <span className="text-sm text-muted-foreground">
              {reviews.average.toFixed(1)} ortalama puan
            </span>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.items.map((review) => (
          <Card key={review.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Image
                  src={review.user.avatar || '/default-avatar.png'}
                  alt={review.user.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{review.user.name}</h4>
                      <div className="flex items-center gap-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {review.comment}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-8">
                      <ThumbsUp className="h-3 w-3 mr-1" />
                      Faydalı
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8">
                      <ThumbsDown className="h-3 w-3 mr-1" />
                      Faydasız
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {reviews.total > reviews.items.length && (
        <div className="text-center">
          <Button variant="outline">
            Daha Fazla Yorum Yükle
          </Button>
        </div>
      )}
    </div>
  );
}
