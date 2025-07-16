import { getContentList } from '@lib/apis/admin/getContentList';
import {
  AdminContentListParams,
  AdminContentListResponse,
} from '@type/admin/Content';
import { useQuery } from '@tanstack/react-query';

// 관리자 콘텐츠 목록을 불러오는 훅
export const useAdminContentList = (params?: AdminContentListParams) => {
  return useQuery<AdminContentListResponse>({
    queryKey: ['adminContentList', params],
    queryFn: () => getContentList(params),
    placeholderData: (previousData) => previousData, // 이전 데이터를 임시로 보여줌
  });
};
