import {
  FeedbackQueryParams,
  GetFeedbackContentsResponse,
} from '@type/profile/FeedbackContent';
import axiosInstance from '../axiosInstance';

// [GET] /api/users/me/feedbacks → 좋아요/싫어요 피드백 콘텐츠 조회
export const getFeedbackContents = async (
  params: FeedbackQueryParams,
): Promise<GetFeedbackContentsResponse> => {
  const response = await axiosInstance.get('/api/users/me/feedbacks', {
    params,
  });
  return response.data;
};

//[DELETE] - 현재 api 이름 모름 임의 작성
export const deleteFeedback = async (feedbackId: number[]): Promise<void> => {
  await axiosInstance.delete(`/api/users/me/feedbacks/bulk`, {
    data: { feedbackId },
  });
};
