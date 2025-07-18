import { SimpleContentData } from '@type/explore/Explore';
import axiosInstance from '../axiosInstance';

// 오늘의 OTT 콘텐츠 추천 목록 조회 API 호출 함수 (/api/contents/today)
export const getTodayContents = async (): Promise<SimpleContentData[]> => {
  const res = await axiosInstance.get<SimpleContentData[]>(
    '/api/contents/weekly',
  );
  return res.data;
};
