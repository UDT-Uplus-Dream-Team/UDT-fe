import { BatchRequestQueueTable } from '@components/admin/BatchRequestQueueTable';
import { BatchRequestQueueTopCardSection } from '@components/admin/BatchRequestQueueTopCardSection';

// 배치 처리를 위해 pending 중인 job 목록들을 보여주는 "배치 대기열" 페이지
export function BatchRequestQueueDashboard() {
  return (
    <div className="flex flex-col gap-6">
      {/* 상단 카드 레이아웃 (요청 대기열 관련 수치 정보 표시) */}
      <BatchRequestQueueTopCardSection />

      {/* 요청 목록 테이블 */}
      <BatchRequestQueueTable />
    </div>
  );
}
