// src/hooks/useLogoutHandler.ts
import { useRouter } from 'next/navigation';
import { authService } from '@/lib/apis/authService';
import {
  showSimpleToast,
  showInteractiveToast,
} from '@components/common/Toast';

export const useLogoutHandler = () => {
  const router = useRouter();

  const handleLogout = () => {
    showInteractiveToast.confirm({
      message: '정말 로그아웃 하시겠습니까?',
      confirmText: '로그아웃',
      cancelText: '취소',
      position: 'top-center',
      className: 'w-[360px] bg-white shadow-lg',
      onConfirm: async () => {
        try {
          await authService.logout();
          localStorage.clear();
          sessionStorage.clear();

          showSimpleToast.success({
            message: '로그아웃 되었습니다.',
            position: 'top-center',
            className: 'w-full bg-black/80 shadow-lg text-white',
          });

          // 메인 페이지로 이동
          router.push('/');
        } catch (error) {
          console.error('로그아웃 실패:', error);
          showSimpleToast.error({
            message: '로그아웃에 실패했습니다.',
            position: 'top-center',
            className: 'w-full bg-black/80 shadow-lg text-white',
          });
        }
      },
    });
  };

  return { handleLogout };
};
