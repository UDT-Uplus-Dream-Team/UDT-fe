// 영화(PosterCard) 카드를 모아 놓은 스크롤 박스 컴포넌트
import { PosterCard } from './PosterCard';
import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet';
import { DetailBottomSheetContent } from '@components/explore/DetailBottomSheetContent';
import { useGetContentListByBoxType } from '@hooks/explore/useGetContentListByBoxType';
import { FilterRadioButton } from '@components/explore/FilterRadioButton';

export interface PosterCardScrollBoxProps {
  BoxTitle: string;
  BoxType: 'popular' | 'todayRecommend';
}

// 포스터를 모아놓은 스크롤 박스 컴포넌트 (여기는 x축으로 왼쪽/오른쪽 스크롤 가능)
export const PosterCardScrollBox = ({
  BoxTitle,
  BoxType,
}: PosterCardScrollBoxProps) => {
  const [isDetailBottomSheetOpen, setIsDetailBottomSheetOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  // 포스터 스크롤 박스 타입에 따라 콘텐츠 목록 조회 API 호출하는 custom Hook 호출
  const {
    data: contentData,
    isError,
    refetch,
  } = useGetContentListByBoxType(BoxType);

  const handlePosterClick = (movieId: number) => {
    setSelectedMovieId(movieId);
    setIsDetailBottomSheetOpen(true);
  };

  const handleRefetch = () => {
    refetch();
  };

  // 에러 상태 또는 데이터가 없는 경우
  if (isError || contentData.length === 0) {
    return (
      <div className="w-full h-fit flex flex-col justify-start items-start gap-2">
        <span className="text-xl text-white font-semibold py-2 ml-6">
          {BoxTitle}
        </span>
        <div className="w-full h-40 flex flex-col items-center justify-center gap-4 px-6">
          <span className="text-white text-lg text-center">
            불러올 정보가 없습니다
          </span>
          <FilterRadioButton onToggle={handleRefetch} label="다시 불러오기" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-2">
      <span className="text-xl text-white font-semibold py-2 ml-6">
        {BoxTitle}
      </span>
      <div className="w-full h-fit flex flex-row gap-3 overflow-x-auto scrollbar-hide px-6">
        {contentData.map((movie) => (
          <PosterCard
            key={movie.contentId}
            title={'타이틀없음'}
            image={movie.posterUrl}
            isTitleVisible={false}
            onClick={() => handlePosterClick(movie.contentId)}
          />
        ))}
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
          {selectedMovieId && (
            <DetailBottomSheetContent contentId={selectedMovieId} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
