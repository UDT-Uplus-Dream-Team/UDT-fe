import { useQuery } from '@tanstack/react-query';
import { getJobDetail } from '@lib/apis/admin/batch/getJobDetail';

// Query key에는 jobId, jobType을 모두 포함
export const useGetJobDetail = (jobId: number, jobType: string) => {
  return useQuery<string>({
    queryKey: ['batchJobDetail', jobId, jobType],
    queryFn: () => getJobDetail(jobId, jobType),
    retry: 2, // 2번 재시도
  });
};
