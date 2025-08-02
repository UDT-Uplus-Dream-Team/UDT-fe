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
import {
  mockRequestsInBatchResult,
  requestTypeConfigInBatchResult,
} from '@type/admin/BatchPage';

// 각 batch ID에 대해 배치 결과를 보여주는 테이블
export function BatchResultDashboardTable() {
  // TODO: 추후 목록 data 값들은 네트워크 통신으로 가져와야 함
  return (
    <Card className="h-full py-4 px-2">
      <CardHeader>
        <CardTitle className="text-lg font-bold">배치별 실행 결과</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>배치 ID</TableHead>
              <TableHead>요청 타입</TableHead>
              <TableHead>요청자</TableHead>
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
            {mockRequestsInBatchResult.map((request) => {
              return (
                <TableRow key={request.batchId}>
                  <TableCell className="font-medium">
                    {request.batchId}
                  </TableCell>
                  <TableCell>{request.title}</TableCell>
                  <TableCell>{request.memberId}</TableCell>
                  <TableCell>{request.generateTime}</TableCell>
                  <TableCell>{request.generateTime}</TableCell>
                  <TableCell>
                    <Badge
                      className={`${
                        requestTypeConfigInBatchResult[
                          request.status as keyof typeof requestTypeConfigInBatchResult
                        ].color
                      }`}
                    >
                      {
                        requestTypeConfigInBatchResult[
                          request.status as keyof typeof requestTypeConfigInBatchResult
                        ].label
                      }
                    </Badge>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
