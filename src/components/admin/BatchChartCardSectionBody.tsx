import { PieChart, Pie, Cell } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@components/ui/chart';
import {
  CirclePlus,
  FolderCheck,
  FolderPlus,
  FolderX,
  Pencil,
  Trash,
} from 'lucide-react';
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
  // 아이콘 목록 (chartData의 길이에 따라 아이콘 개수 조정)
  const iconList = useMemo(() => {
    if (chartData.length === 3) {
      return [FolderCheck, FolderPlus, FolderX];
    } else if (chartData.length === 4) {
      return [FolderCheck, Pencil, CirclePlus, Trash];
    }
    return [];
  }, [chartData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* 왼쪽: 파이 차트 */}
      <div className="flex flex-col items-center">
        <ChartContainer config={chartConfig}>
          <PieChart width={250} height={250}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={40}
              strokeWidth={2}
            >
              {chartData.map((entry, idx) => (
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
      <div className="flex flex-col w-full gap-6">
        {/* 상단: 총계 (이건 크게 만들어줘야 함) */}
        <div className="w-full">
          <div className="flex items-center gap-4 p-6 rounded-xl border bg-card shadow hover:bg-accent/40 transition-colors">
            <FolderCheck
              className="h-8 w-8"
              color={chartConfig.totalRead.color}
            />
            <span className="font-bold text-2xl">
              {chartConfig.totalRead.label}
            </span>
            <span className="ml-auto text-4xl font-extrabold">
              {chartData[0].value}
            </span>
          </div>
        </div>
        {/* 하단: 세부 항목 (작게, 세로) */}
        <div className="flex flex-col w-full gap-2">
          {chartData.slice(1).map((stat, idx) => {
            const Icon = iconList[idx];
            return (
              <div
                key={stat.name}
                className="flex items-center gap-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <Icon className={`w-6 h-6 ${chartConfig[stat.name].color}`} />
                <span className="font-medium text-base">
                  {chartConfig[stat.name].label}
                </span>
                <span className="ml-auto text-xl font-bold">{stat.value}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
