/**
 * Admin Logs Store - Admin işlemleri için aktivite log sistemi
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type LogLevel = 'info' | 'success' | 'warning' | 'error';
export type LogCategory = 'auth' | 'courses' | 'users' | 'orders' | 'settings' | 'system';

export interface AdminLog {
  id: string;
  timestamp: Date;
  level: LogLevel;
  category: LogCategory;
  action: string;
  details?: string;
  userId?: string;
  userName?: string;
  metadata?: Record<string, unknown>;
}

interface AdminLogsState {
  logs: AdminLog[];
  maxLogs: number;
}

interface AdminLogsActions {
  addLog: (log: Omit<AdminLog, 'id' | 'timestamp'>) => void;
  clearLogs: () => void;
  getLogsByCategory: (category: LogCategory) => AdminLog[];
  getLogsByLevel: (level: LogLevel) => AdminLog[];
  getRecentLogs: (count?: number) => AdminLog[];
  
  // Shorthand methods
  logInfo: (category: LogCategory, action: string, details?: string, metadata?: Record<string, unknown>) => void;
  logSuccess: (category: LogCategory, action: string, details?: string, metadata?: Record<string, unknown>) => void;
  logWarning: (category: LogCategory, action: string, details?: string, metadata?: Record<string, unknown>) => void;
  logError: (category: LogCategory, action: string, details?: string, metadata?: Record<string, unknown>) => void;
}

type AdminLogsStore = AdminLogsState & AdminLogsActions;

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useAdminLogs = create<AdminLogsStore>()(
  persist(
    (set, get) => ({
      logs: [],
      maxLogs: 1000, // Maksimum log sayısı

      addLog: (logData) => {
        const newLog: AdminLog = {
          ...logData,
          id: generateId(),
          timestamp: new Date(),
        };

        set((state) => {
          const updatedLogs = [newLog, ...state.logs];
          
          // Maksimum log sayısını aş
          if (updatedLogs.length > state.maxLogs) {
            return {
              logs: updatedLogs.slice(0, state.maxLogs)
            };
          }
          
          return { logs: updatedLogs };
        });

        // Console'a da yazdır (development için)
        if (process.env.NODE_ENV === 'development') {
          const emoji = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
          }[logData.level];
          
          console.log(
            `${emoji} [ADMIN LOG] ${logData.category.toUpperCase()}: ${logData.action}`,
            logData.details ? `\n   ${logData.details}` : '',
            logData.metadata ? `\n   Metadata:` : '',
            logData.metadata || ''
          );
        }
      },

      clearLogs: () => set({ logs: [] }),

      getLogsByCategory: (category) => {
        return get().logs.filter(log => log.category === category);
      },

      getLogsByLevel: (level) => {
        return get().logs.filter(log => log.level === level);
      },

      getRecentLogs: (count = 50) => {
        return get().logs.slice(0, count);
      },

      // Shorthand methods
      logInfo: (category, action, details, metadata) => {
        get().addLog({ level: 'info', category, action, details, metadata });
      },

      logSuccess: (category, action, details, metadata) => {
        get().addLog({ level: 'success', category, action, details, metadata });
      },

      logWarning: (category, action, details, metadata) => {
        get().addLog({ level: 'warning', category, action, details, metadata });
      },

      logError: (category, action, details, metadata) => {
        get().addLog({ level: 'error', category, action, details, metadata });
      },
    }),
    {
      name: 'admin-logs-storage',
      partialize: (state) => ({ 
        logs: state.logs.slice(0, 100) // Sadece son 100 log'u persist et
      }),
    }
  )
);
