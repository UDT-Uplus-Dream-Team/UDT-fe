import axiosInstance from '@lib/apis/axiosInstance';
import {
  AdminCastCreateRequest,
  AdminCastCreateResponse,
} from '@type/admin/Cast';

/**
 * 출연진 다건 등록 API
 * @param data - 등록할 출연진 배열
 * @returns 등록된 castId 목록
 */
export const postAdminCasts = (data: AdminCastCreateRequest) => {
  return axiosInstance
    .post<AdminCastCreateResponse>('/api/admin/casts', data)
    .then((res) => res.data);
};
