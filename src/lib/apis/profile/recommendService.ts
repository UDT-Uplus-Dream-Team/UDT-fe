import {
  GetRecommendedContentsResponse,
  RecommendedQueryParams,
} from '@type/profile/RecommendedContent';
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

//[DELETE] /api/api/users/me/curated/contents/bulk 리스트 형태로 삭제
export const deleteCuratedContents = async (
  contentIds: number[],
): Promise<void> => {
  await axiosInstance.delete('/api/api/users/me/curated/contents/bulk', {
    data: { contentIds },
  });
};
