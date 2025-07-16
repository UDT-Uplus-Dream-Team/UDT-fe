import axiosInstance from '@lib/apis/axiosInstance';

interface FeedbackItem {
  contentId: number;
  feedback: string; // "LIKE" | "DISLIKE" | "UNINTERESTED"
}

interface PostFeedbackRequest {
  feedbacks: FeedbackItem[];
}

interface PostFeedbackResponse {
  success: boolean;
  message?: string;
}

/**
 * 사용자 피드백 데이터를 서버로 전송하는 API 함수
 * @param feedbacks - 피드백 데이터 배열
 * @returns Promise<PostFeedbackResponse>
 */
export const postFeedbackContent = async (
  feedbacks: FeedbackItem[],
): Promise<PostFeedbackResponse> => {
  try {
    const requestData: PostFeedbackRequest = {
      feedbacks,
    };

    const response = await axiosInstance.post(
      '/api/recommend/feedback',
      requestData,
    );

    return {
      success: true,
      message: response.data?.message || '피드백이 성공적으로 전송되었습니다.',
    };
  } catch (error: unknown) {
    console.error('피드백 전송 실패:', error);

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : '피드백 전송 중 오류가 발생했습니다.',
    };
  }
};
