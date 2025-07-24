import { useEffect, useRef } from 'react';
import { QueryObserverResult } from '@tanstack/react-query';
import { showSimpleToast } from '@components/common/Toast';
import { AxiosError } from 'axios';

// 타입가드 함수 사용
function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as AxiosError).isAxiosError === true
  );
}

// 단일 쿼리에 대해 에러 토스트를 띄울지의 여부를 결정하는 useQueryErrorToast 훅 (tanstack query의 에러 핸들링에서 용이함을 위함)
export function useQueryErrorToast<TData = unknown, TError = AxiosError>(
  query: QueryObserverResult<TData, TError>,
  customMsg?: string,
) {
  const toastShown = useRef(false); // 토스트 띄운 상태 추적 (중복 발생 방지)

  useEffect(() => {
    if (query.isError && query.error && !toastShown.current) {
      toastShown.current = true;

      // 안전하게 AxiosError만 status, response 접근
      let statusCode: number | undefined = undefined;
      let errorMsg: string = '';

      if (isAxiosError(query.error)) {
        statusCode = query.error.response?.status;
      }

      // 각 상황에 따라서 분기 처리 (커스텀 메시지 우선 사용, 없으면 status 값에 따라 메시지 설정)
      if (customMsg) {
        errorMsg = customMsg;
      } else {
        switch (statusCode) {
          case 400:
            errorMsg = '잘못된 요청입니다. Error Code: 400';
            break;
          case 401:
            errorMsg =
              '로그인이 만료되었습니다. 다시 로그인 해주세요. Error Code: 401';
            break;
          case 403:
            errorMsg = '권한이 없습니다. Error Code: 403';
            break;
          case 404:
            errorMsg = '존재하지 않는 리소스입니다. Error Code: 404';
            break;
          case 409:
            errorMsg = '중복된 요청입니다. Error Code: 409';
            break;
          case 500:
            errorMsg = '서버 오류가 발생했습니다. Error Code: 500';
            break;
          default:
            // 서버에서 내려주는 message 우선 사용, 없으면 기본 메시지
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

      toastShown.current = false; // 토스트 띄운 상태 초기화
    }
  }, [query.isError, query.error, customMsg]);
}
