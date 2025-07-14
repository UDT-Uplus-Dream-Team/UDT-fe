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
import { Content } from '@type/admin/Content';
import { generateChartData } from '@utils/content-utils';
import { CHART_COLORS } from '@/constants';

interface ContenChartProps {
  contents: Content[];
}

export default function ContentChart({ contents }: ContenChartProps) {
  const chartData = generateChartData(contents); // [{ name: '영화', value: 20 }, { name: '드라마', value: 10 }]

  const chartConfig = chartData.reduce(
    (acc, item, index) => {
      acc[item.name] = {
        label: item.name,
        color: CHART_COLORS[index % CHART_COLORS.length],
      };
      return acc;
    },
    {} as Record<string, { label: string; color: string }>,
  );

  const formattedData = chartData.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="text-black mt-3">콘텐츠 분포</CardTitle>
        <CardDescription>카테고리별 콘텐츠 비율</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="w-full aspect-[2/1] max-h-[250px] mb-7"
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
