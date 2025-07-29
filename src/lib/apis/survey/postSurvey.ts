import axiosInstance from '@lib/apis/axiosInstance';
import type { PostSurveyRequest } from '@type/survey/Survey';

export const postSurvey = async (data: PostSurveyRequest) => {
  const response = await axiosInstance.post('/api/survey', data);

  const isNewUser = response.headers['x-new-user'];
  if (isNewUser === 'true') {
    document.cookie = 'isNewUser=true; path=/; max-age=86400; SameSite=Lax';
  }

  return response.data;
};
