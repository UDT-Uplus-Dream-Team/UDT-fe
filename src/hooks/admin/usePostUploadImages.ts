import { useMutation } from '@tanstack/react-query';
import { postUploadImages } from '@lib/apis/admin/postUploadImages';
import { showSimpleToast } from '@components/common/Toast';

export const usePostUploadImages = () => {
  return useMutation({
    mutationFn: postUploadImages,
    onError: () => {
      showSimpleToast.error({ message: '이미지 업로드에 실패했습니다.' });
    },
  });
};
