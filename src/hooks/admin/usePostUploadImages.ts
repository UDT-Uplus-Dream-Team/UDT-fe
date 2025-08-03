import { useMutation } from '@tanstack/react-query';
import { postUploadImages } from '@lib/apis/admin/postUploadImages';
import { showSimpleToast } from '@components/common/Toast';

export const usePostUploadImages = () => {
  return useMutation({
    mutationFn: postUploadImages,
    onSuccess: () => {
      showSimpleToast.success({
        message: '이미지가 성공적으로 업로드되었습니다.',
        position: 'top-center',
      });
    },
    onError: () => {
      showSimpleToast.error({
        message: '이미지 업로드에 실패했습니다.',
        position: 'top-center',
      });
    },
  });
};
