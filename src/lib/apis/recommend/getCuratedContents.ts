import axiosInstance from '@/lib/apis/axiosInstance';
import { TicketComponent } from '@type/recommend/TicketComponent';

interface CuratedContentsResponse {
  success: boolean;
  data: TicketComponent[];
  message?: string;
}

/**
 * 큐레이션된 추천 콘텐츠를 가져오는 API 함수
 * @returns Promise<CuratedContentsResponse>
 */
export const getCuratedContents =
  async (): Promise<CuratedContentsResponse> => {
    try {
      const response = await axiosInstance.get<TicketComponent[]>(
        '/api/v1/contents/recommendations/curated',
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error: unknown) {
      console.error('큐레이션 콘텐츠 가져오기 실패:', error);

      return {
        success: false,
        data: [],
        message:
          error instanceof Error
            ? error.message
            : '알 수 없는 오류가 발생했습니다.',
      };
    }
  };
