import { ContentWithoutId } from '@type/admin/Content';
import axiosInstance from '@lib/apis/axiosInstance';

/**
 * 콘텐츠 수정 API
 * @param contentId - 수정할 콘텐츠 ID
 * @param data - 수정할 콘텐츠 데이터
 * @returns 수정된 콘텐츠 ID
 */
export const patchContent = (contentId: number, data: ContentWithoutId) => {
  return axiosInstance.patch<{ contentId: number }>(
    `/api/admin/contents/${contentId}`,
    data,
  );
};
