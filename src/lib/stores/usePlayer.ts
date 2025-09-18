/**
 * Player Store - Video oynatma ve ilerleme takibi
 */

import { create } from 'zustand';
import { apiFetch } from '@/lib/fetcher';
import type { PlayerProgress, PlayerProgressRequest } from '@/types/api';

interface PlayerState {
  currentCourseId: string | null;
  currentLessonId: string | null;
  progress: Record<string, PlayerProgress>; // lessonId -> progress
  loading: boolean;
  error: string | null;
}

interface PlayerActions {
  setCurrentLesson: (courseId: string, lessonId: string) => void;
  updateProgress: (data: PlayerProgressRequest) => Promise<void>;
  getProgress: (courseId: string, lessonId: string) => Promise<PlayerProgress>;
  clearProgress: () => void;
  setLoading: (loading: boolean) => void;
  clearError: () => void;
}

type PlayerStore = PlayerState & PlayerActions;

export const usePlayer = create<PlayerStore>((set, get) => ({
  // State
  currentCourseId: null,
  currentLessonId: null,
  progress: {},
  loading: false,
  error: null,

  // Actions
  setCurrentLesson: (courseId: string, lessonId: string) => {
    set({ currentCourseId: courseId, currentLessonId: lessonId });
  },

  updateProgress: async (data: PlayerProgressRequest) => {
    set({ loading: true, error: null });
    
    try {
      await apiFetch('/player/progress', {
        method: 'POST',
        body: data,
      });

      set((state) => ({
        progress: {
          ...state.progress,
          [data.lessonId]: {
            positionSec: data.positionSec,
            completed: data.completed,
          },
        },
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'İlerleme kaydedilirken bir hata oluştu';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  getProgress: async (courseId: string, lessonId: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await apiFetch<PlayerProgress>('/player/progress', {
        method: 'GET',
        // URL params would be handled by the backend
      });

      set((state) => ({
        progress: {
          ...state.progress,
          [lessonId]: response,
        },
        loading: false,
      }));

      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'İlerleme yüklenirken bir hata oluştu';
      set({ error: errorMessage, loading: false });
      
      // Return default progress on error
      return { positionSec: 0, completed: false };
    }
  },

  clearProgress: () => {
    set({ progress: {}, currentCourseId: null, currentLessonId: null });
  },

  setLoading: (loading: boolean) => set({ loading }),
  clearError: () => set({ error: null }),
}));

// Selectors
export const useCurrentLesson = () => usePlayer((state) => ({
  courseId: state.currentCourseId,
  lessonId: state.currentLessonId,
}));

export const useLessonProgress = (lessonId: string) => 
  usePlayer((state) => state.progress[lessonId] || { positionSec: 0, completed: false });

export const usePlayerLoading = () => usePlayer((state) => state.loading);
export const usePlayerError = () => usePlayer((state) => state.error);
