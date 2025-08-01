import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table';
import { CirclePlus, FolderCheck, Pencil, Trash } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Filter, ChevronDown } from 'lucide-react';
import { useState } from 'react';

const mockRequests = [
  {
    logId: 1,
    memberId: 10,
    title: '집에 가고 싶다',
    generateTime: '2025-07-31 10:15',
    status: 'PENDING',
  },
  {
    logId: 2,
    memberId: 11,
    title: '집에 가고 싶다22',
    generateTime: '2025-08-01 10:15',
    status: 'PENDING',
  },
  {
    logId: 3,
    memberId: 12,
    title: '집에 가고 싶다33',
    generateTime: '2025-08-02 10:15',
    status: 'FAIL',
  },
];

// 해당 요청의 종류를 표현하기 위한 색상 설정
const requestTypeConfig = {
  FAIL: { label: '실패', color: 'bg-red-100 text-red-800' },
  PENDING: { label: '대기중', color: 'bg-orange-100 text-orange-800' },
};

// 배치 처리를 위해 pending 중인 요청 목록을 보여줌
export function RequestQueueDashboard() {
  const [selectedFilter, setSelectedFilter] = useState<string>('전체');
  const filterOptions = ['전체', '콘텐츠 등록', '콘텐츠 수정', '콘텐츠 삭제']; // 필터링 옵션들

  return (
    <div className="space-y-6">
      {/* 상단의 카드 레이아웃(요청 대기열 관련 수치 정보 표시) */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">전체</CardTitle>
            <FolderCheck className="h-4 w-4 text-like" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold pb-2">24</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">콘텐츠 등록</CardTitle>
            <CirclePlus className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold pb-2">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">콘텐츠 수정</CardTitle>
            <Pencil className="h-4 w-4 text-orange-800" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold pb-2">5</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">콘텐츠 삭제</CardTitle>
            <Trash className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold pb-2">11</div>
          </CardContent>
        </Card>
      </div>

      {/* 요청 목록 테이블 */}
      <Card className="py-4 px-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">요청 목록</CardTitle>

            {/* 필터 드롭다운 */}
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
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>요청 ID</TableHead>
                <TableHead>제목</TableHead>
                <TableHead>요청자 ID</TableHead>
                <TableHead>생성 시간</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>처리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockRequests.map((request) => {
                return (
                  <TableRow key={request.logId}>
                    <TableCell className="font-medium">
                      {request.logId}
                    </TableCell>
                    <TableCell>{request.title}</TableCell>
                    <TableCell>{request.memberId}</TableCell>
                    <TableCell>{request.generateTime}</TableCell>
                    <TableCell>
                      <Badge
                        className={`${
                          requestTypeConfig[
                            request.status as keyof typeof requestTypeConfig
                          ].color
                        }`}
                      >
                        {
                          requestTypeConfig[
                            request.status as keyof typeof requestTypeConfig
                          ].label
                        }
                      </Badge>
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
    </div>
  );
}
