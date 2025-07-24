import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';
import { showSimpleToast } from '@components/common/Toast';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10초 타임아웃
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

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

// 로그아웃 처리 함수
const handleLogout = () => {
  // 필요한 경우 store 클리어, 캐시 클리어 등
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
};

// 응답 인터셉터 설정
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // 401: 인증 만료, 재발급 시도 (다른 오류들 400, 500 등은 tanstack query에서의 onError에서 처리해야 함)
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const reissueSuccess = await reissueToken();

        if (reissueSuccess) {
          // 토큰 재발급 성공 시 원본 요청 재시도
          return axiosInstance(originalRequest);
        } else {
          // 토큰 재발급 실패 시 로그아웃 처리
          showSimpleToast.error({
            message:
              '로그인이 만료되었습니다. 다시 로그인 해주세요. Error Code: 401',
            position: 'top-center',
            className:
              'bg-red-500/70 text-white px-4 py-2 rounded-md mx-auto shadow-lg',
            duration: 2500,
          });
          handleLogout();
          return Promise.reject(error);
        }
      } catch (reissueError) {
        showSimpleToast.error({
          message: '인증 과정 중 문제가 발생했습니다. 로그아웃을 진행합니다.',
          duration: 2500,
        });
        console.log(reissueError);
        handleLogout();
        return Promise.reject(error);
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
