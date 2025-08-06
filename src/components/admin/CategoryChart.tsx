'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import { CHART_COLORS } from '@/constants';
import { useMemo } from 'react';
import { CategoryMetric } from '@type/admin/CategoryMetric';

interface CategoryChartProps {
  categoryMetrics: CategoryMetric[];
}
export default function CategoryChart({ categoryMetrics }: CategoryChartProps) {
  const formattedData = useMemo(() => {
    return categoryMetrics.map((item) => ({
      name: item.categoryType,
      count: item.count,
      fill: CHART_COLORS[item.categoryId % CHART_COLORS.length],
    }));
  }, [categoryMetrics]);

  const chartConfig = useMemo(() => {
    return categoryMetrics.reduce(
      (acc, item) => {
        acc[item.categoryType] = {
          label: item.categoryType,
          color: CHART_COLORS[item.categoryId % CHART_COLORS.length],
        };
        return acc;
      },
      {} as Record<string, { label: string; color: string }>,
    );
  }, [categoryMetrics]);

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-black mt-3">콘텐츠 분포</CardTitle>
        <CardDescription>카테고리별 콘텐츠 비율</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="w-full aspect-[2/1] max-h-[250px] mb-5"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={formattedData}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {formattedData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
