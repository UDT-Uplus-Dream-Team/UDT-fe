import { useRef } from 'react';
import { showSimpleToast } from '@components/common/Toast';

export function useErrorToastOnce(duration = 1500) {
  const toastShown = useRef(false);

  const showErrorToast = (message: string) => {
    if (toastShown.current) return; // 이미 토스트가 떠 있다면 무시

    toastShown.current = true; // 토스트 띄우는 중

    showSimpleToast.error({
      message,
      position: 'top-center',
      className:
        'bg-red-500/70 text-white px-4 py-2 rounded-md mx-auto shadow-lg',
      duration,
    });

    setTimeout(() => {
      toastShown.current = false; // duration 후 다시 토스트 띄울 수 있도록 초기화
    }, duration);
  };

  return showErrorToast;
}
