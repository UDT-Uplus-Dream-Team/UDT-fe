import { postSurvey } from '@lib/apis/survey/postSurvey';
import { PostSurveyRequest } from '@type/survey/Survey';
import { useMutation } from '@tanstack/react-query';

export const usePostSurvey = () => {
  return useMutation({
    mutationFn: (data: PostSurveyRequest) => postSurvey(data),
  });
};
