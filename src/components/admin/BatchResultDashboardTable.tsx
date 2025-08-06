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
import { useEffect, useMemo, useRef, useState } from 'react';
import { JobTypeDropdown } from '@components/admin/JobTypeDropDown';

// 각 batch ID에 대해 배치 결과를 보여주는 테이블
export function BatchResultDashboardTable() {
  const [filterJobType, setFilterJobType] = useState<string>('전체'); // 선택된 "필터링" 옵션

  // 커스텀 훅으로 데이터 fetch
  const batchResultsQuery = useBatchResults();
  const { data, status, fetchNextPage, hasNextPage, isFetchingNextPage } =
    batchResultsQuery;
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const resultArray = useMemo(() => {
    return data?.pages.flatMap((page) => page.results) ?? [];
  }, [data]);

  // 에러 토스트 메시지 표시를 위한 custom Hook
  useQueryErrorToast(batchResultsQuery);

  useEffect(() => {
    if (!loadMoreRef.current) return;
    // 이전 observer 해제
    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 1.0, // 완전히 보여질 때 트리거 (0.5~1.0 추천)
      },
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => observerRef.current?.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const jobTypeOptions = ['전체', 'REGISTER', 'UPDATE', 'DELETE']; // 필터링 옵션들

  // 필터링 된 요청 목록 반환
  const filteredResults = useMemo(() => {
    return data?.pages
      .flatMap((page) => page.results)
      .filter((req) => {
        const typePass = filterJobType === '전체' || req.type === filterJobType;
        const statusPass =
          filterJobType === '전체' || req.status === filterJobType; // 선택된 상태와 일치하는 요청만 필터링
        return typePass && statusPass;
      });
  }, [filterJobType, data]);

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
    if (resultArray.length === 0) {
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
            <TableHead>무효화 데이터 갯수</TableHead>
            <TableHead>실패 데이터 갯수</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredResults?.map((result) => (
            <TableRow key={`${result.resultId}-${result.type}`}>
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
              <TableCell>{result.totalCompleted}</TableCell>
              <TableCell>{result.totalInvalid}</TableCell>
              <TableCell>{result.totalFailed}</TableCell>
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">배치별 실행 결과</CardTitle>
          {/* 요청 타입 필터링 드롭다운 */}
          <JobTypeDropdown
            options={jobTypeOptions}
            value={filterJobType}
            onChange={setFilterJobType}
          />
        </div>
      </CardHeader>
      <CardContent>
        {renderContent()}
        {/* 무한 스크롤 트리거용 요소 */}
        <div ref={loadMoreRef} className="h-4" />
      </CardContent>
    </Card>
  );
}
