'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { authService } from '@lib/apis/authService';

// 로그인 했을 때 콜백하는 페이지 (Survey 끝나고 오는 페이지)
export default function CallbackPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // GET /api/users/me 호출해서 사용자 정보 가져오기
        const userProfile = await authService.getCurrentUser();

        // TanStack Query 캐시에 업데이트
        queryClient.setQueryData(['userProfile'], userProfile);

        // 백엔드가 알아서 role 판단했으니 바로 메인으로
        router.push('/recommend');
      } catch (error) {
        console.error('사용자 정보 가져오기 실패:', error);
        // 실패시 로그인 페이지로
        router.push('/login');
      }
    };

    handleCallback();
  }, [router, queryClient]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>로그인 처리 중...</p>
      </div>
    </div>
  );
}
