/**
 * API Fetcher - Backend ile iletişim için wrapper
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: ApiError['error'];
}

class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit & {
    cache?: RequestCache;
    next?: NextFetchRequestConfig;
  } = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    cache = 'no-store',
    next,
    headers = {},
    ...restOptions
  } = options;

  const url = `${API_BASE_URL}${path}`;
  
  const config: RequestInit = {
    method,
    credentials: 'include', // Cookie'ler için gerekli
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    cache,
    ...restOptions,
  };

  if (body && method !== 'GET') {
    config.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);

    // HTTP hata durumlarını kontrol et
    if (!response.ok) {
      let errorData: ApiError['error'];
      
      try {
        const errorResponse = await response.json();
        errorData = errorResponse.error || {
          code: `HTTP_${response.status}`,
          message: response.statusText || 'Bir hata oluştu',
        };
      } catch {
        errorData = {
          code: `HTTP_${response.status}`,
          message: response.statusText || 'Bir hata oluştu',
        };
      }

      throw new ApiError(errorData.code, errorData.message, errorData.details);
    }

    // 204 No Content gibi boş yanıtlar
    if (response.status === 204) {
      return {} as T;
    }

    // JSON yanıtını parse et
    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network veya diğer hatalar
    throw new ApiError(
      'NETWORK_ERROR',
      error instanceof Error ? error.message : 'Bağlantı hatası',
      error
    );
  }
}

// Mock data için development helper
export const isDevelopment = process.env.NODE_ENV === 'development';

export function createMockResponse<T>(data: T, delay = 500): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(data), delay);
  });
}
