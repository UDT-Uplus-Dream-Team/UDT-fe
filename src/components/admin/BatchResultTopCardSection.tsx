// import { useMemo } from 'react';
import { useGetBatchResultStatistics } from '@hooks/admin/useGetBatchResultStatistics';
import { useQueryErrorToast } from '@hooks/useQueryErrorToast';
import { batchResultKeys, batchTopCardDataConfigMap } from '@type/admin/batch';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { ChartConfig } from '@components/ui/chart';
import { BatchChartCardSectionBody } from '@components/admin/BatchChartCardSectionBody';
import { useMemo } from 'react';

// '배치 결과' 페이지에서 보여 줄 통계 data를 차트로 표현하는 컴포넌트
export function BatchResultTopCardSection() {
  const batchResultStatisticsQuery = useGetBatchResultStatistics(); // '배치 결과' 통계 조회 훅
  useQueryErrorToast(batchResultStatisticsQuery); // 에러 토스트 메시지 표시를 위한 custom Hook

  const { data, status } = batchResultStatisticsQuery; // '배치 결과' 통계 데이터
  const chartConfig = Object.fromEntries(
    // 차트에 표시할 chartConfig 값 설정 (shadcn/ui에서 Chart 컴포넌트 사용을 위해 필요)
    batchResultKeys.map((key) => [
      key,
      {
        label: batchTopCardDataConfigMap[key].label,
        color: batchTopCardDataConfigMap[key].color,
      },
    ]),
  ) satisfies ChartConfig;

  // 차트에 표시할 데이터 설정
  const chartData = useMemo(() => {
    if (!data) return [];
    return [
      { name: 'totalRead', value: data?.totalRead },
      { name: 'totalCompleted', value: data?.totalCompleted },
      { name: 'totalInvalid', value: data?.totalInvalid },
      { name: 'totalFailed', value: data?.totalFailed },
    ];
  }, [data]);

  // 데이터가 비어 있거나, 모든 값이 0인 경우에 대한 flag 값 (chartData가 바뀌는 경우에만 계산)
  const isAllZero = useMemo(() => {
    return (
      chartData.length === 0 || chartData.every((item) => item.value === 0)
    );
  }, [chartData]);

  return (
    <Card className="w-full py-4 px-2 min-h-[200px]">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          배치 결과 전체 현황
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

        {/* 3. 데이터가 비어 있거나, 모든 값이 0인 경우 */}
        {status === 'success' && isAllZero && (
          <div className="flex flex-1 justify-center items-center py-8 text-gray-400 h-32">
            배치 결과에 대한 데이터가 없습니다.
          </div>
        )}

        {/* 4. 정상 */}
        {status === 'success' && !isAllZero && (
          <BatchChartCardSectionBody
            chartConfig={chartConfig}
            chartData={chartData}
          />
        )}
      </CardContent>
    </Card>
  );
}
