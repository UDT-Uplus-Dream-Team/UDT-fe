import { postCuratedContent } from '@lib/apis/recommend/postCuratedContents';
import { useMutation } from '@tanstack/react-query';
import { showSimpleToast } from '@/components/common/Toast';

interface UsePostFeedbackContentOptions {
  onSuccessCallback?: () => void;
  onErrorCallback?: (error: Error) => void;
  showToast?: boolean; // Toast 표시 여부 (기본값: true)

  onOptimisticUpdate?: (contentId: number) => void; // 즉시 UI 업데이트
  onOptimisticRevert?: (contentId: number) => void;
}

export const usePostCuratedContent = (
  options?: UsePostFeedbackContentOptions,
) => {
  const { showToast = true } = options || {};

  return useMutation({
    mutationFn: async (contentId: number) => {
      const result = await postCuratedContent(contentId);
      if (!result.success) {
        throw new Error(result.message || '저장에 실패했습니다.');
      }

      return result;
    },

    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    onMutate: (contentId: number) => {
      options?.onOptimisticUpdate?.(contentId);
    },

    onSuccess: () => {
      if (showToast) {
        showSimpleToast.success({
          message: '컨텐츠가 성공적으로 저장되었습니다.',
          duration: 3000,
          position: 'top-center',
          className: 'bg-success text-white',
        });
      }
    },
    onError: (error: Error, contentId: number) => {
      console.error('컨텐츠 저장 실패:', error.message);

      options?.onOptimisticRevert?.(contentId);
      const isAlreadyExists = error.message.includes('이미 저장된');
      const errorMessage = isAlreadyExists
        ? '이미 저장된 콘텐츠입니다.'
        : '저장에 실패하였습니다.';
      // Toast 표시
      if (showToast) {
        showSimpleToast.error({
          message: errorMessage,
          duration: 4000,
          position: 'top-center',
          className: 'bg-destructive text-white',
        });
      }
    },
  });
};
