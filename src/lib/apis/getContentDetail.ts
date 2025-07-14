import axios from 'axios';
import { ContentDetail } from '@type/ContentDetail';

// 콘텐츠 상세 정보 가져오는 api 함수
export const getContentDetail = async (
  contentId: string,
): Promise<ContentDetail> => {
  // TODO: axiosInstance 객체를 따로 만들 경우, 여기 수정 예정
  const response = await axios.get(`/api/contents/${contentId}`);

  const data = response.data;

  // TODO: 정확한 api response body를 보고, 해당 내용을 수정해야 할 듯
  // 변환: isAvailable이 문자열로 오는 경우 boolean으로 변환
  // data.platforms = data.platforms.map((p: ContentPlatform) => ({
  //   ...p,
  //   isAvailable: p.isAvailable === 'true',
  // }));

  // // 변환: genres가 문자열로 오면 쉼표 기준으로 나눔
  // data.categories = data.categories.map((category: ContentCategory) => ({
  //   ...category,
  //   genres:
  //     typeof category.genres === 'string'
  //       ? category.genres.split(',')
  //       : category.genres,
  // }));

  return data;
};
