import {
  showSimpleToast,
  showInteractiveToast,
} from '@components/common/Toast';
import { useRef } from 'react';

interface UseDeleteToastProps {
  selectedIds: number[];
  onDeleteComplete: () => void;
  // 현재 엄선된 삭제의 경우 배열
  deleteFn: (ids: number[]) => Promise<unknown>;
}

export const useDeleteToast = ({
  selectedIds,
  onDeleteComplete,
  deleteFn,
}: UseDeleteToastProps) => {
  const isToastOpen = useRef(false);

  const handleDelete = () => {
    if (isToastOpen.current) return;

    if (selectedIds.length === 0) {
      showSimpleToast.error({
        message: '삭제할 콘텐츠를 선택해주세요.',
        position: 'top-center',
        className:
          'bg-black/80 text-white px-4 py-2 rounded-md mx-auto shadow-lg',
      });
      return;
    }

    isToastOpen.current = true;

    showInteractiveToast.confirm({
      message: '정말 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
      position: 'top-center',
      className: 'bg-white shadow-lg',
      onConfirm: async () => {
        try {
          await deleteFn(selectedIds);

          showSimpleToast.success({
            message: '삭제가 완료되었습니다.',
            position: 'top-center',
            className:
              'bg-primary-300/80 text-white px-4 py-2 rounded-md mx-auto shadow-lg',
          });
          onDeleteComplete(); // 상태 초기화
        } catch {
          showSimpleToast.error({
            message: '삭제 중 오류가 발생했습니다.',
            position: 'top-center',
            className:
              'bg-black text-white px-4 py-2 rounded-md mx-auto shadow-lg',
          });
        } finally {
          isToastOpen.current = false;
        }
      },
      onCancel: () => {
        isToastOpen.current = false;
      },
    });
  };

  return { handleDelete };
};
