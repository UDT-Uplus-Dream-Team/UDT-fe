import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table';
import { Badge } from '@components/ui/badge';
import { getRequestTypeConfigInBatchResult } from '@utils/getRequestTypeConfigInBatchResult';
import { useBatchResults } from '@hooks/admin/useGetBatchResults';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';

// 각 batch ID에 대해 배치 결과를 보여주는 테이블
export function BatchResultDashboardTable() {
  // 커스텀 훅으로 데이터 fetch
  const batchResultsQuery = useBatchResults();
  const { data, status } = batchResultsQuery;

  // 에러 토스트 메시지 표시를 위한 custom Hook
  useQueryErrorToast(batchResultsQuery);

  // 상태별 렌더링 함수 (분기 처리 필요해서.. 함수로 분리)
  const renderContent = () => {
    // 1. 로딩 상태 처리
    if (status === 'pending') {
      return (
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <span>로딩 중...</span>
        </div>
      );
    }

    // 2. 에러 상태 처리
    if (status === 'error') {
      return (
        <div className="flex items-center justify-center h-full min-h-[200px]">
          <span className="text-red-500">
            데이터를 불러오는 데 실패했습니다.
          </span>
        </div>
      );
    }

    // 3. 데이터 없음 (data가 배열일 경우 대응)
    const resultArray = Array.isArray(data) ? data : [];
    if (!resultArray.length) {
      return (
        <div className="flex items-center justify-center h-full min-h-[120px]">
          <span>데이터가 없습니다.</span>
        </div>
      );
    }

    // 4. 데이터 있음
    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>배치 ID</TableHead>
            <TableHead>요청 타입</TableHead>
            <TableHead>수행 시작 시간</TableHead>
            <TableHead>수행 완료 시간</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>총 데이터 갯수</TableHead>
            <TableHead>성공 데이터 갯수</TableHead>
            <TableHead>실패 데이터 갯수</TableHead>
            <TableHead>상세보기</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resultArray.map((result) => (
            <TableRow key={result.resultId}>
              <TableCell className="font-medium">{result.resultId}</TableCell>
              <TableCell>{result.type}</TableCell>
              <TableCell>{result.startTime ?? '-'}</TableCell>
              <TableCell>{result.endTime ?? '-'}</TableCell>
              <TableCell>
                <Badge
                  className={
                    getRequestTypeConfigInBatchResult(result.status).color
                  }
                >
                  {getRequestTypeConfigInBatchResult(result.status).label}
                </Badge>
              </TableCell>
              <TableCell>{result.totalRead}</TableCell>
              <TableCell>{result.totalWrite}</TableCell>
              <TableCell>{result.totalSkip}</TableCell>
              <TableCell>
                <button className="text-primary-500 hover:underline">
                  상세보기
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  // 4. 데이터가 있을 경우
  return (
    <Card className="h-full py-4 px-2">
      <CardHeader>
        <CardTitle className="text-lg font-bold">배치별 실행 결과</CardTitle>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
