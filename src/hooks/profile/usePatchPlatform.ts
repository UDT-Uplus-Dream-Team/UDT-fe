import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchPlatform } from '@/lib/apis/profile/surveyService';

/**
 * OTT 플랫폼 목록 수정 훅
 * - 수정 후 유저 정보 invalidate
 */
export const usePatchPlatform = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchPlatform,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userProfile'] });
    },
  });
};
