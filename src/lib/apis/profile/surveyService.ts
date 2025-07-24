import axiosInstance from '../axiosInstance';

//[PATCH] /api/users/survey/genre 유저 선호 장르 수정
export const patchGenre = async (
  genres: string[],
): Promise<{ genres: string[] }> => {
  const response = await axiosInstance.patch('/api/users/survey/genre', {
    genres,
  });
  return response.data;
};

//[PATCH] /api/users/survey/platform 사용자 구독 OTT 플랫폼 수정
export const patchPlatform = async (
  platforms: string[],
): Promise<{ platforms: string[] }> => {
  const response = await axiosInstance.patch('/api/users/survey/platform', {
    platforms,
  });
  return response.data;
};
