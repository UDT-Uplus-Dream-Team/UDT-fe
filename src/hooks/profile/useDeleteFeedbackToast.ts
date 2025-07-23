import {
  showSimpleToast,
  showInteractiveToast,
} from '@components/common/Toast';

interface UseDeleteToastProps {
  selectedIds: number[];
  onDeleteComplete: () => void;
  // 현재 엄선된 삭제의 경우 배열 / 피드백의 경우 단일처리임(해당 부분의 경우 수정 될 예정) 이에 맞게 분기처리 후 나중에 수정
  deleteFn:
    | ((ids: number[]) => Promise<unknown>)
    | ((id: number) => Promise<unknown>);
  isBatch?: boolean; //배열인지 안닌지 확인
}

export const useDeleteFeedbackToast = ({
  selectedIds,
  onDeleteComplete,
  deleteFn,
  isBatch = false,
}: UseDeleteToastProps) => {
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
          if (isBatch) {
            //  배열 기반 API
            await (deleteFn as (ids: number[]) => Promise<unknown>)(
              selectedIds,
            );
          } else {
            //  단일 기반 API (Promise.all)
            await Promise.all(
              selectedIds.map((id) =>
                (deleteFn as (id: number) => Promise<unknown>)(id),
              ),
            );
          }

          showSimpleToast.success({
            message: '삭제가 완료되었습니다.',
            position: 'top-center',
            className: 'w-full text-white bg-black',
          });
          onDeleteComplete(); // 상태 초기화
        } catch {
          showSimpleToast.error({
            message: '삭제 중 오류가 발생했습니다.',
            position: 'top-center',
            className: 'w-full text-white bg-black',
          });
        }
      },
    });
  };

  return { handleDelete };
};
