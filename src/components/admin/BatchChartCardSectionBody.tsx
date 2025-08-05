// import { PieChart, Pie, Cell } from 'recharts';
// import {
//   ChartContainer,
//   ChartTooltip,
//   ChartTooltipContent,
// } from '@components/ui/chart';
import { ElementType } from 'react';

interface BatchChartCardSectionBodyProps {
  chartConfig: Record<
    string,
    { label: string; color: string; icon: ElementType; value: number }
  >;
  totalKey?: string; // 전체 현황을 보여주는 카드의 키 값
  otherKeys?: string[]; // 전체 현황을 제외한 나머지 현황을 보여주는 카드의 키 값
}

// 배치 대기열 및 결과 확인하는 페이지에서 전체 현황을 차트로 볼 수 있는 카드의 body 영역 (공통 컴포넌트)
export function BatchChartCardSectionBody({
  chartConfig,
  totalKey,
  otherKeys,
}: BatchChartCardSectionBodyProps) {
  // PieChart data로 바로 사용
  const pieData = Object.entries(chartConfig).map(
    ([key, { label, value, color }]) => ({
      key,
      name: typeof label === 'string' ? label : key, // label이 string 아니면 fallback
      value: (value as number) ?? 0, // value는 Pie dataKey에 필요
      color,
    }),
  );

  console.log(pieData);
  console.log(totalKey, otherKeys);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 왼쪽: 파이 차트 */}
      {/* <div className="flex flex-col items-center">
        <ChartContainer config={chart}>
          <PieChart width={250} height={250}>
            <Pie
              data={}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={40}
              strokeWidth={2}
            >
              {chartConfig.map((entry, idx) => (
                <Cell key={`cell-${idx}`} fill={entry.color} />
              ))}
            </Pie>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
          </PieChart>
        </ChartContainer>
      </div> */}
      {/* 오른쪽: 상세 카드 */}
      {/* <div className="flex flex-col items-center justify-center w-full gap-4">
        {totalItem && (
          <div className="w-full">
            <div className="flex items-center justify-between p-6 rounded-xl border bg-card shadow hover:bg-accent/40 transition-colors">
              <div className="flex items-center gap-4">
                <totalItem.icon className="h-7 w-7" color={totalItem.color} />
                <span className="font-semibold text-base">
                  {totalItem.name}
                </span>
              </div>
              <div className="text-3xl font-extrabold">{totalItem.value}</div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
          {otherItems.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-5 w-5" color={stat.color} />
                  <span className="font-medium text-sm">{stat.name}</span>
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
              </div>
            );
          })}
        </div>
      </div> */}
    </div>
  );
}
