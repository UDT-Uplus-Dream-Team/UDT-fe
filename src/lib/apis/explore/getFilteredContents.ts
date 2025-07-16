// lib/apis/fetchFilteredContents.ts
import axiosInstance from '@lib/apis/axiosInstance';
import {
  FilterContentRequest,
  FilteredContentResponse,
} from '@type/explore/FilteredContent';

// 필터링된 콘텐츠 목록 조회 API 호출 함수
export const getFilteredContents = async (
  requestBody: FilterContentRequest,
): Promise<FilteredContentResponse> => {
  // axiosInstance를 사용하여 "OTT 콘텐츠 필터링 목록 조회" API 호출
  const response = await axiosInstance.post<FilteredContentResponse>(
    '/api/contents',
    requestBody,
  );

  // 응답 데이터 반환
  return response.data;
};
