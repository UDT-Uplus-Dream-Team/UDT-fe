import { useGetPopularContents } from '@hooks/explore/useGetPopularContents';
import { useGetTodayRecommendContents } from '@hooks/explore/useGetTodayRecommendContents';

// 포스터 스크롤 박스 타입에 따라 콘텐츠 목록 조회 API 호출하는 custom Hook
export const useGetContentListByBoxType = (
  boxType: 'popular' | 'todayRecommend',
) => {
  const isPopular = boxType === 'popular';
  const isToday = boxType === 'todayRecommend';

  const popularQuery = useGetPopularContents(isPopular); // 인기 콘텐츠 데이터 조회일 때만 수행
  const todayQuery = useGetTodayRecommendContents(isToday); // 오늘의 추천 콘텐츠 데이터 조회일 때만 수행

  const data = isPopular ? popularQuery.data : todayQuery.data; // 포스터 스크롤 박스 타입에 따라 콘텐츠 목록 반환
  const isLoading = isPopular ? popularQuery.isLoading : todayQuery.isLoading; // 포스터 스크롤 박스 타입에 따라 로딩 상태 반환
  const isError = isPopular ? popularQuery.isError : todayQuery.isError; // 포스터 스크롤 박스 타입에 따라 에러 상태 반환
  const refetch = isPopular ? popularQuery.refetch : todayQuery.refetch; // 다시 불러오기 함수

  return {
    data: data || [],
    isLoading,
    isError,
    refetch,
  };
};
