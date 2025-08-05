import { CategoryMetricsResponse } from '@type/admin/CategoryMetric';
import axiosInstance from '@lib/apis/axiosInstance';

/**
 * 콘텐츠 카테고리 별 지표 조회 API
 * @returns 카테고리별 콘텐츠 수를 포함한 응답 객체
 */
export const getCategoryMetrics = () => {
  return axiosInstance
    .get<CategoryMetricsResponse>('/api/admin/metrics/categories')
    .then((res) => res.data);
};
