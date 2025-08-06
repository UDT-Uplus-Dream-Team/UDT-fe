'use client';

import { BarChart3, ThumbsUp, ThumbsDown, List } from 'lucide-react';
import { Button } from '@components/ui/button';

//차트 토글 버튼

interface ChartTypeToggleProps {
  chartType: 'bar' | 'like' | 'dislike' | 'list';
  setChartType: (type: 'bar' | 'like' | 'dislike' | 'list') => void;
}

export default function ChartTypeToggle({
  chartType,
  setChartType,
}: ChartTypeToggleProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      <Button
        variant={chartType === 'bar' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setChartType('bar')}
        className="flex items-center space-x-2"
      >
        <BarChart3 className="h-4 w-4" />
        <span>피드백 분포</span>
      </Button>
      <Button
        variant={chartType === 'like' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setChartType('like')}
        className="flex items-center space-x-2"
      >
        <ThumbsUp className="h-4 w-4" />
        <span>좋아요 분포</span>
      </Button>
      <Button
        variant={chartType === 'dislike' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setChartType('dislike')}
        className="flex items-center space-x-2"
      >
        <ThumbsDown className="h-4 w-4" />
        <span>싫어요 분포</span>
      </Button>
      <Button
        variant={chartType === 'list' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setChartType('list')}
        className="flex items-center space-x-2"
      >
        <List className="h-4 w-4" />
        <span>전체 목록</span>
      </Button>
    </div>
  );
}
