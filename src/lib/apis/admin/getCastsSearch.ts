import { AdminCastsGetRequest, AdminCastsGetResponse } from '@type/admin/Cast';
import axiosInstance from '@lib/apis/axiosInstance';

/**
 * 출연진 목록 조회 API
 * @param params - 출연진 검색 조건 (이름, 커서, 페이지 사이즈 등)
 * @returns 출연진 목록, 다음 커서 및 hasNext 여부를 포함한 응답 객체
 */
export const getCastsSearch = (params: AdminCastsGetRequest) => {
  return axiosInstance
    .get<AdminCastsGetResponse>('/api/admin/casts', {
      params,
    })
    .then((res) => res.data);
};
