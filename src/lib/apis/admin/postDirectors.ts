import axiosInstance from '@lib/apis/axiosInstance';
import {
  AdminDirectorCreateRequest,
  AdminDirectorCreateResponse,
} from '@type/admin/Director';

/**
 * 감독 다건 등록 API
 * @param data - 등록할 감독 배열
 * @returns 등록된 directorId 목록
 */
export const postAdminDirectors = (data: AdminDirectorCreateRequest) => {
  return axiosInstance
    .post<AdminDirectorCreateResponse>('/api/admin/directors', data)
    .then((res) => res.data);
};
