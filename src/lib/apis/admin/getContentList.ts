import {
  AdminContentListParams,
  AdminContentListResponse,
} from '@type/admin/Content';
import axiosInstance from '@lib/apis/axiosInstance';

/**
 * 관리자 콘텐츠 목록 조회 API
 * @param params - 커서 기반 페이지네이션 파라미터 (cursor, size, categoryType)
 * @returns 콘텐츠 요약 목록 + 페이징 정보
 */
export const getContentList = async (
  params: AdminContentListParams,
): Promise<AdminContentListResponse> => {
  const response = await axiosInstance.get<AdminContentListResponse>(
    '/api/admin/contents',
    { params },
  );
  return response.data;
};
