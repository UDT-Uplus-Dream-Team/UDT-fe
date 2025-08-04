import React, { useMemo, useState, memo } from 'react';
import Image from 'next/image';
import { Card } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { RecentContentData } from '@type/explore/Explore';

type RepresentativeContentCardProps = {
  content: RecentContentData;
};

// 화면 위에 표시될 엄청 큰 카드 (콘텐츠 정보 표시)
export const RepresentativeContentCard = memo(
  ({ content }: RepresentativeContentCardProps) => {
    const [posterImgSrc, setPosterImgSrc] = useState(content.posterUrl);

    // 동일한 props에 대한 계산 결과 고정, SSR/CSR 불일치 방지 (hydration 이슈 해결)
    const combinedTags = useMemo(() => {
      return [...(content.categories || []), ...(content.genres || [])];
    }, [content.categories, content.genres]);

    const displayedTags = useMemo(
      () => combinedTags.slice(0, 4),
      [combinedTags],
    );

    return (
      <Card className="!border-none !bg-transparent !shadow-none flex flex-col w-68 h-87 overflow-hidden group cursor-pointer transition-transform duration-200">
        <div className="relative flex-grow">
          <Image
            src={posterImgSrc}
            alt={content.title || '제목 없음'}
            fill
            unoptimized
            className="object-cover"
            priority
            onError={() => setPosterImgSrc('/images/default-poster.png')}
          />

          {/* 그라데이션 오버레이 - 텍스트 가독성을 위한 배경 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

          {/* 하단 콘텐츠 영역 */}
          <div className="absolute bottom-0 left-0 right-0 px-5 text-white flex flex-col items-center z-10">
            {/* 제목 */}
            <h3 className="font-bold text-xl mb-3 leading-tight text-center">
              {content.title}
            </h3>

            {/* 장르 태그들 */}
            <div className="flex flex-wrap gap-1 pb-5 justify-center">
              {displayedTags.map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-sm border-white/30 text-white hover:bg-white/10"
                >
                  #{tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>
    );
  },
);
