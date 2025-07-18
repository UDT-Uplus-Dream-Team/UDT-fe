import { RecommendedContent } from '@type/profile/RecommendedContent';
import { useQuery } from '@tanstack/react-query';
import { getCuratedContents } from '@/lib/apis/profile/recommendService';

export const useGetCuratedContents = () => {
  return useQuery<RecommendedContent[], Error>({
    queryKey: ['curatedContents'], // 고유 쿼리 키
    queryFn: getCuratedContents, // 실제 호출 함수
    staleTime: Infinity, // 무한히 fresh → 재요청 없음
    refetchOnMount: false, // 페이지 재진입 시 재요청 없음
    refetchOnWindowFocus: false, // 탭 전환에도 재요청 없음
  });
};

//데이터를 받거나 삭제할 때만....캐시 다시 되게 나중에
//이거는 걍...일단...나중에 처리하자
//queryClient.invalidateQueries({ queryKey: ['curatedContents'] }); 등록 삭제시 해당처리
