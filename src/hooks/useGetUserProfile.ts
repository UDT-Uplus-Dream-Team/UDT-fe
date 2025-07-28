import { UserProfile } from '@type/auth/UserProfile';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@lib/apis/authService';
import { AxiosError } from 'axios';

export const useGetUserProfile = () => {
  return useQuery<UserProfile, AxiosError>({
    queryKey: ['userProfile'],
    queryFn: authService.getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    retry: (failureCount: number) => {
      return failureCount < 3;
    },
  });
};
