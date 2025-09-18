/**
 * API Fetcher - Backend ile iletişim için wrapper
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.vetmedipedia.com';

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: ApiErrorResponse['error'];
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface ApiFetchOptions extends Omit<RequestInit, 'body'> {
  cache?: RequestCache;
  next?: NextFetchRequestConfig;
  body?: unknown;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: ApiFetchOptions = {}
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
  console.log('🌐 Full API URL:', url);
  
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
    console.log('🌐 API Request:', { url, method, body: config.body });
    const response = await fetch(url, config);
    console.log('🌐 API Response status:', response.status, response.statusText);

    // HTTP hata durumlarını kontrol et
    if (!response.ok) {
      let errorData: ApiErrorResponse['error'];
      
      try {
        const errorResponse = await response.json();
        console.error('🌐 API Error Response:', errorResponse);
        
        // Backend'den gelen hata formatını kontrol et
        if (errorResponse.message) {
          // Backend'den gelen mesajı direkt kullan
          errorData = {
            code: `HTTP_${response.status}`,
            message: errorResponse.message,
          };
        } else if (errorResponse.error) {
          // Eski format
          errorData = errorResponse.error;
        } else {
          // Varsayılan hata
          errorData = {
            code: `HTTP_${response.status}`,
            message: response.statusText || 'Bir hata oluştu',
          };
        }
      } catch {
        console.error('🌐 Failed to parse error response');
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
    const responseText = await response.text();
    console.log('🌐 Raw API Response:', responseText);
    
    try {
      const data = JSON.parse(responseText);
      console.log('🌐 Parsed API Response:', data);
      return data;
    } catch (parseError) {
      console.error('🌐 JSON Parse Error:', parseError);
      console.error('🌐 Response was not JSON:', responseText);
      throw new ApiError(
        'INVALID_JSON',
        'Sunucudan geçersiz yanıt alındı',
        { responseText, parseError }
      );
    }
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    // Network veya diğer hatalar
    console.error('🌐 Network/Parse Error:', error);
    throw new ApiError(
      'NETWORK_ERROR',
      error instanceof Error ? error.message : 'Bağlantı hatası',
      error
    );
  }
}

// Mock data kaldırıldı - artık sadece gerçek API kullanılıyor
