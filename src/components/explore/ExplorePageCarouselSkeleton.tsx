// src/components/explore/CarouselSkeleton.tsx
import { Skeleton } from '@components/common/Skeleton';

const CARD_WIDTH = 272;
const CARD_GAP = 8;
const SCALE_FACTOR = 0.85;

// 탐색 페이지 상단에 있는 큰 Carousel 스켈레톤 컴포넌트
export const ExplorePageCarouselSkeleton = () => {
  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="overflow-hidden">
        <div
          className="flex justify-center items-end"
          style={{
            transform: `translateX(0px)`,
          }}
        >
          {/* 좌측 스케일된 카드 */}
          <div
            className="flex-shrink-0"
            style={{
              width: CARD_WIDTH,
              marginRight: CARD_GAP,
              transform: `scale(${SCALE_FACTOR})`,
              transformOrigin: 'center bottom',
            }}
          >
            <RepresentativeCardSkeleton dimmed />
          </div>

          {/* 중앙 메인 카드 */}
          <div
            className="flex-shrink-0"
            style={{
              width: CARD_WIDTH,
              marginRight: CARD_GAP,
              transform: 'scale(1)',
              transformOrigin: 'center bottom',
            }}
          >
            <RepresentativeCardSkeleton />
          </div>

          {/* 우측 스케일된 카드 */}
          <div
            className="flex-shrink-0"
            style={{
              width: CARD_WIDTH,
              transform: `scale(${SCALE_FACTOR})`,
              transformOrigin: 'center bottom',
            }}
          >
            <RepresentativeCardSkeleton dimmed />
          </div>
        </div>
      </div>
    </div>
  );
};

// RepresentativeContentCard와 동일한 구조의 Skeleton
const RepresentativeCardSkeleton = ({
  dimmed = false,
}: {
  dimmed?: boolean;
}) => (
  <div className={`relative w-68 h-87 ${dimmed ? 'opacity-40' : ''}`}>
    {/* 메인 이미지 영역 */}
    <Skeleton className="w-full h-full rounded-lg">
      {/* 하단 그라데이션 영역 */}
      <div className="absolute bottom-0 left-0 right-0 px-5 pb-5 flex flex-col items-center">
        {/* 제목 Skeleton */}
        <Skeleton className="w-40 h-6 mb-3 bg-gray-600/60" />

        {/* 태그들 Skeleton */}
        <div className="flex flex-wrap gap-1 justify-center">
          <Skeleton className="w-12 h-5 bg-gray-600/60" />
          <Skeleton className="w-16 h-5 bg-gray-600/60" />
          <Skeleton className="w-14 h-5 bg-gray-600/60" />
          <Skeleton className="w-10 h-5 bg-gray-600/60" />
        </div>
      </div>
    </Skeleton>
  </div>
);
