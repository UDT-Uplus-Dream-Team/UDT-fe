import axios from 'axios';

// 실제 API 엔드포인트 설정
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

//[PATCH] /api/users/survey/genre 유저 선호 장르 수정
export const patchGenre = async (
  genres: string[],
): Promise<{ genres: string[] }> => {
  const response = await axios.patch(
    // TODO: axiosInstance 객체를 따로 만들 경우, 여기 수정 예정
    `${API_BASE_URL}/users/survey/genre`,
    { genres },
    { withCredentials: true },
  );
  return response.data;
};

//[PATCH] /api/users/survey/platform 사용자 구독 OTT 플랫폼 수정
export const patchPlatform = async (
  platforms: string[],
): Promise<{ platforms: string[] }> => {
  // TODO: axiosInstance 객체를 따로 만들 경우, 여기 수정 예정
  const response = await axios.patch(
    `${API_BASE_URL}/users/survey/platform`,
    { platforms },
    { withCredentials: true },
  );
  return response.data;
};
