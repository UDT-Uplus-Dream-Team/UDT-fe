import {
  AdminDirectorsGetRequest,
  AdminDirectorsGetResponse,
} from '@type/admin/Director';
import axiosInstance from '@lib/apis/axiosInstance';

/**
 * 감독 목록 조회 API
 * @param params - 감독 검색 조건 (이름, 커서, 페이지 사이즈 등)
 * @returns 감독 목록, 다음 커서 및 hasNext 여부를 포함한 응답 객체
 */
export const getDirectorsSearch = (params: AdminDirectorsGetRequest) => {
  return axiosInstance
    .get<AdminDirectorsGetResponse>('/api/admin/directors', {
      params,
    })
    .then((res) => res.data);
};
