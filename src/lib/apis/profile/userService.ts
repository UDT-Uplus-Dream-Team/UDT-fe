import { UserInfo } from '@type/UserInfo';
import axios from 'axios';

// 실제 API 엔드포인트 설정
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

//
export const getUserInfo = async (): Promise<UserInfo> => {
  // TODO: axiosInstance 객체를 따로 만들 경우, 여기 수정 예정
  const response = await axios.get(`${API_BASE_URL}/api/users/me`, {
    withCredentials: true, // 인증 필요 시 (쿠키 포함 등)
  });
  return response.data;
};
