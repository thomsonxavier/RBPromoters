import { useMutation, useQuery, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { fetcher } from './axios';
import { API_ENDPOINTS } from './api-constants';
import { Account, UpdateAccountRequest } from '../types/api';

// Profile hook - simplified for your needs
export function useGetProfile(
  options: Partial<UseQueryOptions<Account, Error>> = {}
) {
  return useQuery<Account, Error>({
    queryKey: ['profile'],
    queryFn: () => fetcher<Account>({
      url: API_ENDPOINTS.ACCOUNT.GET,
      method: 'GET',
    }),
    retry: false, // Don't retry if unauthorized
    ...options,
  });
}

export function useUpdateProfile(
  options: Partial<UseMutationOptions<Account, Error, UpdateAccountRequest>> = {}
) {
  return useMutation<Account, Error, UpdateAccountRequest>({
    mutationFn: (data) =>
      fetcher<Account>({
        url: API_ENDPOINTS.ACCOUNT.UPDATE_NAME,
        method: 'PUT',
        data,
      }),
    ...options,
  });
}
