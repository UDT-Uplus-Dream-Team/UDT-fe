import axiosInstance from '@lib/apis/axiosInstance';

/**
 * 콘텐츠 삭제 API
 * @param contentId - 삭제할 콘텐츠 ID
 * @returns 삭제 예정 콘텐츠 deleteJobId 반환
 */
export const deleteContent = (contentId: number) =>
  axiosInstance.post<{ deleteJobId: number }>(
    `/api/admin/contents/deletejob/${contentId}`,
  );
