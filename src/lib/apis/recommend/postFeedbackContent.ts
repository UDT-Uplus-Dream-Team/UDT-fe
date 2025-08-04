import axiosInstance from '@lib/apis/axiosInstance';

interface FeedbackItem {
  contentId: number;
  feedback: string; // "LIKE" | "DISLIKE" | "UNINTERESTED"
}

interface PostFeedbackRequest {
  feedbacks: FeedbackItem[];
}

export const postFeedbackContent = async (
  feedbacks: FeedbackItem[],
): Promise<void> => {
  const requestData: PostFeedbackRequest = {
    feedbacks,
  };

  await axiosInstance.post('/api/recommend/contents/feedbacks', requestData);
};
