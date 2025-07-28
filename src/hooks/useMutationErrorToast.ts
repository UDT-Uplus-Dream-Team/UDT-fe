import { useEffect, useRef } from 'react';
import { UseMutationResult } from '@tanstack/react-query';
import { showSimpleToast } from '@components/common/Toast';
import { AxiosError } from 'axios';
import { handleLogout } from '@lib/handleLogout';

function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}

function isAuthReissueError(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.message === '토큰 재발급 실패' ||
      error.message === '토큰 재발급 중 예상치 못한 오류 발생')
  );
}

// Mutation 객체 관련해서 에러 토스트를 띄우기 위한 useMutationErrorToast 훅 (tanstack query의 에러 핸들링에서 용이함을 위함)
export function useMutationErrorToast<
  TData = unknown,
  TError = AxiosError,
  TVariables = void,
>(mutation: UseMutationResult<TData, TError, TVariables>, customMsg?: string) {
  const toastShown = useRef(false);

  useEffect(() => {
    const isFinalFailure =
      mutation.isError &&
      !mutation.isPending && // 실행 중이 아님 = 마지막 실패 후 처리
      mutation.error &&
      !toastShown.current;

    if (!isFinalFailure) return;

    toastShown.current = true;

    if (isAuthReissueError(mutation.error)) {
      handleLogout();
      return;
    }

    let statusCode: number | undefined;
    let errorMsg = '';

    if (isAxiosError(mutation.error)) {
      statusCode = mutation.error.response?.status;
    }

    if (customMsg) {
      errorMsg = customMsg;
    } else {
      switch (statusCode) {
        case 400:
          errorMsg = '잘못된 요청입니다.';
          break;
        case 401:
          errorMsg = '로그인이 만료되었습니다. 다시 로그인 해주세요.';
          break;
        case 403:
          errorMsg = '권한이 없습니다.';
          break;
        case 404:
          errorMsg = '존재하지 않는 리소스입니다.';
          break;
        case 409:
          errorMsg = '중복된 요청입니다.';
          break;
        case 500:
          errorMsg = '서버 오류가 발생했습니다. 운영팀에 문의 바랍니다.';
          break;
        default:
          errorMsg = '예상치 못한 오류가 발생했습니다.';
      }
    }

    showSimpleToast.error({
      message: errorMsg,
      position: 'top-center',
      className:
        'bg-red-500/70 text-white px-4 py-2 rounded-md mx-auto shadow-lg',
      duration: 2500,
    });

    setTimeout(() => {
      toastShown.current = false;
    }, 2500);
  }, [mutation.isError, mutation.error, mutation.isPending, customMsg]);
}
