import { getStoredContentDetail } from '@lib/apis/profile/getStoredContentDetail';
import { StoredContentDetail } from '@type/profile/StoredContentDetail';
import { useQuery } from '@tanstack/react-query';

export const useGetStoredContentDetail = (contentId: number | null) => {
  return useQuery<StoredContentDetail>({
    queryKey: ['contentDetail', contentId],
    queryFn: () => getStoredContentDetail(contentId as number),
    enabled: contentId !== null,
    staleTime: 0, // 눌렀을 때 항상 새로운데이터 불러오게 구성 캐싱 노
  });
};
