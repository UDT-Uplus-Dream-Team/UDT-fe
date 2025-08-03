import { ContentCreateUpdate } from '@type/admin/Content';
import axiosInstance from '@lib/apis/axiosInstance';

/**
 * 콘텐츠 수정 API
 * @param contentId - 수정할 콘텐츠 ID
 * @param data - 수정할 콘텐츠 데이터
 * @returns 수정 예정 콘텐츠 updateJobId 반환
 */
export const patchContent = (contentId: number, data: ContentCreateUpdate) => {
  return axiosInstance.post<{ updateJobId: number }>(
    `/api/admin/contents/updatejob/${contentId}`,
    data,
  );
};
