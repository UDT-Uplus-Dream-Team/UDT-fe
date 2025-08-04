'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@components/ui/chart';
import { PieChart, Pie, Cell } from 'recharts';
import {
  FolderCheck,
  CheckCircle,
  XCircle,
  CirclePlus,
  Pencil,
  Trash,
  MessageSquare,
} from 'lucide-react';
import { BatchTopCardDataItem } from '@/types/admin/batch';

// 배치 대기열 및 결과 확인하는 페이지에서 전체 현황을 볼 수 있는 카드 레이아웃의 props 타입
export interface BatchTopCardLayoutProps {
  title: string;
}

// TODO: 추후 목록 data 값들은 네트워크 통신으로 가져와야 함
const queueData: BatchTopCardDataItem[] = [
  {
    name: '콘텐츠 등록',
    value: 57,
    color: '#fbbf24',
    icon: CirclePlus,
  },
  {
    name: '콘텐츠 수정',
    value: 11,
    color: '#818cf8',
    icon: Pencil,
  },
  {
    name: '콘텐츠 삭제',
    value: 11,
    color: '#818cf8',
    icon: Trash,
  },
  {
    name: '사용자 피드백',
    value: 6,
    color: '#93c5fd',
    icon: MessageSquare,
  },
];

const resultData: BatchTopCardDataItem[] = [
  {
    name: '성공',
    value: 1800,
    color: '#86efac',
    icon: CheckCircle,
  },
  {
    name: '실패',
    value: 103,
    color: '#fca5a5',
    icon: XCircle,
  },
];

// 배치 대기열 및 결과 확인하는 페이지에서 전체 현황을 볼 수 있는 카드 레이아웃
export function BatchTopCardLayout({ title }: BatchTopCardLayoutProps) {
  // TODO: 추후 목록 data 값들은 네트워크 통신으로 가져와야 함
  const data = title === '배치 대기열 전체 현황' ? queueData : resultData;

  // PieChart 설정을 props로 넘겨 받은 data로부터 자동 생성
  const chartConfig = useMemo(
    () =>
      data.reduce(
        (acc, cur) => ({
          ...acc,
          [cur.name]: { label: cur.name, color: cur.color },
        }),
        {} as Record<string, { label: string; color: string }>,
      ),
    [data],
  );

  // 전체 현황 수치
  const totalCount = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="w-full py-4 px-2">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 왼쪽: 파이 차트 */}
          <div className="flex flex-col items-center">
            <ChartContainer
              config={chartConfig}
              className="w-full mx-auto aspect-square max-h-[300px]"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  innerRadius={40}
                  strokeWidth={2}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
          </div>

          {/* 오른쪽: 세부 수치 목록 */}
          <div className="flex flex-col items-center justify-center w-full gap-4">
            {/* "전체" 항목만 단독으로 크게 */}
            <div className="w-full">
              <div className="flex items-center justify-between p-6 rounded-xl border bg-card shadow hover:bg-accent/40 transition-colors">
                <div className="flex items-center gap-4">
                  <FolderCheck className="h-7 w-7 text-blue-600" />
                  <span className="font-semibold text-base">전체</span>
                </div>
                <div className="text-3xl font-extrabold">{totalCount}</div>
              </div>
            </div>
            {/* 나머지 통계 항목 grid로 표시 ('전체' 항목 제외) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full">
              {data.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.name}
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
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
