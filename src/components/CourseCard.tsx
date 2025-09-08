'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Star, Clock, Users, Play } from 'lucide-react';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CourseListItem } from '@/types/api';

interface CourseCardProps {
  course: CourseListItem;
  showPreview?: boolean;
}

export function CourseCard({ course, showPreview = true }: CourseCardProps) {
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
      return `${hours}s ${mins}dk`;
    }
    return `${mins}dk`;
  };

  const formatRating = (rating: number) => {
    return rating.toFixed(1);
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

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={course.thumbnail}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        
        {/* Level Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={getLevelColor(course.level)}>
            {getLevelText(course.level)}
          </Badge>
        </div>

        {/* Preview Badge */}
        {showPreview && (
          <div className="absolute top-3 right-3">
            <Badge variant="secondary" className="bg-black/70 text-white">
              <Play className="h-3 w-3 mr-1" />
              Önizle
            </Badge>
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {course.title}
          </h3>

          {/* Summary */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {course.summary}
          </p>

          {/* Instructor */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              {course.instructor.avatar ? (
                <Image
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                  <Users className="h-3 w-3" />
                </div>
              )}
              <span className="text-sm text-muted-foreground">
                {course.instructor.name}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span>{formatRating(course.rating)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatDuration(course.duration)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{course.totalLessons} ders</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex items-center justify-between w-full">
          <div className="text-lg font-bold text-primary">
            {formatPrice(course.price)}
          </div>
          <Button asChild size="sm">
            <Link href={`/courses/${course.slug}`}>
              Detayları Gör
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
