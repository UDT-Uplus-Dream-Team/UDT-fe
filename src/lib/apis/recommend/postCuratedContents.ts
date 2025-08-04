import axiosInstance from '@lib/apis/axiosInstance';

export const postCuratedContent = async (contentId: number): Promise<void> => {
  await axiosInstance.post('/api/v1/contents/recommendations/contents', {
    contentId,
  });
};
