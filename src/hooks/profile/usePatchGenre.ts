import { patchGenre } from '@/lib/apis/profile/surveyService';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const usePatchGenre = () => {
  //캐시를 수동으로 조작 최신 데이터가 즉시 반영
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: patchGenre,
    // 성공 시 호출 → userInfo 캐시를 무효화해서 최신 정보로 다시 fetch되도록 함
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userInfo'] });
    },
  });
};
