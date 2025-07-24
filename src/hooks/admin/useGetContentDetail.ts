import { getContentDetail } from '@lib/apis/admin/getContentDetail';
import { useQuery } from '@tanstack/react-query';

// 콘텐츠 상세 정보를 불러오는 훅
export const useGetContentDetail = (contentId?: number) => {
  return useQuery({
    queryKey: ['adminContentDetail', contentId],
    queryFn: () => getContentDetail(contentId!).then((res) => res.data),
    enabled: !!contentId, // ID가 있을 때만 요청 실행
  });
};
