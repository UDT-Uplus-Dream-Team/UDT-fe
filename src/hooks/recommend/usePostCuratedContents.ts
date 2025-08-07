import { postCuratedContent } from '@lib/apis/recommend/postCuratedContents';
import { useMutation } from '@tanstack/react-query';
import { showSimpleToast } from '@components/common/Toast';

interface UsePostCuratedContentOptions {
  onSuccessCallback?: () => void;
  onErrorCallback?: (error: Error) => void;
  showToast?: boolean; // Toast 표시 여부 (기본값: true)
  onOptimisticUpdate?: (contentId: number) => void; // 즉시 UI 업데이트
  onOptimisticRevert?: (contentId: number) => void;
}

export const usePostCuratedContent = (
  options?: UsePostCuratedContentOptions,
) => {
  const { showToast = true } = options || {};

  return useMutation({
    mutationFn: async (contentId: number) => {
      await postCuratedContent(contentId);
      return { contentId }; // 성공 시 contentId 반환
    },

    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

    onMutate: (contentId: number) => {
      options?.onOptimisticUpdate?.(contentId);
    },

    onSuccess: () => {
      options?.onSuccessCallback?.();

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
      options?.onOptimisticRevert?.(contentId);
      options?.onErrorCallback?.(error);

      // 에러 메시지 파싱
      const isAlreadyExists =
        error.message.includes('이미 저장된') ||
        error.message.includes('already exists') ||
        error.message.includes('409');

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
