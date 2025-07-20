import {
  GetRecommendedContentsResponse,
  RecommendedQueryParams,
} from '@/types/profile/RecommendedContent';
import axiosInstance from '../axiosInstance';

// [GET] /api/users/me/curated/contents 사용자의 엄선된 콘텐츠 목록 조회

export const getCuratedContents = async (
  params: RecommendedQueryParams,
): Promise<GetRecommendedContentsResponse> => {
  const response = await axiosInstance.get<GetRecommendedContentsResponse>(
    '/api/users/me/curated/contents',
    { params },
  );

  return response.data;
};
