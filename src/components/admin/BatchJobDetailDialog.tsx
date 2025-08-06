import { useGetJobDetail } from '@/hooks/admin/useGetJobDetail';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';

interface JobDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: number; // 실제 logId 타입에 맞게
  jobType: string;
}

// 배치 작업의 특정 job에 대한 상세 로그를 보여주는 모달 창
export function BatchJobDetailDialog({
  open,
  onOpenChange,
  jobId,
  jobType,
}: JobDetailDialogProps) {
  const jobDetailQuery = useGetJobDetail(jobId, jobType); // 배치 결과 상세보기 훅

  // 에러 토스트 띄우기
  useQueryErrorToast(
    jobDetailQuery,
    '배치 결과 상세보기 중 오류가 발생했습니다.',
  );

  const { data, status } = jobDetailQuery;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Job 상세 로그</DialogTitle>
        </DialogHeader>
        {status === 'pending' ? (
          <div className="flex flex-col justify-items-center gap-2 text-gray-400 text-xs h-[300px]">
            불러오는 중...
          </div>
        ) : status === 'error' ? (
          <div className="text-red-500 text-xs h-[300px]">
            에러 발생: {jobDetailQuery.error?.message}
          </div>
        ) : data ? (
          <div className="bg-gray-900 text-white rounded-lg p-4 text-xs font-mono h-[300px] overflow-auto">
            <pre className="whitespace-pre-wrap">
              {data || '로그 데이터가 없습니다.'}
            </pre>
          </div>
        ) : (
          <div className="text-gray-400 text-xs">로그 데이터가 없습니다.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
