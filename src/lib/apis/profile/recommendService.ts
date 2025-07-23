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

//[DELETE] api/users/me/curated/contents 리스트 형태로 삭제
//현재 api 모름 임의로 작성
export const deleteCuratedContents = async (
  contentIds: number[],
): Promise<void> => {
  await axiosInstance.delete('/api/users/me/curated/contents/delete', {
    data: { contentIds },
  });
};
