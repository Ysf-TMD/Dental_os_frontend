import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/lib/api/api-service';
import { ENDPOINTS } from '@/lib/api/endpoints';
import type { User } from '@/features/auth/types';
import type { LoginInput, RegisterInput } from '@/features/auth/schemas/auth-schema';

export function useMe() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: async () => {
      const response = await apiService.get<{ data: User }>(ENDPOINTS.auth.me);
      return response.data;
    },
    retry: false,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginInput) => {
      await apiService.post(ENDPOINTS.auth.login, credentials);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RegisterInput) => {
      await apiService.post(ENDPOINTS.auth.register, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await apiService.post(ENDPOINTS.auth.logout);
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
}
