import { useGetPopularContents } from '@hooks/explore/useGetPopularContents';
import { useGetTodayRecommendContents } from '@hooks/explore/useGetTodayRecommendContents';
import { useGetPlatformPicksContents } from '@hooks/explore/useGetPlatformPicksContents';

// 포스터 스크롤 박스 타입에 따라 콘텐츠 목록 조회 API 호출하는 custom Hook
export const useGetContentListByBoxType = (
  boxType: 'popular' | 'todayRecommend' | 'platformPicks',
) => {
  const isPopular = boxType === 'popular';
  const isToday = boxType === 'todayRecommend';
  const isPlatformPicks = boxType === 'platformPicks';

  const popularQuery = useGetPopularContents(isPopular); // 인기 콘텐츠 데이터 조회일 때만 수행
  const todayQuery = useGetTodayRecommendContents(isToday); // 오늘의 추천 콘텐츠 데이터 조회일 때만 수행
  const platformPicksQuery = useGetPlatformPicksContents(isPlatformPicks); // 플랫폼별 추천 콘텐츠 데이터 조회일 때만 수행

  // 포스터 스크롤 박스 타입에 따라 콘텐츠 목록 조회 API 호출하는 custom Hook 호출
  if (isPopular) {
    return popularQuery;
  } else if (isToday) {
    return todayQuery;
  } else if (isPlatformPicks) {
    return platformPicksQuery;
  } else {
    // 이 경우는 근데 발생하지 않을 것임 (type 오류 때문에 넣어놨음)
    return popularQuery;
  }
};
