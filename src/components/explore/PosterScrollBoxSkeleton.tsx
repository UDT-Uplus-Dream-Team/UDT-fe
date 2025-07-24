// src/components/explore/PosterScrollSkeleton.tsx
import { Skeleton } from '@components/common/Skeleton';

interface PosterScrollSkeletonProps {
  title: string;
  count?: number;
}

// 포스터 스크롤 박스 스켈레톤 컴포넌트
export const PosterScrollSkeleton = ({
  title,
  count = 6,
}: PosterScrollSkeletonProps) => {
  return (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-2">
      {/* 제목 */}
      <span className="text-xl text-white font-semibold py-2 ml-6">
        {title}
      </span>

      {/* 포스터 카드들 */}
      <div className="w-full h-fit flex flex-row gap-3 overflow-x-auto scrollbar-hide px-6">
        {Array.from({ length: count }).map((_, index) => (
          <PosterCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};

// PosterCard와 동일한 크기의 Skeleton
const PosterCardSkeleton = () => (
  <div className="flex-shrink-0">
    <Skeleton className="w-[110px] h-[154px] rounded-lg" />
  </div>
);
