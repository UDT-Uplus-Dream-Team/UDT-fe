import { ContentWithoutId } from '@type/admin/Content';
import axiosInstance from '@lib/apis/axiosInstance';

/**
 * 콘텐츠 상세 조회 API
 * @param contentId - 조회할 콘텐츠 ID
 * @returns 콘텐츠 상세 정보
 */
export const getContentDetail = (contentId: number) =>
  axiosInstance.get<ContentWithoutId>(`/api/admin/contents/${contentId}`);
