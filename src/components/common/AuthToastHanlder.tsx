'use client';

import { useEffect } from 'react';
import { showSimpleToast } from '@components/common/Toast';

function decodeMessage(encodedMessage: string): string {
  try {
    return Buffer.from(encodedMessage, 'base64').toString('utf-8');
  } catch {
    return encodedMessage;
  }
}

export function AuthToastHandler() {
  useEffect(() => {
    const checkAndShowAuthMessage = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const authMessage = urlParams.get('auth_msg');
      const encodedText = urlParams.get('auth_text');

      console.log('🔍 URL params:', { authMessage, encodedText });

      if (authMessage && encodedText) {
        const authMessageText = decodeMessage(encodedText);
        console.log('🎯 Decoded message:', authMessageText);

        // URL에서 파라미터 제거 (히스토리에 남지 않게)
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('auth_msg');
        newUrl.searchParams.delete('auth_text');
        window.history.replaceState({}, '', newUrl.toString());

        switch (authMessage) {
          case 'auth-expired':
            console.log('🚨 Showing auth-expired toast');
            showSimpleToast.error({
              message: authMessageText,
              duration: 5000,
              className: 'bg-destructive text-white shadow-lg',
            });
            break;

          case 'auth-required':
            console.log('ℹ️ Showing auth-required toast');
            showSimpleToast.error({
              message: authMessageText,
              duration: 4000,
              className: 'bg-destructive text-white shadow-lg',
            });
            break;

          case 'access-denied':
            console.log('⚠️ Showing access-denied toast');
            showSimpleToast.error({
              message: authMessageText,
              duration: 4000,
              className: 'bg-destructive text-white shadow-lg',
            });
            break;
        }
      }
    };

    // 페이지 로드 시 실행
    checkAndShowAuthMessage();
  }, []);

  return null;
}
