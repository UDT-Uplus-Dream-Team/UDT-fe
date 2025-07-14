// import { axiosInstance } from '../axiosInstance';
import {
  GetFilteredContentRequest,
  GetFilteredContentResponse,
} from '@type/explore/FilteredContent';

/**
 * OTT 콘텐츠 필터링 목록 조회
 * @param filterParams category, genre, platform 목록
 * @returns 콘텐츠 목록과 페이지네이션 정보
 */
export const getFilteredContent = async (
  filterParams: GetFilteredContentRequest,
): Promise<GetFilteredContentResponse> => {
  console.log('[Mock] getFilteredContent 호출됨:', filterParams);

  // 간단한 Mock Data
  const mockData: GetFilteredContentResponse = {
    contents: [
      {
        contentId: 101,
        title: '기처리가 떴다',
        description: '용맹한 바이킹과 사나운 드래곤의 우정 이야기',
        posterUrl: 'https://image.example.com/poster.jpg',
        categories: [
          {
            category: '영화',
            genres: ['SF', '코미디'],
          },
        ],
      },
      {
        contentId: 102,
        title: '인사이드 아웃 2',
        description: '감정 캐릭터들의 성장 스토리',
        posterUrl: 'https://image.example.com/inside2.jpg',
        categories: [
          {
            category: '영화',
            genres: ['애니메이션', '판타지'],
          },
        ],
      },
    ],
    nextCursor: null,
    hasNext: false,
  };

  // 실제 네트워크처럼 딜레이도 줄 수 있음
  await new Promise((resolve) => setTimeout(resolve, 300));

  // TODO: 추후 axios 연동 필요
  return mockData;
};
