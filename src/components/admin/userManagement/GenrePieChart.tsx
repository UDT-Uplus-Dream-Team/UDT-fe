'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useMemo } from 'react';
import { getGenreColor, getGenreLabel } from '@utils/admin/genres';
import { GenreFeedback } from '@type/admin/user';

// 좋아요,싫어요 분포 차트

interface GenrePieChartProps {
  genres: GenreFeedback[];
  type: 'like' | 'dislike';
}

export default function GenrePieChart({ genres, type }: GenrePieChartProps) {
  const filtered = useMemo(() => {
    return genres
      .filter((g) => {
        const count = type === 'like' ? g.likeCount : g.dislikeCount;
        return count > 0;
      })
      .sort((a, b) => {
        const aVal = type === 'like' ? a.likeCount : a.dislikeCount;
        const bVal = type === 'like' ? b.likeCount : b.dislikeCount;
        return bVal - aVal;
      })
      .slice(0, 10);
  }, [genres, type]);

  const total = filtered.reduce(
    (sum, g) => sum + (type === 'like' ? g.likeCount : g.dislikeCount),
    0,
  );

  const pieData = filtered.map((g) => ({
    name: getGenreLabel(g.genreType),
    value: type === 'like' ? g.likeCount : g.dislikeCount,
    percentage: total
      ? (
          ((type === 'like' ? g.likeCount : g.dislikeCount) / total) *
          100
        ).toFixed(1)
      : '0',
    color: getGenreColor(g.genreType),
  }));

  return (
    <div className="w-full lg:flex items-start justify-between gap-4">
      {/*원형 차트 영역: 2 비율 */}
      <div className="w-full lg:flex-[2] flex items-center justify-center h-[520px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name} ${percentage}%`}
              outerRadius={130}
              dataKey="value"
            >
              {pieData.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const { name, value, percentage } = payload[0].payload;
                return (
                  <div className="bg-white p-4 border border-gray-200 rounded-lg shadow">
                    <p className="font-semibold text-gray-900 mb-2">{name}</p>
                    <p className="text-sm text-gray-700">
                      {value}개 ({percentage}%)
                    </p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 리스트 영역: 1 비율 */}
      <div className="w-full lg:flex-[1] p-4">
        <h4 className="font-semibold text-gray-900 mb-4 text-center flex items-center justify-center gap-2">
          {type === 'like' ? (
            <>
              <ThumbsUp className="h-5 w-5 text-green-600" />
              <span>좋아요 TOP 10</span>
            </>
          ) : (
            <>
              <ThumbsDown className="h-5 w-5 text-red-600" />
              <span>싫어요 TOP 10</span>
            </>
          )}
        </h4>
        <div className="space-y-3">
          {pieData.map((entry, idx) => (
            <div key={entry.name} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 w-5 text-right">
                  #{idx + 1}
                </span>
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-800 font-medium">
                  {entry.name}
                </span>
              </div>
              <div className="text-right">
                <div
                  className={`text-sm font-semibold ${
                    type === 'like' ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {entry.value}개
                </div>
                <div className="text-xs text-gray-500">{entry.percentage}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
