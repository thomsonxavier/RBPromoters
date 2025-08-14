import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '',
    'X-Appwrite-Response-Format': '1.7.0',
    'X-Sdk-Name': 'Web',
    'X-Sdk-Platform': 'client',
    'X-Sdk-Version': '18.1.1',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Get session from localStorage or cookies if available
    const session = typeof window !== 'undefined' ? localStorage.getItem('appwrite_session') : null;
    
    if (session) {
      config.headers['X-Appwrite-Session'] = session;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear session
      if (typeof window !== 'undefined') {
        localStorage.removeItem('appwrite_session');
      }
    }
    
    return Promise.reject(error);
  }
);

// Fetcher function for API calls
export interface FetcherOptions {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: any;
  headers?: Record<string, string>;
}

export const fetcher = async <T = any>(options: FetcherOptions): Promise<T> => {
  const { url, method, data, params, headers } = options;
  
  try {
    const response = await api.request({
      url,
      method: method.toLowerCase(),
      data,
      params,
      headers,
    });
    
    return response.data;
  } catch (error) {
    throw error;
  }
};

export default api;
