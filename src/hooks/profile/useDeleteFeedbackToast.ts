import {
  showSimpleToast,
  showInteractiveToast,
} from '@components/common/Toast';
import { useDeleteFeedback } from './useDeleteFeedback';

interface UseDeleteToastProps {
  selectedIds: number[];
  onDeleteComplete: () => void;
}

export const useDeleteFeedbackToast = ({
  selectedIds,
  onDeleteComplete,
}: UseDeleteToastProps) => {
  const { mutateAsync: deleteFeedbacks } = useDeleteFeedback();

  const handleDelete = () => {
    if (selectedIds.length === 0) {
      showSimpleToast.error({
        message: '삭제할 콘텐츠를 선택해주세요.',
        position: 'top-center',
        className: 'w-full bg-black/80 shadow-lg',
      });
      return;
    }

    showInteractiveToast.confirm({
      message: '정말 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
      position: 'top-center',
      className: 'w-[360px] bg-white shadow-lg',
      onConfirm: async () => {
        try {
          await Promise.all(selectedIds.map((id) => deleteFeedbacks(id)));
          showSimpleToast.success({ message: '삭제가 완료되었습니다.' });
          onDeleteComplete(); // 상태 초기화
        } catch {
          showSimpleToast.error({ message: '삭제 중 오류가 발생했습니다.' });
        }
      },
    });
  };

  return { handleDelete };
};
