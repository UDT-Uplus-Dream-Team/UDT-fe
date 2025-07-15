import axios from 'axios';
import { RecommendedContent } from '@type/mypage/RecommendedContent';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

// [GET] /api/users/me/feedbacks → 좋아요/싫어요 피드백 콘텐츠 조회
export const getFeedbackContents = async (): Promise<RecommendedContent[]> => {
  const response = await axios.get<{ contents: RecommendedContent[] }>(
    `${API_BASE_URL}/users/me/feedbacks`,
    { withCredentials: true },
  );
  return response.data.contents;
};

export const deleteFeedback = async (feedbackId: number): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/users/me/feedbacks/${feedbackId}`, {
    withCredentials: true,
  });
};
