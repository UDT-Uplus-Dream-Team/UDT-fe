import React, { useState } from 'react';
import Image from 'next/image';
import { Card } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { RecentContentData } from '@type/explore/Explore';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet';
import { DetailBottomSheetContent } from './DetailBottomSheetContent';

type RepresentativeContentCardProps = {
  content: RecentContentData;
};

// 화면 위에 표시될 엄청 큰 카드 (콘텐츠 정보 표시)
export const RepresentativeContentCard = ({
  content,
}: RepresentativeContentCardProps) => {
  const [isDetailBottomSheetOpen, setIsDetailBottomSheetOpen] = useState(false);

  // 카드 클릭 시 BottomSheet 열기
  const handlePosterClick = () => {
    //TODO: 이것을 네트워크 통신으로 대체해야 함
    setIsDetailBottomSheetOpen(true);
  };

  return (
    <Card
      className="flex flex-col w-68 h-87 overflow-hidden group cursor-pointer transition-transform duration-200 border-none"
      onClick={handlePosterClick}
    >
      <div className="relative flex-grow">
        <Image
          src={content.posterUrl || '/placeholder.svg'}
          alt={content.title}
          fill
          className="object-cover"
          priority
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
            {content.categories
              .flatMap(({ category, genres }) => [category, ...genres])
              .slice(0, 4)
              .map((tag, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-sm border-white/30 text-white hover:bg-white/10"
                >
                  #{tag}
                </Badge>
              ))}

            {content.categories.flatMap(({ category, genres }) => [
              category,
              ...genres,
            ]).length > 4 && (
              <Badge
                variant="outline"
                className="text-xs border-white/30 text-white"
              >
                +
                {content.categories.flatMap(({ category, genres }) => [
                  category,
                  ...genres,
                ]).length - 4}
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* 영화 상세 정보 BottomSheet (필요 시 pop-up) */}
      <Sheet
        open={isDetailBottomSheetOpen}
        onOpenChange={setIsDetailBottomSheetOpen}
      >
        <SheetContent
          side="bottom"
          className="px-0 pb-5 h-[90vh] max-w-full rounded-t-2xl bg-primary-800 flex flex-col overflow-y-auto scrollbar-hide gap-0"
        >
          {/* 표시되지 않는 Header (Screen Reader에서만 읽힘) */}
          <SheetHeader className="p-0">
            <SheetTitle className="sr-only h-0 p-0">상세정보</SheetTitle>
          </SheetHeader>
          <DetailBottomSheetContent contentId={content.contentId} />
        </SheetContent>
      </Sheet>
    </Card>
  );
};
