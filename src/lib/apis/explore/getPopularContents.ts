import axiosInstance from '@lib/apis/axiosInstance';
import { SimpleContentData } from '@type/explore/Explore';

// OTT 콘텐츠 인기 목록 조회 API 호출 함수 (/api/contents/popular)
export const getPopularContents = async (
  size: number = 10,
): Promise<SimpleContentData[]> => {
  const response = await axiosInstance.get<SimpleContentData[]>(
    '/api/contents/popular',
    {
      params: {
        size,
      },
    },
  );
  return response.data;
};
