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

  // 저장 버튼 클릭 시 호출
  const handleSave = (target: 'platform' | 'genre') => {
    const isPlatformValid = selectedOtt.length > 0;
    const isGenreValid = selectedGenres.length > 0;

    if (target === 'platform' && !isPlatformValid) {
      showError('변경할 OTT를 선택해주세요.');
      return;
    }

    if (target === 'genre' && !isGenreValid) {
      showError('변경할 장르를 선택해주세요.');
      return;
    }

    // 사용자 확인 후 업데이트 실행
    showInteractiveToast.confirm({
      message: '정말 변경하시겠습니까?',
      confirmText: '변경',
      cancelText: '취소',
      position: 'top-center',
      className: 'w-[360px] bg-white shadow-lg',
      onConfirm: async () => {
        try {
          if (target === 'platform') {
            console.log('[PATCH PLATFORM] 선택된 플랫폼:', selectedOtt);
            await patchPlatformsAsync(selectedOtt);
            showSuccess('OTT 설정이 저장되었습니다.');
          } else {
            console.log('[PATCH GENRE] 선택된 장르:', selectedGenres);
            await patchGenresAsync(selectedGenres);
            showSuccess('선호 장르가 저장되었습니다.');
          }
        } catch (error) {
          console.error(error);
          showError('설정 저장에 실패했습니다.');
        }
      },
    });
  };

  return { handleSave };
};
