import { PieChart, Pie, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@components/ui/chart';
import { batchTopCardDataConfigMap } from '@type/admin/batch';
import { useMemo } from 'react';

interface BatchChartCardSectionBodyProps {
  chartConfig: {
    [key: string]: {
      label: string;
      color: string;
    };
  };
  chartData: {
    name: string;
    value: number;
  }[];
}

// 배치 대기열 및 결과 확인하는 페이지에서 전체 현황을 차트로 볼 수 있는 카드의 body 영역 (공통 컴포넌트)
export function BatchChartCardSectionBody({
  chartConfig,
  chartData,
}: BatchChartCardSectionBodyProps) {
  // Pie 차트에서 제외할 데이터 분리 ('전체'는 제외)
  const pieChartData = useMemo(() => {
    return chartData.filter(
      (item) => item.name !== 'totalRead' && item.name !== 'total',
    );
  }, [chartData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full justify-items-center">
      {/* 왼쪽: 파이 차트 */}
      <div className="flex flex-col items-center w-full h-full">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <PieChart width={250} height={250}>
            <Pie
              data={pieChartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={40}
              strokeWidth={2}
            >
              {pieChartData.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={chartConfig[entry.name].color}
                />
              ))}
            </Pie>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
          </PieChart>
        </ChartContainer>
      </div>

      {/* 오른쪽: 상세 카드 */}
      <div className="flex flex-col w-full gap-6 justify-center">
        {/* 하단: 세부 항목 (작게, 세로) */}
        <div className="flex flex-col w-full gap-2">
          {chartData.map((stat, idx) => {
            const config =
              batchTopCardDataConfigMap[
                stat.name as keyof typeof batchTopCardDataConfigMap
              ]; // 해당 통계 데이터에 대해 맵핑된 정보 가져오기
            const Icon = config?.icon;
            // "전체"를 나타내는 key가 무엇인지 실제 config에서 확인 ("totalRead" or "total" 등)
            const isTotal = stat.name === 'totalRead' || stat.name === 'total';

            return (
              <div
                key={`${stat.name}-${idx}`}
                className={[
                  // 전체 대기열인 경우 특별한 스타일 적용 (isTotal이 true인 경우)
                  'flex items-center gap-3 p-4 rounded-lg border transition-colors',
                  isTotal
                    ? 'bg-gray-50 border-gray-200 shadow-xs mb-4'
                    : 'bg-card hover:bg-accent/50',
                ].join(' ')}
              >
                <Icon className="w-6 h-6" color={config?.color} />
                <span
                  className={
                    isTotal ? 'text-lg font-extrabold' : 'font-medium text-base'
                  }
                >
                  {config?.label}
                </span>
                <span
                  className={
                    isTotal
                      ? 'ml-auto text-2xl font-extrabold'
                      : 'ml-auto text-xl font-bold'
                  }
                >
                  {stat.value}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
