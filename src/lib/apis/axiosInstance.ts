import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초 타임아웃
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 재발급 중 중복 호출 방지
let isReissueTokenInProgress = false;

// 토큰 재발급 로직
const reissueToken = async (): Promise<boolean> => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/reissue/token`,
      {},
      { withCredentials: true },
    );
    return response.status === 204;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // 각 오류에 대해서 사용자 UI(Toast 등) 처리는 각 api 함수,
    // TanStack Query를 사용한 경우엔 useQueryErrorToast 훅에서 처리해야 함
    if (
      error.response?.status === 401 && // 401: 인증 만료, 재발급 시도
      originalRequest &&
      !originalRequest._retry &&
      !isReissueTokenInProgress // 토큰 재발급 중 중복 호출 방지
    ) {
      originalRequest._retry = true;
      isReissueTokenInProgress = true;

      try {
        const reissueSuccess = await reissueToken();

        if (reissueSuccess) {
          isReissueTokenInProgress = false; // 토큰 재발급 완료 후 중복 호출 방지 해제
          return axiosInstance(originalRequest); // 재요청
        } else {
          // 토큰 재발급 실패 시 에러 발생
          throw new Error('토큰 재발급 실패');
        }
      } catch (reissueError) {
        isReissueTokenInProgress = false; // 토큰 재발급 중 중복 호출 방지 해제
        console.error('[Token Reissue Fatal]', reissueError);
        throw new Error('토큰 재발급 중 예상치 못한 오류 발생');
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;

// 타입 확장 (재시도 플래그)
declare module 'axios' {
  interface AxiosRequestConfig {
    _retry?: boolean;
  }
}
