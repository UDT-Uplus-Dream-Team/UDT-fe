import axiosInstance from '@lib/apis/axiosInstance';

/**
 * 콘텐츠 삭제 API
 * @param contentId - 삭제할 콘텐츠 ID
 * @returns 삭제 성공 시 204(No Content)
 */
export const deleteContent = (contentId: number) =>
  axiosInstance.delete(`/api/admin/contents/${contentId}`);
