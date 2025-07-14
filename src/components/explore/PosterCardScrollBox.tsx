// 영화(PosterCard) 카드를 모아 놓은 스크롤 박스 컴포넌트
import { PosterCardScrollBoxProps } from '@type/explore/Explore';
import { PosterCard } from './PosterCard';
import { useState } from 'react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { DetailBottomSheetContent } from '@components/explore/DetailBottomSheetContent';

export const PosterCardScrollBox = ({
  title,
  SimpleMovieData,
}: PosterCardScrollBoxProps) => {
  const [isDetailBottomSheetOpen, setIsDetailBottomSheetOpen] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

  const handlePosterClick = (movieId: number) => {
    //TODO: 이것을 네트워크 통신으로 대체해야 함
    setSelectedMovieId(movieId);
    setIsDetailBottomSheetOpen(true);
  };

  return (
    <div className="w-full h-fit flex flex-col justify-start items-start gap-2">
      <span className="text-xl text-white font-semibold py-2 ml-6">
        {title}
      </span>
      <div className="w-full h-fit flex flex-row gap-3 overflow-x-auto scrollbar-hide px-6">
        {SimpleMovieData.map((movie) => (
          <PosterCard
            key={movie.id}
            title={movie.title}
            image={movie.image}
            isTitleVisible={true}
            onClick={() => handlePosterClick(movie.id)}
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
          className="p-0 pb-5 h-[90vh] max-w-full rounded-t-2xl bg-primary-800 flex flex-col overflow-y-auto scrollbar-hide"
        >
          {selectedMovieId && (
            <DetailBottomSheetContent contentId={selectedMovieId} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};
