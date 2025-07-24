import axiosInstance from '@lib/apis/axiosInstance';
import { DetailedContentData } from '@type/explore/Explore';

// 특정 content ID에 대한 상세 정보 조회 API 호출 함수
export const getContentDetails = async (
  contentId: number,
): Promise<DetailedContentData> => {
  // axiosInstance를 사용하여 특정 contentId에 해당되는 상세 정보 조회 API 호출
  const res = await axiosInstance.get(`/api/contents/${contentId}`);
  console.log('뭘 갖고 왔는데?: ', res);
  return res.data;
};
