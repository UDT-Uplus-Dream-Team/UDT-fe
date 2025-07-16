import { CreateContentRequest } from '@type/admin/Content';
import axiosInstance from '@lib/apis/axiosInstance';

/**
 * 콘텐츠 등록 API
 * @param data - 등록할 콘텐츠 정보
 * @returns 생성된 콘텐츠 ID
 */
export const postContent = (data: CreateContentRequest) =>
  axiosInstance.post<{ contentId: number }>('/api/admin/contents', data);
