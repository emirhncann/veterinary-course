'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { AuthGuard } from '@/components/AuthGuard';
import { apiFetch } from '@/lib/fetcher';
import type { Course } from '@/types/api';

interface CourseFormData {
  title: string;
  summary: string;
  description: string;
  price: number;
  level: 'beginner' | 'intermediate' | 'advanced';
  language: string;
  thumbnail: string;
  instructor: {
    name: string;
    bio: string;
    avatar: string;
  };
  sections: CourseSection[];
}

interface CourseSection {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  duration: number;
  preview: boolean;
  description: string;
  videoUrl: string;
}

export default function EditCoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [formData, setFormData] = React.useState<CourseFormData>({
    title: '',
    summary: '',
    description: '',
    price: 0,
    level: 'beginner',
    language: 'Türkçe',
    thumbnail: '',
    instructor: {
      name: '',
      bio: '',
      avatar: '',
    },
    sections: [],
  });

  // Load course data
  React.useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const course = await apiFetch<Course>(`/admin/courses/${courseId}`);
        
        // Convert course to form data format
        setFormData({
          title: course.title,
          summary: course.summary,
          description: course.description || '',
          price: course.price,
          level: course.level,
          language: course.language,
          thumbnail: course.thumbnail,
          instructor: {
            name: course.instructor.name,
            bio: course.instructor.bio,
            avatar: course.instructor.avatar,
          },
          sections: course.sections?.map(section => ({
            ...section,
            lessons: section.lessons.map(lesson => ({
              ...lesson,
              description: lesson.description || '',
              videoUrl: lesson.videoUrl || ''
            }))
          })) || [],
        });
      } catch (error) {
        console.error('Error fetching course:', error);
        toast.error('Kurs yüklenirken bir hata oluştu');
        router.push('/admin/courses');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, router]);

  const handleInputChange = (field: string, value: unknown) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof CourseFormData] as Record<string, unknown>),
          [child]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const addSection = () => {
    const newSectionId = (formData.sections.length + 1).toString();
    setFormData(prev => ({
      ...prev,
      sections: [
        ...prev.sections,
        {
          id: newSectionId,
          title: '',
          lessons: [
            {
              id: '1',
              title: '',
              duration: 0,
              preview: false,
              description: '',
              videoUrl: '',
            },
          ],
        },
      ],
    }));
  };

  const removeSection = (sectionIndex: number) => {
    if (formData.sections.length > 1) {
      setFormData(prev => ({
        ...prev,
        sections: prev.sections.filter((_, index) => index !== sectionIndex),
      }));
    }
  };

  const updateSection = (sectionIndex: number, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex ? { ...section, [field]: value } : section
      ),
    }));
  };

  const addLesson = (sectionIndex: number) => {
    const section = formData.sections[sectionIndex];
    const newLessonId = (section.lessons.length + 1).toString();
    
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, index) =>
        index === sectionIndex
          ? {
              ...section,
              lessons: [
                ...section.lessons,
                {
                  id: newLessonId,
                  title: '',
                  duration: 0,
                  preview: false,
                  description: '',
                  videoUrl: '',
                },
              ],
            }
          : section
      ),
    }));
  };

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    const section = formData.sections[sectionIndex];
    if (section.lessons.length > 1) {
      setFormData(prev => ({
        ...prev,
        sections: prev.sections.map((section, index) =>
          index === sectionIndex
            ? {
                ...section,
                lessons: section.lessons.filter((_, idx) => idx !== lessonIndex),
              }
            : section
        ),
      }));
    }
  };

  const updateLesson = (sectionIndex: number, lessonIndex: number, field: string, value: unknown) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, sIndex) =>
        sIndex === sectionIndex
          ? {
              ...section,
              lessons: section.lessons.map((lesson, lIndex) =>
                lIndex === lessonIndex ? { ...lesson, [field]: value } : lesson
              ),
            }
          : section
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await apiFetch(`/admin/courses/${courseId}`, {
        method: 'PUT',
        body: formData,
      });

      toast.success('Kurs başarıyla güncellendi!');
      router.push('/admin/courses');
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Kurs güncellenirken bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AuthGuard requiredRole="admin">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-1/4 mb-8"></div>
            <div className="space-y-8">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-64 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const totalLessons = formData.sections.reduce((acc, section) => acc + section.lessons.length, 0);
  const totalDuration = formData.sections.reduce((acc, section) =>
    acc + section.lessons.reduce((lessonAcc, lesson) => lessonAcc + lesson.duration, 0), 0
  );

  return (
    <AuthGuard requiredRole="admin">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin/courses')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Kurs Düzenle
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">
              Kurs bilgilerini güncelleyin
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Temel Bilgiler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Kurs Başlığı *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Örn: React.js Temelleri"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Fiyat (TL) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level">Seviye *</Label>
                  <Select
                    value={formData.level}
                    onValueChange={(value) => handleInputChange('level', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Başlangıç</SelectItem>
                      <SelectItem value="intermediate">Orta</SelectItem>
                      <SelectItem value="advanced">İleri</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Dil *</Label>
                  <Select
                    value={formData.language}
                    onValueChange={(value) => handleInputChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Türkçe">Türkçe</SelectItem>
                      <SelectItem value="English">English</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">Kısa Açıklama *</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleInputChange('summary', e.target.value)}
                  placeholder="Kursun kısa açıklaması..."
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Detaylı Açıklama *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Kursun detaylı açıklaması..."
                  rows={6}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Kurs Görseli URL *</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => handleInputChange('thumbnail', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Instructor Information */}
          <Card>
            <CardHeader>
              <CardTitle>Eğitmen Bilgileri</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="instructor-name">Eğitmen Adı *</Label>
                  <Input
                    id="instructor-name"
                    value={formData.instructor.name}
                    onChange={(e) => handleInputChange('instructor.name', e.target.value)}
                    placeholder="Eğitmen adı"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructor-avatar">Eğitmen Avatar URL</Label>
                  <Input
                    id="instructor-avatar"
                    value={formData.instructor.avatar}
                    onChange={(e) => handleInputChange('instructor.avatar', e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructor-bio">Eğitmen Biyografisi *</Label>
                <Textarea
                  id="instructor-bio"
                  value={formData.instructor.bio}
                  onChange={(e) => handleInputChange('instructor.bio', e.target.value)}
                  placeholder="Eğitmenin deneyimi ve uzmanlık alanları..."
                  rows={4}
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Course Content */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Kurs İçeriği</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {formData.sections.length} Bölüm
                  </Badge>
                  <Badge variant="outline">
                    {totalLessons} Ders
                  </Badge>
                  <Badge variant="outline">
                    {Math.floor(totalDuration / 60)}s {totalDuration % 60}dk
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {formData.sections.map((section, sectionIndex) => (
                <Card key={section.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge variant="secondary">
                          Bölüm {sectionIndex + 1}
                        </Badge>
                        <Input
                          value={section.title}
                          onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)}
                          placeholder="Bölüm başlığı"
                          className="flex-1"
                        />
                      </div>
                      {formData.sections.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSection(sectionIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {section.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <Badge variant="outline">
                                Ders {lessonIndex + 1}
                              </Badge>
                              <Input
                                value={lesson.title}
                                onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'title', e.target.value)}
                                placeholder="Ders başlığı"
                                className="flex-1"
                              />
                            </div>
                            {section.lessons.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLesson(sectionIndex, lessonIndex)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label>Ders Süresi (dakika)</Label>
                              <Input
                                type="number"
                                min="0"
                                value={lesson.duration}
                                onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'duration', parseInt(e.target.value) || 0)}
                                placeholder="0"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Video URL</Label>
                              <Input
                                value={lesson.videoUrl}
                                onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'videoUrl', e.target.value)}
                                placeholder="https://example.com/video.mp4"
                              />
                            </div>
                          </div>

                          <div className="space-y-2 mt-4">
                            <Label>Ders Açıklaması</Label>
                            <Textarea
                              value={lesson.description}
                              onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'description', e.target.value)}
                              placeholder="Ders açıklaması..."
                              rows={2}
                            />
                          </div>

                          <div className="flex items-center gap-2 mt-4">
                            <input
                              type="checkbox"
                              id={`preview-${sectionIndex}-${lessonIndex}`}
                              checked={lesson.preview}
                              onChange={(e) => updateLesson(sectionIndex, lessonIndex, 'preview', e.target.checked)}
                              className="rounded"
                            />
                            <Label htmlFor={`preview-${sectionIndex}-${lessonIndex}`}>
                              Önizleme dersi (ücretsiz)
                            </Label>
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => addLesson(sectionIndex)}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Ders Ekle
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Button
                type="button"
                variant="outline"
                onClick={addSection}
                className="w-full"
              >
                <Plus className="h-4 w-4 mr-2" />
                Bölüm Ekle
              </Button>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex items-center justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/courses')}
            >
              İptal
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
            </Button>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}
