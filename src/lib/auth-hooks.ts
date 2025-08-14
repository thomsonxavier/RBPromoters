import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { account } from '../app/appwrite';
import { fetcher } from './axios';
import { API_ENDPOINTS } from './api-constants';
import { Account } from '../types/api';

// Authentication hooks
export function useLogin() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      // First, create session with Appwrite
      const session = await account.createSession(credentials.email, credentials.password);
      
      // Store session in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('appwrite_session', session.$id);
      }
      
      // Then fetch profile data
      const profile = await fetcher<Account>({
        url: API_ENDPOINTS.ACCOUNT.GET,
        method: 'GET',
      });
      
      return profile;
    },
    onSuccess: (data) => {
      // Invalidate and refetch profile data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      queryClient.setQueryData(['profile'], data);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      // Clear session from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('appwrite_session');
      }
      
      // Delete session from Appwrite
      try {
        await account.deleteSessions();
      } catch (error) {
        console.log('Session already cleared or not found');
      }
    },
    onSuccess: () => {
      // Clear profile data from cache
      queryClient.setQueryData(['profile'], null);
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}

export function useGetProfile() {
  return useQuery<Account, Error>({
    queryKey: ['profile'],
    queryFn: async () => {
      // Check if we have a session
      const session = typeof window !== 'undefined' ? localStorage.getItem('appwrite_session') : null;
      
      if (!session) {
        throw new Error('No session found');
      }
      
      return fetcher<Account>({
        url: API_ENDPOINTS.ACCOUNT.GET,
        method: 'GET',
      });
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useCheckAuth() {
  return useQuery({
    queryKey: ['auth-check'],
    queryFn: async () => {
      const session = typeof window !== 'undefined' ? localStorage.getItem('appwrite_session') : null;
      return !!session;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}
