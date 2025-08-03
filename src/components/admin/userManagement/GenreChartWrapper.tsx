'use client';

import { useState } from 'react';
import ChartTypeToggle from './ChartTypeToggle';
import GenreBarChart from './GenreBarChart';
import GenrePieChart from './GenrePieChart';
import GenreList from './GenreList';
import { GenreFeedback } from '@type/admin/user';

//전체 차트 wrapper
interface GenreChartWrapperProps {
  genres: GenreFeedback[];
}

export default function GenreChartWrapper({ genres }: GenreChartWrapperProps) {
  const [chartType, setChartType] = useState<
    'bar' | 'like' | 'dislike' | 'list'
  >('bar');

  return (
    <div className="space-y-4">
      <ChartTypeToggle chartType={chartType} setChartType={setChartType} />

      {chartType === 'bar' && <GenreBarChart genres={genres} />}
      {chartType === 'like' && <GenrePieChart genres={genres} type="like" />}
      {chartType === 'dislike' && (
        <GenrePieChart genres={genres} type="dislike" />
      )}
      {chartType === 'list' && <GenreList genres={genres} />}
    </div>
  );
}
