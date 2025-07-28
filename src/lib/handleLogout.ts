import { showSimpleToast } from '@components/common/Toast';

// 로그아웃 처리 함수
export function handleLogout() {
  showSimpleToast.error({
    message: '로그인이 만료되었습니다. 다시 로그인 해주세요.',
    position: 'top-center',
    className:
      'bg-red-500/70 text-white px-4 py-2 rounded-md mx-auto shadow-lg',
    duration: 2500,
  });

  // 필요 시 zustand 등 상태 초기화도 진행하면 좋겠네요
  setTimeout(() => {
    window.location.href = '/'; // 또는 router.replace('/login')
  }, 2500);
}
