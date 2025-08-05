// import { useMemo } from 'react';
import { useGetBatchResultStatistics } from '@hooks/admin/useGetBatchResultStatistics';
import { useQueryErrorToast } from '@hooks/useQueryErrorToast';
// import { batchResultKeys, batchTopCardDataConfigMap } from '@type/admin/batch';
// import { BatchChartCardSectionBody } from '@components/admin/BatchChartCardSectionBody';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';

// '배치 결과' 페이지에서 보여 줄 통계 data를 차트로 표현하는 컴포넌트
export function BatchResultTopCardSection() {
  const batchResultStatisticsQuery = useGetBatchResultStatistics(); // '배치 결과' 통계 조회 훅
  useQueryErrorToast(batchResultStatisticsQuery); // 에러 토스트 메시지 표시를 위한 custom Hook

  const { status } = batchResultStatisticsQuery; // '배치 결과' 통계 데이터
  // const keys = batchResultKeys; // '배치 결과' 통계에서 사용할 키 값
  // const chartConfig = useMemo(() => {
  //   // 차트에 표시할 데이터 설정
  //   if (!data) return [];
  //   return keys.map((key) => {
  //     const { label, color, icon } = batchTopCardDataConfigMap[key];
  //     return {
  //       key,
  //       name: label,
  //       value: data[key] ?? 0,
  //       color,
  //       icon,
  //     };
  //   });
  // }, [data, keys]);

  // 총 합계 항목 찾기
  // const totalItem = chartConfig.find((c) => c.key === 'totalRead');
  // const otherItems = chartConfig.filter((c) => c.key !== 'totalRead');

  // 1. 로딩 중일 때
  if (status === 'pending') {
    return <div>불러오는 중입니다...</div>;
  }

  // 2. 에러 발생 시
  if (status === 'error') {
    return <div>에러가 발생했습니다.</div>;
  }

  // 3. 로딩 완료 시
  return (
    <Card className="w-full py-4 px-2">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          배치 결과 전체 현황
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* <BatchChartCardSectionBody
          chartConfig={chartConfig}
          totalItem={totalItem}
          otherItems={otherItems}
        /> */}
      </CardContent>
    </Card>
  );
}
