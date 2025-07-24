import { getStoredContentDetail } from '@lib/apis/profile/getStoredContentDetail';
import { StoredContentDetail } from '@type/profile/StoredContentDetail';
import { useQuery } from '@tanstack/react-query';

export const useGetStoredContentDetail = (contentId: number | null) => {
  return useQuery<StoredContentDetail>({
    queryKey: ['contentDetail', contentId],
    queryFn: () => getStoredContentDetail(contentId as number),
    enabled: contentId !== null,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};
