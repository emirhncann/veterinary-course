/**
 * API Response Types - Backend sözleşmesine göre tanımlanmış
 */

// Auth Types
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  national_id: string;
  phone: string;
  address?: string;
  role?: 'student' | 'instructor' | 'admin';
  avatar?: string;
  created_at: string;
}

export interface AuthResponse {
  user: User;
}

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  national_id: string;
  phone: string;
  address?: string;
}

// Course Types
export interface Course {
  id: string;
  slug: string;
  title: string;
  summary: string;
  description?: string;
  price: number;
  thumbnail: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  rating: number;
  totalLessons: number;
  duration: number; // dakika
  instructor: {
    name: string;
    bio: string;
    avatar: string;
  };
  sections: CourseSection[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: number; // dakika
  preview: boolean;
  videoUrl?: string;
  description?: string;
}

export interface CourseListItem {
  id: string;
  slug: string;
  title: string;
  summary: string;
  price: number;
  thumbnail: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  rating: number;
  totalLessons: number;
  duration: number;
  instructor: {
    name: string;
    avatar: string;
  };
}

export interface CoursesResponse {
  items: CourseListItem[];
  total: number;
  page: number;
  limit: number;
}

export interface CourseFilters {
  q?: string;
  level?: string;
  price?: string;
  language?: string;
  sort?: 'newest' | 'oldest' | 'price_asc' | 'price_desc' | 'rating';
  page?: number;
  limit?: number;
}

// Order Types
export interface OrderRequest {
  courseId: string;
  coupon?: string;
}

export interface OrderResponse {
  orderId: string;
  paymentUrl?: string;
  status: 'pending' | 'paid' | 'failed';
}

// Enrollment Types
export interface Enrollment {
  id: string;
  courseId: string;
  course: CourseListItem;
  enrolledAt: string;
  progress: number; // 0-100
  lastLessonId?: string;
}

export interface EnrollmentsResponse {
  items: Enrollment[];
  total: number;
}

// Player Types
export interface PlayerProgress {
  positionSec: number;
  completed: boolean;
}

export interface PlayerProgressRequest {
  courseId: string;
  lessonId: string;
  positionSec: number;
  completed: boolean;
}

// Review Types
export interface Review {
  id: string;
  courseId: string;
  userId: string;
  user: {
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
}

export interface ReviewRequest {
  courseId: string;
  rating: number;
  comment: string;
}

export interface ReviewsResponse {
  items: Review[];
  total: number;
  average: number;
}

// Common Types
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}
