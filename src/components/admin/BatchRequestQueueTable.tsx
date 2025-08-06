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
import { Button } from '@components/ui/button';
import { requestTypeConfigInBatchJobList } from '@type/admin/batch';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BatchJobDetailDialog } from '@components/admin/BatchJobDetailDialog';
import { useGetBatchJobList } from '@hooks/admin/useGetBatchJobList';
import { useQueryErrorToast } from '@hooks/useQueryErrorToast';
import { JobTypeDropdown } from './JobTypeDropDown';

// 배치 대기열에서 배치 목록을 보여주는 테이블
export function BatchRequestQueueTable() {
  const [filterJobType, setFilterJobType] = useState<string>('전체'); // 선택된 "필터링" 옵션
  const [selectedJobType, setSelectedJobType] = useState<string>('REGISTER');
  const [isDialogOpen, setIsDialogOpen] = useState(false); // 상세보기 모달 창 열기 위한 상태 관리
  const [selectedJobId, setSelectedJobId] = useState<number>(-1); // 상세보기 모달 창에 표시할 요청 정보 관리
  const observerRef = useRef<IntersectionObserver | null>(null); // 무한 스크롤 처리를 위한 Intersection Observer 설정
  const loadMoreRef = useRef<HTMLDivElement | null>(null); // 무한 스크롤 트리거용 요소 추적을 위한 ref

  const batchJobListQuery = useGetBatchJobList({ type: 'PENDING' }); // 배치 대기열 목록 조회 훅

  // 에러 토스트 띄우기
  useQueryErrorToast(
    batchJobListQuery,
    '배치 대기열 목록 조회 중 오류가 발생했습니다.',
  );

  // batchJobListQuery에서 제공하는 객체 가져오기
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    batchJobListQuery;

  // 무한 스크롤 처리
  useEffect(() => {
    if (!loadMoreRef.current) return;

    // 기존 observer 해제
    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    observerRef.current.observe(loadMoreRef.current);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const jobTypeOptions = ['전체', 'REGISTER', 'UPDATE', 'DELETE']; // 필터링 옵션들

  // 필터링 된 요청 목록 반환
  const filteredJobs = useMemo(() => {
    return data?.pages
      .flatMap((page) => page.item)
      .filter((req) => {
        const typePass =
          filterJobType === '전체' || req.jobType === filterJobType;
        const statusPass =
          filterJobType === '전체' || req.jobType === filterJobType; // 선택된 상태와 일치하는 요청만 필터링
        return typePass && statusPass;
      });
  }, [filterJobType, data]);

  // "상세보기" 버튼을 눌렀을 경우 모달 창 열기
  const handleDetailClick = (requestId: number, jobType: string) => {
    setIsDialogOpen(true);
    setSelectedJobId(requestId);
    setSelectedJobType(jobType);
  };

  return (
    // 요청 목록 테이블
    <Card className="max-h-[600px] flex flex-col py-4 px-2">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">배치 대기열 목록</CardTitle>
          {/* 요청 타입 필터링 드롭다운 */}
          <JobTypeDropdown
            options={jobTypeOptions}
            value={filterJobType}
            onChange={setFilterJobType}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-y-auto">
        {/* 1. 로딩 중 */}
        {status === 'pending' && (
          <div className="flex flex-1 justify-center items-center py-8 text-gray-400">
            불러오는 중입니다...
          </div>
        )}

        {/* 2. 에러 */}
        {status === 'error' && (
          <div className="flex flex-1 justify-center items-center py-8 text-red-500">
            데이터 조회 중 오류가 발생했습니다
            <Button
              size="sm"
              variant="outline"
              className="ml-4"
              onClick={() => batchJobListQuery.refetch()}
            >
              재시도
            </Button>
          </div>
        )}

        {/* 3. 빈 목록 (로딩/에러가 아닐 때만) */}
        {status === 'success' &&
          (!filteredJobs || filteredJobs.length === 0) && (
            <div className="flex flex-1 flex-col justify-center items-center py-8 text-gray-400">
              <span>조건에 맞는 배치 대기열이 없습니다.</span>
              {/* 필터 초기화하는 버튼 하나 추가 (필터가 전체가 아닐 때만) */}
              {filterJobType !== '전체' && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-2"
                    onClick={() => {
                      setFilterJobType('전체');
                    }}
                  >
                    필터 초기화
                  </Button>
                </>
              )}
            </div>
          )}

        {/* 4. 정상일 때 */}
        {status === 'success' && filteredJobs && filteredJobs.length > 0 && (
          <>
            <Table>
              <TableHeader>
                <TableRow className="sticky top-0 z-10 bg-white">
                  <TableHead>요청 ID</TableHead>
                  <TableHead>요청 타입</TableHead>
                  <TableHead>요청자</TableHead>
                  <TableHead>생성 시간</TableHead>
                  <TableHead>수행 예정 시간</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>상세보기</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs?.map((request) => {
                  return (
                    <TableRow key={`${request.id}-${request.jobType}`}>
                      <TableCell className="font-medium">
                        {request.id}
                      </TableCell>
                      <TableCell>{request.jobType}</TableCell>
                      <TableCell>{request.memberId}</TableCell>
                      <TableCell>{request.createdAt}</TableCell>
                      <TableCell>{request.scheduledAt}</TableCell>
                      <TableCell>
                        <Badge
                          className={`${
                            requestTypeConfigInBatchJobList[
                              request.status as keyof typeof requestTypeConfigInBatchJobList
                            ].color
                          }`}
                        >
                          {
                            requestTypeConfigInBatchJobList[
                              request.status as keyof typeof requestTypeConfigInBatchJobList
                            ].label
                          }
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          className="rounded-full w-16 h-full p-1 bg-gray-400 opacity-80 text-white cursor-pointer"
                          onClick={() =>
                            handleDetailClick(request.id, request.jobType)
                          }
                        >
                          상세보기
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            {/* 무한 스크롤 트리거용 요소 */}
            <div ref={loadMoreRef} className="h-4" />
          </>
        )}
      </CardContent>

      {isDialogOpen && (
        // 상세보기를 눌렀을 경우 모달 창 열기
        <BatchJobDetailDialog
          open={isDialogOpen}
          onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) {
              setSelectedJobId(-1);
              setSelectedJobType('전체');
            }
          }}
          jobId={selectedJobId}
          jobType={selectedJobType}
        />
      )}
    </Card>
  );
}
