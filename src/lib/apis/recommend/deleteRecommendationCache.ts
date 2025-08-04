// 추천 캐시 클리어 API
import axiosInstance from '@lib/apis/axiosInstance';

/**
 * @returns Promise<void> - 성공 시 아무것도 반환하지 않음
 * @throws {Error} - API 호출 실패 시 에러 발생
 */
export const deleteRecommendationCache = async (): Promise<void> => {
  await axiosInstance.delete('/api/users/me/recommendations/cache/clear');
};
