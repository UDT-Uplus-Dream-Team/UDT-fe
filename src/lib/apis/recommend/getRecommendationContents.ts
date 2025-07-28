import axiosInstance from '@lib/apis/axiosInstance';
import { TicketComponent } from '@type/recommend/TicketComponent';
import { AxiosResponse, AxiosError } from 'axios';

function isAxiosError(err: unknown): err is AxiosError {
  return err !== null && typeof err === 'object' && 'isAxiosError' in err;
}

function handleAxiosError(error: AxiosError): never {
  if (error.response) {
    const { status, statusText, data } = error.response;
    switch (status) {
      case 400:
        throw new Error('잘못된 요청입니다. 파라미터를 확인해주세요.');
      case 401:
        throw new Error('인증이 필요합니다. 로그인 후 다시 시도해주세요.');
      case 403:
        throw new Error('접근 권한이 없습니다.');
      case 404:
        throw new Error('추천 콘텐츠를 찾을 수 없습니다.');
      case 500:
        throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
      default:
        throw new Error(
          (typeof data === 'object' && data !== null && 'message' in data
            ? (data as { message?: string }).message
            : undefined) ||
            `API 오류 (${status}): ${statusText}` ||
            '알 수 없는 서버 오류가 발생했습니다.',
        );
    }
  }
  if (error.request) {
    console.error('네트워크 에러:', error.request);
    throw new Error('네트워크 연결을 확인해주세요.');
  }
  console.error('기타 에러:', error.message);
  throw new Error(error.message || '알 수 없는 오류가 발생했습니다.');
}

function handleUnknownError(error: unknown): never {
  if (error instanceof Error) {
    console.error('일반 에러:', error.message);
    throw new Error(error.message);
  }
  console.error('알 수 없는 에러:', error);
  throw new Error('알 수 없는 오류가 발생했습니다.');
}

export const getRecommendationContents = async (
  limit: number = 10,
): Promise<TicketComponent[]> => {
  try {
    const response: AxiosResponse<TicketComponent[]> = await axiosInstance.get(
      `/api/v1/contents/recommendations`,
      {
        params: { limit },
      },
    );

    if (!Array.isArray(response.data)) {
      console.error('API 응답이 배열 형태가 아닙니다:', response.data);
      throw new Error('잘못된 API 응답 형식입니다.');
    }

    return response.data;
  } catch (error: unknown) {
    console.error('추천 콘텐츠 API 요청 실패:', error);
    if (isAxiosError(error)) {
      handleAxiosError(error);
    }
    handleUnknownError(error);
  }
};
