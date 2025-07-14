// 탐색 페이지에서 사용할 api Client 함수들을 모두 모아 놓은 곳
import axios from 'axios'; // axios는 사용할 지 안할지 잘 모르겠음 (선택해야 함)
import {
  FetchExploreParams,
  FetchExploreResponse,
} from '@type/explore/Explore';

export const fetchExploreScrollContents = async (
  params: FetchExploreParams,
): Promise<FetchExploreResponse> => {
  const { data } = await axios.get<FetchExploreResponse>('/api/contents', {
    params,
  });
  return data;
};
