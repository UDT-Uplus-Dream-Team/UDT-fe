import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
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
import {
  mockRequestsInBatchRequestQueue,
  requestTypeConfigInBatchRequestQueue,
} from '@type/admin/BatchPage';
import { Filter, ChevronDown, ChartLine } from 'lucide-react';
import { useState } from 'react';

// 배치 대기열에서 배치 목록을 보여주는 테이블
export function BatchRequestQueueTable() {
  // TODO: 추후 목록 data 값들은 네트워크 통신으로 가져와야 함
  const [selectedFilter, setSelectedFilter] = useState<string>('전체');
  const filterOptions = [
    '전체',
    '콘텐츠 등록',
    '콘텐츠 수정',
    '콘텐츠 삭제',
    '사용자 피드백',
  ]; // 필터링 옵션들

  const [selectedStatusFilter, setSelectedStatusFilter] = useState('전체');
  const statusFilterOptions = ['전체', '대기중', '취소됨'];
  return (
    // 요청 목록 테이블
    <Card className="h-[600px] flex flex-col py-4 px-2">
      <CardHeader className="flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">배치 대기열 목록</CardTitle>

          {/* 필터 드롭다운 */}
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 bg-transparent">
                  <Filter className="h-4 w-4" />
                  {selectedFilter}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {filterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setSelectedFilter(option)}
                    className={selectedFilter === option ? 'bg-accent' : ''}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {/* 상태 필터 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="gap-2 bg-transparent min-w-[100px]"
                >
                  <ChartLine className="h-4 w-4" />
                  {selectedStatusFilter}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {statusFilterOptions.map((option) => (
                  <DropdownMenuItem
                    key={option}
                    onClick={() => setSelectedStatusFilter(option)}
                    className={
                      selectedStatusFilter === option
                        ? 'bg-accent font-semibold'
                        : ''
                    }
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 overflow-y-auto">
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
              <TableHead>처리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockRequestsInBatchRequestQueue.map((request) => {
              return (
                <TableRow key={request.logId}>
                  <TableCell className="font-medium">{request.logId}</TableCell>
                  <TableCell>{request.title}</TableCell>
                  <TableCell>{request.memberName}</TableCell>
                  <TableCell>{request.generateTime}</TableCell>
                  <TableCell>{request.generateTime}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        requestTypeConfigInBatchRequestQueue[
                          request.status as keyof typeof requestTypeConfigInBatchRequestQueue
                        ].color
                      }`}
                    >
                      {
                        requestTypeConfigInBatchRequestQueue[
                          request.status as keyof typeof requestTypeConfigInBatchRequestQueue
                        ].label
                      }
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className="rounded-full w-16 h-full p-1 bg-gray-400 opacity-80 text-white cursor-pointer"
                    >
                      상세보기
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      className="rounded-full w-16 h-full p-1 bg-red-600 opacity-80 text-white cursor-pointer"
                    >
                      취소
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
