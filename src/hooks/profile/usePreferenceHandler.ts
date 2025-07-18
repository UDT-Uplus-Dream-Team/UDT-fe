import { usePatchPlatform } from './usePatchPlatform';
import { usePatchGenre } from './usePatchGenre';
import {
  showSimpleToast,
  showInteractiveToast,
} from '@components/common/Toast';

/**
 * 사용자 선호 OTT 및 장르 설정 저장 핸들러 훅
 * - 변경값 유효성 검증
 * - 변경사항 Patch API 호출
 * - 성공/실패 토스트 처리
 */
export const usePreferenceHandler = (
  selectedOtt: string[],
  selectedGenres: string[],
) => {
  // API 호출 훅
  const { mutateAsync: patchPlatformsAsync } = usePatchPlatform();
  const { mutateAsync: patchGenresAsync } = usePatchGenre();

  // 변경할 항목이 있는지 확인
  const validateSelections = () => {
    return selectedOtt.length > 0 || selectedGenres.length > 0;
  };

  // 성공 토스트 출력
  const showSuccess = (message: string) => {
    showSimpleToast.success({
      message,
      position: 'top-center',
      className: 'w-full bg-black/80 shadow-lg text-white',
    });
  };

  // 에러 토스트 출력
  const showError = (message: string) => {
    showSimpleToast.error({
      message,
      position: 'top-center',
      className: 'w-full bg-black/80 shadow-lg text-white',
    });
  };

  // 실제 업데이트 실행
  const updatePreferences = async () => {
    try {
      const tasks: Promise<unknown>[] = [];

      if (selectedOtt.length > 0) {
        tasks.push(patchPlatformsAsync(selectedOtt));
      }

      if (selectedGenres.length > 0) {
        tasks.push(patchGenresAsync(selectedGenres));
      }

      await Promise.all(tasks);

      showSuccess('설정이 성공적으로 변경되었습니다!');
    } catch (error) {
      console.error('Update failed:', error);
      showError('일부 항목 저장에 실패했습니다.');
    }
  };

  // 저장 버튼 클릭 시 호출될 메인 핸들러
  const handleSave = () => {
    if (!validateSelections()) {
      showError('변경할 항목을 선택해주세요.');
      return;
    }

    // 사용자 확인 후 업데이트 실행
    showInteractiveToast.confirm({
      message: '정말 변경하시겠습니까?',
      confirmText: '변경',
      cancelText: '취소',
      position: 'top-center',
      className: 'w-[360px] bg-white shadow-lg',
      onConfirm: updatePreferences,
    });
  };

  return { handleSave };
};
