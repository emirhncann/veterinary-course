'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Play, Pause, Volume2, VolumeX, Settings, Maximize, ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AuthGuard } from '@/components/AuthGuard';
import { VideoPlayer } from '@/components/VideoPlayer';
import { apiFetch } from '@/lib/fetcher';
import type { Course, Lesson } from '@/types/api';

// Static params kaldırıldı - client component olduğu için generateStaticParams kullanılamaz

async function getCourse(courseId: string): Promise<Course | null> {
  try {
    const response = await apiFetch<Course>(`/courses/${courseId}`);
    return response;
  } catch (error) {
    console.error('Error fetching course:', error);
    return null;
  }
}

export default function PlayerPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const lessonId = params.lessonId as string;

  const [course, setCourse] = React.useState<Course | null>(null);
  const [currentLesson, setCurrentLesson] = React.useState<Lesson | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const courseData = await getCourse(courseId);
        setCourse(courseData);
        
        if (courseData) {
          // Find current lesson
          const lesson = courseData.sections
            .flatMap(section => section.lessons)
            .find(lesson => lesson.id === lessonId);
          
          setCurrentLesson(lesson || null);
        }
      } catch (error) {
        console.error('Error loading course:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, lessonId]);

  const getCurrentLessonIndex = () => {
    if (!course || !currentLesson) return -1;
    
    const allLessons = course.sections.flatMap(section => section.lessons);
    return allLessons.findIndex(lesson => lesson.id === currentLesson.id);
  };

  const getNextLesson = () => {
    if (!course) return null;
    
    const allLessons = course.sections.flatMap(section => section.lessons);
    const currentIndex = getCurrentLessonIndex();
    
    if (currentIndex < allLessons.length - 1) {
      return allLessons[currentIndex + 1];
    }
    return null;
  };

  const getPreviousLesson = () => {
    if (!course) return null;
    
    const allLessons = course.sections.flatMap(section => section.lessons);
    const currentIndex = getCurrentLessonIndex();
    
    if (currentIndex > 0) {
      return allLessons[currentIndex - 1];
    }
    return null;
  };

  const navigateToLesson = (lesson: Lesson) => {
    router.push(`/player/${courseId}/${lesson.id}`);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}dk`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}s ${mins}dk` : `${hours}s`;
  };

  if (loading) {
    return (
      <AuthGuard>
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </AuthGuard>
    );
  }

  if (!course || !currentLesson) {
    return (
      <AuthGuard>
        <div className="h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ders bulunamadı</h2>
            <Button onClick={() => router.push('/library')}>
              Kitaplığa Dön
            </Button>
          </div>
        </div>
      </AuthGuard>
    );
  }

  const allLessons = course.sections.flatMap(section => section.lessons);
  const currentIndex = getCurrentLessonIndex();
  const nextLesson = getNextLesson();
  const previousLesson = getPreviousLesson();

  return (
    <AuthGuard>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <div className="bg-background border-b px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/courses/${course.slug}`)}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Kursa Dön
              </Button>
              <div>
                <h1 className="font-semibold text-sm">{course.title}</h1>
                <p className="text-xs text-muted-foreground">
                  Ders {currentIndex + 1} / {allLessons.length}: {currentLesson.title}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {previousLesson && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToLesson(previousLesson)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Önceki
                </Button>
              )}
              {nextLesson && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateToLesson(nextLesson)}
                >
                  Sonraki
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Video Player */}
          <div className="flex-1 flex flex-col">
            <div className="flex-1 bg-black">
              <VideoPlayer
                courseId={courseId}
                lessonId={lessonId}
                videoUrl={currentLesson.videoUrl || ''}
                title={currentLesson.title}
              />
            </div>
            
            {/* Lesson Info */}
            <div className="bg-background border-t p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold mb-1">{currentLesson.title}</h2>
                  {currentLesson.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {currentLesson.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>Ders {currentIndex + 1} / {allLessons.length}</span>
                    <span>{formatDuration(currentLesson.duration)}</span>
                    {currentLesson.preview && (
                      <Badge variant="secondary" className="text-xs">
                        Önizleme
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-background border-l overflow-y-auto">
            <Tabs defaultValue="lessons" className="h-full">
              <TabsList className="grid w-full grid-cols-2 m-4">
                <TabsTrigger value="lessons">Müfredat</TabsTrigger>
                <TabsTrigger value="notes">Notlar</TabsTrigger>
              </TabsList>
              
              <TabsContent value="lessons" className="px-4 pb-4">
                <div className="space-y-2">
                  {course.sections.map((section, sectionIndex) => (
                    <Card key={section.id}>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">
                          Bölüm {sectionIndex + 1}: {section.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-1">
                          {section.lessons.map((lesson, lessonIndex) => {
                            const globalIndex = course.sections
                              .slice(0, sectionIndex)
                              .reduce((acc, s) => acc + s.lessons.length, 0) + lessonIndex;
                            
                            return (
                              <button
                                key={lesson.id}
                                onClick={() => navigateToLesson(lesson)}
                                className={`w-full text-left p-2 rounded text-sm transition-colors ${
                                  lesson.id === currentLesson.id
                                    ? 'bg-primary text-primary-foreground'
                                    : 'hover:bg-muted'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs">
                                      {globalIndex + 1}
                                    </div>
                                    <span className="truncate">{lesson.title}</span>
                                  </div>
                                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                    <span>{formatDuration(lesson.duration)}</span>
                                    {lesson.preview && (
                                      <Badge variant="outline" className="text-xs">
                                        Önizle
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="notes" className="px-4 pb-4">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-sm">Ders Notları</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-muted-foreground">
                        <p>Bu ders için henüz not eklenmemiş.</p>
                        <p className="mt-2">Not ekleme özelliği yakında eklenecek.</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}