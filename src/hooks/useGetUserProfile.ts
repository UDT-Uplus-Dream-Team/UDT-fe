import { UserProfile } from '@type/auth/UserProfile';
import { useQuery } from '@tanstack/react-query';
import { authService } from '@lib/apis/authSevice';

export const useGetUserProfile = () => {
  return useQuery<UserProfile, Error>({
    queryKey: ['userProfile'],
    queryFn: authService.getCurrentUser,
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    retry: (failureCount: number, error: Error) => {
      if (error) console.log(error);
      return failureCount < 3;
    },
  });
};
