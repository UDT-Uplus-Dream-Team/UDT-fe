import axiosInstance from '@lib/apis/axiosInstance';
import { SimpleContentData } from '@type/explore/Explore';

// 플랫폼별 인기 콘텐츠 조회 API 호출 함수 (/api/platforms/popular-contents)
export const getPlatformPicksContents = async (): Promise<
  SimpleContentData[]
> => {
  const response = await axiosInstance.get<SimpleContentData[]>(
    '/api/platforms/popular-contents',
  );
  return response.data;
};
