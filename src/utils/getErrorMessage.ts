import { AxiosError } from 'axios';

// error status code별 메시지 매핑 함수
export function getErrorMessage(error: AxiosError) {
  const statusCode = error.response?.status;
  switch (statusCode) {
    case 400:
      return '잘못된 요청입니다.';
    case 401:
      return '로그인이 만료되었습니다. 다시 로그인 해주세요.';
    case 403:
      return '권한이 없습니다.';
    case 404:
      return '존재하지 않는 리소스입니다.';
    case 409:
      return '중복된 요청입니다.';
    case 500:
      return '서버 오류가 발생했습니다. 운영팀에 문의 바랍니다.';
    default:
      // 서버에서 내려준 message가 있으면 우선 사용
      return error.message || '예상치 못한 오류가 발생했습니다.';
  }
}
