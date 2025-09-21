/**
 * Admin Actions Hook - Admin işlemleri için yardımcı hook
 */

'use client';

import { useCallback } from 'react';
import { useToast } from '@/lib/stores/useToast';
import { useAdminLogs, type LogCategory } from '@/lib/stores/useAdminLogs';

interface AdminActionOptions {
  category: LogCategory;
  action: string;
  successMessage?: string;
  errorMessage?: string;
  loadingMessage?: string;
}

export function useAdminActions() {
  const { success, error, warning, loading: showLoading, removeToast, updateToast } = useToast();
  const { logInfo, logSuccess, logError, logWarning } = useAdminLogs();

  /**
   * Async işlem wrapper'ı - loading, success/error handling ve logging
   */
  const executeWithLoading = useCallback(async <T>(
    asyncFunction: () => Promise<T>,
    options: AdminActionOptions
  ): Promise<T> => {
    const { category, action, successMessage, errorMessage, loadingMessage } = options;
    
    // Loading toast göster
    const loadingToastId = showLoading(
      loadingMessage || `${action} İşlemi`, 
      'İşlem devam ediyor...'
    );
    
    // Log ekle
    logInfo(category, `${action} başladı`);
    
    try {
      const result = await asyncFunction();
      
      // Loading toast'ını kaldır
      removeToast(loadingToastId);
      
      // Success toast göster
      success(
        successMessage || `${action} Tamamlandı`,
        'İşlem başarıyla gerçekleştirildi'
      );
      
      // Success log ekle
      logSuccess(category, `${action} başarıyla tamamlandı`);
      
      return result;
      
    } catch (err) {
      // Loading toast'ını kaldır
      removeToast(loadingToastId);
      
      // Error toast göster
      error(
        errorMessage || `${action} Başarısız`,
        err instanceof Error ? err.message : 'Bir hata oluştu'
      );
      
      // Error log ekle
      logError(
        category, 
        `${action} başarısız oldu`, 
        err instanceof Error ? err.message : 'Bilinmeyen hata'
      );
      
      throw err;
    }
  }, [success, error, showLoading, removeToast, logInfo, logSuccess, logError]);

  /**
   * Basit success notification ve log
   */
  const notifySuccess = useCallback((
    category: LogCategory,
    action: string,
    message?: string,
    details?: string
  ) => {
    success(message || `${action} Başarılı`, details);
    logSuccess(category, action, details);
  }, [success, logSuccess]);

  /**
   * Basit error notification ve log
   */
  const notifyError = useCallback((
    category: LogCategory,
    action: string,
    message?: string,
    details?: string
  ) => {
    error(message || `${action} Başarısız`, details);
    logError(category, action, details);
  }, [error, logError]);

  /**
   * Basit warning notification ve log
   */
  const notifyWarning = useCallback((
    category: LogCategory,
    action: string,
    message?: string,
    details?: string
  ) => {
    warning(message || `${action} Uyarısı`, details);
    logWarning(category, action, details);
  }, [warning, logWarning]);

  /**
   * Sadece log ekle (toast gösterme)
   */
  const logOnly = useCallback((
    category: LogCategory,
    level: 'info' | 'success' | 'warning' | 'error',
    action: string,
    details?: string,
    metadata?: Record<string, any>
  ) => {
    const logFunctions = {
      info: logInfo,
      success: logSuccess,
      warning: logWarning,
      error: logError
    };
    
    logFunctions[level](category, action, details, metadata);
  }, [logInfo, logSuccess, logWarning, logError]);

  return {
    executeWithLoading,
    notifySuccess,
    notifyError,
    notifyWarning,
    logOnly
  };
}
