import {
  FeedbackQueryParams,
  GetFeedbackContentsResponse,
} from '@type/profile/RecommendedContent';
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

export const deleteFeedback = async (feedbackId: number): Promise<void> => {
  await axiosInstance.delete(`/api/users/me/feedbacks/${feedbackId}`, {});
};
