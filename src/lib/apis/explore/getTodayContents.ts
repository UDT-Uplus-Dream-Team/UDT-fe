import { SimpleContentData } from '@type/explore/Explore';
import axiosInstance from '../axiosInstance';

// 오늘의 OTT 콘텐츠 추천 목록 조회 API 호출 함수 (/api/contents/weekly)
export const getTodayContents = async (
  size: number = 10,
): Promise<SimpleContentData[]> => {
  // Request Params 값으로 조회할 콘텐츠 개수 전달
  const res = await axiosInstance.get<SimpleContentData[]>(
    '/api/contents/weekly',
    {
      params: {
        size,
      },
    },
  );

  return res.data;
};
