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
import { ContentSummary } from '@type/admin/Content';
import { generateChartData } from '@utils/getContentUtils';
import { CHART_COLORS } from '@/constants';
import { useMemo } from 'react';

interface ContenChartProps {
  contents: ContentSummary[];
}

export default function ContentChart({ contents }: ContenChartProps) {
  const chartData = useMemo(() => generateChartData(contents), [contents]); // [{ name: '영화', value: 20 }, { name: '드라마', value: 10 }]

  const chartConfig = useMemo(() => {
    return chartData.reduce(
      (acc, item, index) => {
        acc[item.name] = {
          label: item.name,
          color: CHART_COLORS[index % CHART_COLORS.length],
        };
        return acc;
      },
      {} as Record<string, { label: string; color: string }>,
    );
  }, [chartData]);

  const formattedData = useMemo(() => {
    return chartData.map((item, index) => ({
      ...item,
      fill: CHART_COLORS[index % CHART_COLORS.length],
    }));
  }, [chartData]);

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
              {formattedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
