'use client';

import { GenreFeedback } from '@type/admin/user';
import { getGenreLabel } from '@utils/admin/genres';

interface GenreListProps {
  genres: GenreFeedback[];
}

//전체 목록 차트
export default function GenreList({ genres }: GenreListProps) {
  const chartData = genres
    .map((g) => ({
      ...g,
      genreName: getGenreLabel(g.genreType),
      total: g.likeCount + g.dislikeCount + g.uninterestedCount,
    }))
    .filter((g) => g.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <div className="overflow-x-auto p-4">
      <table className="min-w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
        <thead className="bg-gray-50 text-gray-600 text-sm border-b">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">#</th>
            <th className="px-4 py-3 text-left font-semibold">장르</th>
            <th className="px-4 py-3 text-center font-semibold">좋아요</th>
            <th className="px-4 py-3 text-center font-semibold">싫어요</th>
            <th className="px-4 py-3 text-center font-semibold">관심없음</th>
            <th className="px-4 py-3 text-center font-semibold">총합</th>
          </tr>
        </thead>
        <tbody className="text-gray-800">
          {chartData.map((genre, idx) => (
            <tr
              key={genre.genreType}
              className="border-t border-gray-200 hover:bg-gray-50"
            >
              <td className="px-4 py-2">{idx + 1}</td>
              <td className="px-4 py-2 font-medium">{genre.genreName}</td>
              <td className="px-4 py-2 text-center text-green-600 font-semibold">
                {genre.likeCount}
              </td>
              <td className="px-4 py-2 text-center text-red-600 font-semibold">
                {genre.dislikeCount}
              </td>
              <td className="px-4 py-2 text-center text-orange-500 font-semibold">
                {genre.uninterestedCount}
              </td>
              <td className="px-4 py-2 text-center font-bold text-gray-700">
                {genre.total}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
