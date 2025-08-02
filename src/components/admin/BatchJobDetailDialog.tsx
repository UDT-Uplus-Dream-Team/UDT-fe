import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@components/ui/dialog';
import { useQuery } from '@tanstack/react-query';

interface JobDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: number | null; // 실제 logId 타입에 맞게
}

// 배치 작업의 특정 job에 대한 상세 로그를 보여주는 모달 창
export function BatchJobDetailDialog({
  open,
  onOpenChange,
  jobId,
}: JobDetailDialogProps) {
  // TODO: 추후 목록 data 값들은 네트워크 통신으로 가져와야 함 (이거 customHook으로 따로 만들어야 할 듯)
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['job-detail', jobId],
    queryFn: async () => {
      if (!jobId) return null;
      // 실제 API 주소로 대체
      const res = await fetch(`/api/admin/batch-log/${jobId}`);
      if (!res.ok) throw new Error('서버 에러');
      return res.json();
    },
    enabled: open && !!jobId, // Dialog가 열려있고 logId가 있을 때만 fetch
    refetchOnWindowFocus: false,
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Job 상세 로그</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex items-center gap-2 text-gray-500">
            불러오는 중...
          </div>
        ) : isError ? (
          <div className="text-red-500">에러 발생: {error?.message}</div>
        ) : data ? (
          <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
            {data.logText || '로그 데이터가 없습니다.'}
          </pre>
        ) : (
          <div className="text-gray-400">로그 데이터가 없습니다.</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
