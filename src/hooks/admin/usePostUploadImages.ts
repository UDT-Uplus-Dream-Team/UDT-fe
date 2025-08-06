import { useMutation } from '@tanstack/react-query';
import { postUploadImages } from '@lib/apis/admin/postUploadImages';

export const usePostUploadImages = () => {
  return useMutation({
    mutationFn: postUploadImages,
  });
};
