// ✅ components/chart/SummaryStats.tsx
'use client';

import { UserDetail } from '@type/admin/user';

interface SummaryStatsProps {
  userDetail: UserDetail;
}

export default function SummaryStats({ userDetail }: SummaryStatsProps) {
  if (!userDetail) return null;
  const { totalLikeCount, totalDislikeCount, totalUninterestedCount, genres } =
    userDetail;

  // 활동한 장르 수 계산 (합이 0보다 큰 장르만 카운트)
  const totalGenres = genres.filter(
    (g) => g.likeCount + g.dislikeCount + g.uninterestedCount > 0,
  ).length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4 ">
      <div className="text-center p-4 rounded-lg border ">
        <div className="text-2xl font-bold text-blue-500">{totalGenres}</div>
        <div className="text-sm text-gray-600">활동한 장르</div>
      </div>
      <div className="text-center p-4 rounded-lg border ">
        <div className="text-2xl font-bold text-green-500">
          {totalLikeCount}
        </div>
        <div className="text-sm text-gray-600">좋아요 작품</div>
      </div>
      <div className="text-center p-4 rounded-lg border ">
        <div className="text-2xl font-bold text-red-500">
          {totalDislikeCount}
        </div>
        <div className="text-sm text-gray-600">싫어요 작품</div>
      </div>
      <div className="text-center p-4 rounded-lg border ">
        <div className="text-2xl font-bold text-yellow-500">
          {totalUninterestedCount}
        </div>
        <div className="text-sm text-gray-600">관심없음 작품</div>
      </div>
    </div>
  );
}
