/**
 * Zod Validators - Form validasyonu için şemalar
 */

import { z } from 'zod';

// Auth Validators
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'E-posta adresi gerekli')
    .email('Geçerli bir e-posta adresi girin'),
  password: z
    .string()
    .min(1, 'Şifre gerekli')
    .min(6, 'Şifre en az 6 karakter olmalı'),
});

export const registerSchema = z.object({
  name: z
    .string()
    .min(1, 'Ad gerekli')
    .min(2, 'Ad en az 2 karakter olmalı')
    .max(50, 'Ad en fazla 50 karakter olabilir'),
  email: z
    .string()
    .min(1, 'E-posta adresi gerekli')
    .email('Geçerli bir e-posta adresi girin'),
  password: z
    .string()
    .min(1, 'Şifre gerekli')
    .min(6, 'Şifre en az 6 karakter olmalı')
    .max(100, 'Şifre en fazla 100 karakter olabilir'),
  confirmPassword: z.string().min(1, 'Şifre tekrarı gerekli'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Şifreler eşleşmiyor',
  path: ['confirmPassword'],
});

// Course Filters Validator
export const courseFiltersSchema = z.object({
  q: z.string().optional(),
  level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  price: z.enum(['free', 'paid', 'all']).optional(),
  language: z.string().optional(),
  sort: z.enum(['newest', 'oldest', 'price_asc', 'price_desc', 'rating']).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(50).optional(),
});

// Review Validator
export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Puan gerekli')
    .max(5, 'Puan 1-5 arasında olmalı'),
  comment: z
    .string()
    .min(1, 'Yorum gerekli')
    .min(10, 'Yorum en az 10 karakter olmalı')
    .max(1000, 'Yorum en fazla 1000 karakter olabilir'),
});

// Order Validator
export const orderSchema = z.object({
  courseId: z.string().min(1, 'Kurs seçimi gerekli'),
  coupon: z.string().optional(),
});

// Player Progress Validator
export const playerProgressSchema = z.object({
  courseId: z.string().min(1, 'Kurs ID gerekli'),
  lessonId: z.string().min(1, 'Ders ID gerekli'),
  positionSec: z.number().min(0, 'Pozisyon negatif olamaz'),
  completed: z.boolean(),
});

// Profile Update Validator
export const profileUpdateSchema = z.object({
  name: z
    .string()
    .min(1, 'Ad gerekli')
    .min(2, 'Ad en az 2 karakter olmalı')
    .max(50, 'Ad en fazla 50 karakter olabilir'),
  email: z
    .string()
    .min(1, 'E-posta adresi gerekli')
    .email('Geçerli bir e-posta adresi girin'),
});

// Password Change Validator
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Mevcut şifre gerekli'),
  newPassword: z
    .string()
    .min(1, 'Yeni şifre gerekli')
    .min(6, 'Yeni şifre en az 6 karakter olmalı')
    .max(100, 'Yeni şifre en fazla 100 karakter olabilir'),
  confirmNewPassword: z.string().min(1, 'Yeni şifre tekrarı gerekli'),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Yeni şifreler eşleşmiyor',
  path: ['confirmNewPassword'],
});

// Type exports
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type CourseFiltersData = z.infer<typeof courseFiltersSchema>;
export type ReviewFormData = z.infer<typeof reviewSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type PlayerProgressData = z.infer<typeof playerProgressSchema>;
export type ProfileUpdateData = z.infer<typeof profileUpdateSchema>;
export type PasswordChangeData = z.infer<typeof passwordChangeSchema>;
