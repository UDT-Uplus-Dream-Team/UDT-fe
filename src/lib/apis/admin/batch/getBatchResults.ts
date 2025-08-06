import axiosInstance from '@lib/apis/axiosInstance';
import { BatchResult } from '@type/admin/batch';

interface BatchResultsApiResponse {
  item: BatchResult[];
  hasNext: boolean;
  nextCursor: string | null;
}

// 배치 결과 목록 조회 API
export const getBatchResults = async ({
  cursor,
  size,
}: {
  cursor: string | null;
  size: number;
}): Promise<{
  results: BatchResult[];
  nextCursor: string | null; // 다음 페이지 커서 (null이면 끝)
}> => {
  const { data } = await axiosInstance.get<BatchResultsApiResponse>(
    '/api/admin/batch/results',
    {
      params: {
        cursor,
        size,
      },
    },
  );
  return {
    results: data.item,
    nextCursor: data.hasNext ? data.nextCursor : null, // hasNext가 true면 nextCursor 반환, false면 null 반환
  };
};
