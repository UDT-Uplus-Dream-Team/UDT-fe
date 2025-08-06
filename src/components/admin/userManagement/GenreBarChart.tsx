'use client';

import { GenreFeedback } from '@type/admin/user';
import { getGenreLabel } from '@utils/admin/genres';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  TooltipProps,
} from 'recharts';

import {
  NameType,
  ValueType,
} from 'recharts/types/component/DefaultTooltipContent';

// 피드백 분포 차트
interface GenreBarChartProps {
  genres: GenreFeedback[];
}

export default function GenreBarChart({ genres }: GenreBarChartProps) {
  const chartData = genres
    .map((genre) => ({
      ...genre,
      genreName: getGenreLabel(genre.genreType),
      total: genre.likeCount + genre.dislikeCount + genre.uninterestedCount,
    }))
    .filter((g) => g.total > 0) // 총합 0인 항목 제거
    .sort((a, b) => b.total - a.total) // 총합 기준 내림차순 정렬
    .slice(0, 10); // 상위 10개 항목만 시각화

  //튤팁을 통한 실제 값 자세히보기 컴포넌트
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipProps<ValueType, NameType>) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <p className="text-gray-500">좋아요: {data.likeCount}</p>
            <p className="text-gray-500">싫어요: {data.dislikeCount}</p>
            <p className="text-gray-500">관심없음: {data.uninterestedCount}</p>
            <p className="text-gray-500 border-t pt-1 mt-2">
              총합: {data.total}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="genreName"
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={11}
            stroke="#666"
            interval={0}
          />
          <YAxis stroke="#666" fontSize={12} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ paddingTop: '20px' }}
            formatter={(value) => {
              const labels: Record<string, string> = {
                like: '좋아요',
                dislike: '싫어요',
                uninterested: '관심없음',
              };
              return labels[value] || value;
            }}
          />
          <Bar dataKey="likeCount" stackId="a" fill="#A0ECB1" name="like" />
          <Bar
            dataKey="dislikeCount"
            stackId="a"
            fill="#F0A9A7"
            name="dislike"
          />
          <Bar
            dataKey="uninterestedCount"
            stackId="a"
            fill="#F3BD7F"
            name="uninterested"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
