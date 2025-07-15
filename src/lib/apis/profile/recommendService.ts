import axios from 'axios';
import { RecommendedContent } from '@type/mypage/RecommendedContent';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

// [GET] /api/users/me/curated/contents 사용자의 큐레이션 콘텐츠 목록 조회

export const getCuratedContents = async (): Promise<RecommendedContent[]> => {
  const response = await axios.get<{ contents: RecommendedContent[] }>(
    `${API_BASE_URL}/users/me/curated/contents`,
    { withCredentials: true },
  );
  return response.data.contents;
};
