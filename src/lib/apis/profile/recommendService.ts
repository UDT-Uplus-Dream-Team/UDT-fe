import { RecommendedContent } from '@type/profile/RecommendedContent';
import axiosInstance from '../axiosInstance';

// [GET] /api/users/me/curated/contents 사용자의 큐레이션 콘텐츠 목록 조회

export const getCuratedContents = async (): Promise<RecommendedContent[]> => {
  const response = await axiosInstance.get<{ contents: RecommendedContent[] }>(
    '/api/users/me/curated/contents',
  );
  return response.data.contents;
};
