import { BatchResultDashboardTable } from '@components/admin/BatchResultDashboardTable';
import { FailedJobsTable } from '@components/admin/FailedJobsTable';
import { BatchResultTopCardSection } from '@components/admin/BatchResultTopCardSection';
import { InvalidJobsTable } from './InvalidJobsTable';

// '배치 결과' 페이지
export function BatchResultDashboard() {
  return (
    <div className="space-y-6">
      {/* 상단의 카드 레이아웃(배치 결과 관련 수치 정보 표시) */}
      <BatchResultTopCardSection />

      {/* 각 배치 ID에 대한 결과를 보여주는 테이블 */}
      <BatchResultDashboardTable />

      {/* 실패한 배치 job 목록을 보여주는 테이블 */}
      <FailedJobsTable />

      {/* 무효화된 배치 job 목록을 보여주는 테이블 */}
      <InvalidJobsTable />
    </div>
  );
}
