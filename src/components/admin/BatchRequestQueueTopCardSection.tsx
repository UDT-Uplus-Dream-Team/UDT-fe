import { useMemo } from 'react';
import { useGetBatchRequestQueueStatistics } from '@/hooks/admin/useGetBatchRequestQueueStatistics';
import { useQueryErrorToast } from '@hooks/useQueryErrorToast';
import {
  batchRequestQueueKeys,
  batchTopCardDataConfigMap,
} from '@type/admin/batch';
import { BatchChartCardSectionBody } from '@components/admin/BatchChartCardSectionBody';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { ElementType } from 'react';

// '배치 대기열' 페이지에서 보여 줄 통계 data를 차트로 표현하는 컴포넌트
export function BatchRequestQueueTopCardSection() {
  const batchRequestQueueStatisticsQuery = useGetBatchRequestQueueStatistics(); // '배치 대기열' 통계 조회 훅
  useQueryErrorToast(batchRequestQueueStatisticsQuery); // 에러 토스트 메시지 표시를 위한 custom Hook

  const { data, status } = batchRequestQueueStatisticsQuery; // '배치 대기열' 통계 데이터
  const keys = batchRequestQueueKeys; // '배치 대기열' 통계에서 사용할 키 값

  // data를 이용해서 차트에 표시할 데이터 설정
  const chartConfig = useMemo(() => {
    if (!data) return {};
    return keys.reduce(
      (acc, key) => {
        const { label, color, icon } = batchTopCardDataConfigMap[key];
        acc[key] = {
          label,
          color,
          icon,
          value: data[key] ?? 0,
        };
        return acc;
      },
      {} as Record<
        string,
        { label: string; color: string; icon: ElementType; value: number }
      >,
    );
  }, [data, keys]);

  // "전체" 항목(예: total) 찾기
  // const totalItem = chartConfig.total;
  const otherItems = Object.keys(chartConfig).filter((key) => key !== 'total');

  // 3. 로딩 완료 시
  return (
    <Card className="w-full py-4 px-2">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          배치 대기열 전체 현황
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 1. 로딩 중 */}
        {status === 'pending' && (
          <div className="flex flex-1 justify-center items-center py-8 text-gray-400">
            불러오는 중입니다...
          </div>
        )}

        {/* 2. 에러 */}
        {status === 'error' && (
          <div className="flex flex-1 justify-center items-center py-8 text-red-500">
            데이터 조회 중 오류가 발생했습니다.
          </div>
        )}

        {/* 3. 정상 */}
        {status === 'success' && (
          <BatchChartCardSectionBody
            chartConfig={chartConfig}
            totalKey="total"
            otherKeys={otherItems}
          />
        )}
      </CardContent>
    </Card>
  );
}
