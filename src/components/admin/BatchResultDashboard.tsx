import { BatchTopCardLayout } from '@components/admin/BatchTopCardLayout';
import { BatchResultDashboardTable } from './BatchResultDashboardTable';
import { FailedJobsTable } from './FailedJobsTable';

export function BatchResultDashboard() {
  return (
    <div className="space-y-6">
      {/* 상단의 카드 레이아웃(요청 대기열 관련 수치 정보 표시) */}
      <BatchTopCardLayout title="배치 결과 전체 현황" />

      {/* 각 배치 ID에 대한 결과를 보여주는 테이블 */}
      <BatchResultDashboardTable />

      {/* 실패한 배치 job 목록을 보여주는 테이블 */}
      <FailedJobsTable />
    </div>
  );
}
