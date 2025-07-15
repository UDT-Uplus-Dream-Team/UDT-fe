import { useQuery } from '@tanstack/react-query';
import { getFeedbackContents } from '@lib/apis/profile/feedbackService';
import { RecommendedContent } from '@type/mypage/RecommendedContent';

export const useGetFeedbackContents = () => {
  return useQuery<RecommendedContent[], Error>({
    queryKey: ['feedbackContents'], // 이 키로 캐싱됨
    queryFn: getFeedbackContents,
    staleTime: Infinity, // 수동으로만 refetch
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

// 나중에 postSwipeFeedback에서 성공 시 queryClient.invalidateQueries({ queryKey: ['feedbackContents'] }) 필요
// feedback 리스트 캐싱 구조로 설계
// 맨처음 및 등록 / 삭제 시만 캐싱
