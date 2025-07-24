// 최신 콘텐츠 목록 조회
import axiosInstance from '@lib/apis/axiosInstance';
import { RecentContentData } from '@type/explore/Explore';

// 큰 카드들이 들어있는 Carousel 영역에 불러올 내용 (최대 10개까지 조회)
export const getLatestContents = async (
  size: number = 10,
): Promise<RecentContentData[]> => {
  const response = await axiosInstance.get('/api/contents/recent', {
    params: {
      size,
    },
  });
  return response.data;
};
