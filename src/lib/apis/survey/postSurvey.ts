import axiosInstance from '@lib/apis/axiosInstance';
import type { PostSurveyRequest } from '@type/survey/Survey';

export const postSurvey = async (data: PostSurveyRequest) => {
  const response = await axiosInstance.post('/api/survey', data);
  return response.data;
};
