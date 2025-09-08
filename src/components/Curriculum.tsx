'use client';

import * as React from 'react';
import { ChevronDown, ChevronRight, Play, Lock, Clock } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import type { CourseSection } from '@/types/api';

interface CurriculumProps {
  sections: CourseSection[];
}

export function Curriculum({ sections }: CurriculumProps) {
  const [openSections, setOpenSections] = React.useState<Set<string>>(new Set(['1'])); // İlk section açık

  const toggleSection = (sectionId: string) => {
    const newOpenSections = new Set(openSections);
    if (newOpenSections.has(sectionId)) {
      newOpenSections.delete(sectionId);
    } else {
      newOpenSections.add(sectionId);
    }
    setOpenSections(newOpenSections);
  };

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}dk`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}s ${mins}dk` : `${hours}s`;
  };

  const totalLessons = sections.reduce((acc, section) => acc + section.lessons.length, 0);
  const totalDuration = sections.reduce((acc, section) => 
    acc + section.lessons.reduce((lessonAcc, lesson) => lessonAcc + lesson.duration, 0), 0
  );

  return (
    <div className="space-y-4">
      {/* Curriculum Summary */}
      <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
        <div>
          <h3 className="font-semibold">Müfredat</h3>
          <p className="text-sm text-muted-foreground">
            {sections.length} bölüm • {totalLessons} ders • {formatDuration(totalDuration)}
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-2">
        {sections.map((section, sectionIndex) => (
          <Card key={section.id}>
            <Collapsible
              open={openSections.has(section.id)}
              onOpenChange={() => toggleSection(section.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {openSections.has(section.id) ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                      <div>
                        <CardTitle className="text-base">
                          Bölüm {sectionIndex + 1}: {section.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {section.lessons.length} ders
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <div className="space-y-2">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div
                        key={lesson.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                            {lessonIndex + 1}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm">{lesson.title}</h4>
                            {lesson.description && (
                              <p className="text-xs text-muted-foreground">
                                {lesson.description}
                              </p>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {formatDuration(lesson.duration)}
                          </div>
                          
                          {lesson.preview ? (
                            <Button size="sm" variant="outline" className="h-7">
                              <Play className="h-3 w-3 mr-1" />
                              Önizle
                            </Button>
                          ) : (
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Lock className="h-3 w-3" />
                              <span>Kilitli</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
}
