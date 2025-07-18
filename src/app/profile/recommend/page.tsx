'use client';

import { useRouter } from 'next/navigation';
import { PosterCard } from '@components/explore/PosterCard';
import { ChevronLeft } from 'lucide-react';
import MovieDetailModal from '@components/profile/MovieDetailModal';
import { mockModalMovieDataList, recommendedPosters } from './recommend';
import { usePosterModal } from '@/hooks/usePosterModal';
import { ContentDetail } from '@/types/ContentDetail';

const RecommendPage = () => {
  const router = useRouter();

  // 상세보기 모달 관련 상태 및 액션 훅
  const {
    state: { selectedPosterData }, // 모달에 표시할 포스터 데이터
    actions: { openModal, closeModal }, // 모달 열기/닫기 액션
  } = usePosterModal();

  const handleCardClick = (poster: (typeof recommendedPosters)[0]) => {
    openModal(poster);
  };

  // 상세보기 데이터 contentid로 찾아서 데이터 보여줌
  const selectedPoster = mockModalMovieDataList.find(
    (item: ContentDetail) => item.contentId === selectedPosterData?.contentId,
  );

  const modalMovieData = selectedPoster ?? null;

  return (
    <div className="h-[calc(100vh-80px)] w-full flex flex-col items-center px-4 py-6 overflow-y-auto">
      {/* 헤더 */}
      <div className="relative w-full max-w-screen-md flex items-center justify-center mb-6 h-10">
        <button
          onClick={() => router.push('/profile')}
          className="absolute left-0 pl-2 text-white"
        >
          <ChevronLeft size={24} />
        </button>

        <h1 className="text-lg font-bold text-white">추천 콘텐츠</h1>
      </div>

      {/* 카드 영역 */}
      <div className="w-full max-w-screen-md">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 justify-items-center">
          {recommendedPosters.map((poster) => (
            <PosterCard
              key={poster.contentId}
              title={poster.title}
              image={poster.posterUrl}
              size="lg"
              onClick={() => handleCardClick(poster)}
            />
          ))}
        </div>
      </div>

      {modalMovieData && (
        <MovieDetailModal
          isOpen={true}
          onClose={closeModal}
          data={modalMovieData}
        />
      )}
    </div>
  );
};

export default RecommendPage;
