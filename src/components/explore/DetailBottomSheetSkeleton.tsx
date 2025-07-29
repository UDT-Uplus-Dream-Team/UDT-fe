import { Skeleton } from '@components/common/Skeleton';

// 로딩 중 Skeleton UI 컴포넌트
export const DetailBottomSheetSkeleton = () => {
  return (
    <div className="flex-1 scrollbar-hide">
      {/* 트레일러/백드롭 영역 Skeleton */}
      <div className="relative w-full h-90 rounded-t-lg overflow-hidden">
        <Skeleton className="w-full h-full rounded-t-lg" />

        {/* 하단 콘텐츠 정보 Skeleton */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center space-y-3">
          <Skeleton className="h-8 w-48" /> {/* 제목 */}
          <div className="flex items-center space-x-5">
            <Skeleton className="h-4 w-16" /> {/* 날짜 */}
            <Skeleton className="h-4 w-12" /> {/* 평점 */}
            <Skeleton className="h-4 w-14" /> {/* 국가 */}
          </div>
        </div>
      </div>

      {/* 콘텐츠 정보 영역 */}
      <div className="flex flex-col space-y-6 px-4 pt-4 bg-gradient-to-b from-black/100 to-primary-800">
        {/* 플랫폼 버튼들 Skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>

        {/* 시놉시스 Skeleton */}
        <div className="space-y-2">
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>

        {/* 출연진 Skeleton */}
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-6 w-16" /> {/* "출연진" 제목 */}
          <div className="flex space-x-4">
            {[...Array(4)].map((_, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 min-w-[60px]"
              >
                <Skeleton className="w-15 h-15 rounded-full" /> {/* 아바타 */}
                <Skeleton className="h-3 w-12" /> {/* 이름 */}
              </div>
            ))}
          </div>
        </div>

        {/* 감독 Skeleton */}
        <div className="flex flex-col space-y-3">
          <Skeleton className="h-6 w-12" /> {/* "감독" 제목 */}
          <Skeleton className="h-4 w-32" /> {/* 감독 이름 */}
        </div>
      </div>
    </div>
  );
};
