'use client';

import { useRouter } from 'next/navigation';
import { PosterCard } from '@components/explore/PosterCard';
import { ChevronLeft, Pencil } from 'lucide-react';
import MovieDetailModal from '@components/profile/MovieDetailModal';
import { mockModalMovieDataList, recommendedPosters } from './recommend';
import { useDeleteMode } from '@hooks/useDeleteMode';
import { usePosterModal } from '@/hooks/usePosterModal';
import { ContentDetail } from '@/types/ContentDetail';

const RecommendPage = () => {
  const router = useRouter();

  //삭제 모드 및 상세보기 상태를 관리
  const {
    state: { isDeleteMode, isAllSelected, selectedIds },
    actions: {
      handleCardClickInDeleteMode,
      handleSelectAll,
      handleDelete,
      handleCancelDeleteMode,
      setIsDeleteMode,
    },
  } = useDeleteMode(recommendedPosters);

  // 상세보기 모달 관련 상태 및 액션 훅
  const {
    state: { selectedPosterData }, // 모달에 표시할 포스터 데이터
    actions: { openModal, closeModal }, // 모달 열기/닫기 액션
  } = usePosterModal();

  const handleCardClick = (poster: (typeof recommendedPosters)[0]) => {
    if (isDeleteMode) {
      handleCardClickInDeleteMode(poster);
    } else {
      openModal(poster);
    }
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
        {isDeleteMode ? (
          <button
            onClick={handleSelectAll}
            className="absolute left-0 pl-2 text-white text-sm"
          >
            {isAllSelected ? '선택해제' : '모두선택'}
          </button>
        ) : (
          <button
            onClick={() => router.push('/profile')}
            className="absolute left-0 pl-2 text-white"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <h1 className="text-lg font-bold text-white">추천 콘텐츠</h1>

        <div className="absolute right-0 pr-2">
          {isDeleteMode ? (
            <button
              onClick={handleCancelDeleteMode}
              className="text-white text-sm"
            >
              취소
            </button>
          ) : (
            <button
              onClick={() => setIsDeleteMode(true)}
              className="text-white"
            >
              <Pencil size={20} />
            </button>
          )}
        </div>
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
              isDeletable={isDeleteMode}
              isSelected={selectedIds.includes(poster.contentId)}
              onClick={() => handleCardClick(poster)}
            />
          ))}
        </div>
      </div>

      {/* 하단 삭제 바 */}
      {isDeleteMode && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-gray-700 h-[80px] px-4 flex items-center justify-between z-[100] w-full max-w-160">
          <p className="text-white text-sm">삭제할 콘텐츠를 선택하세요.</p>
          <button
            onClick={handleDelete}
            className={`text-2xl ${
              selectedIds.length > 0
                ? 'text-white'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            🗑️
          </button>
        </div>
      )}

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
