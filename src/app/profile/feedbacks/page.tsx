'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PosterCard } from '@components/explore/PosterCard';
import { ChevronLeft, Pencil } from 'lucide-react';
import MovieDetailModal from '@components/profile/MovieDetailModal';
import {
  dislikedPosters,
  likedPosters,
  mockModalDislikedMovieDataList,
  mockModalMovieDataList,
} from './feedbacks';
import { useDeleteMode } from '@hooks/useDeleteMode';
import { usePosterModal } from '@hooks/usePosterModal';
import { ContentDetail } from '@type/ContentDetail';

const FeedbackPage = () => {
  const router = useRouter();
  const [tab, setTab] = useState<'like' | 'dislike'>('like');
  const posters = tab === 'like' ? likedPosters : dislikedPosters;

  //삭제 모드 및 상세보기 상태를 관리
  const {
    state: { isDeleteMode, isAllSelected, selectedIds },
    actions: {
      setIsDeleteMode,
      handleCardClickInDeleteMode,
      handleSelectAll,
      handleDelete,
      handleCancelDeleteMode,
    },
  } = useDeleteMode(posters);

  const {
    state: { selectedPosterData },
    actions: { openModal, closeModal },
  } = usePosterModal();

  const handleCardClick = (poster: (typeof posters)[number]) => {
    if (isDeleteMode) {
      handleCardClickInDeleteMode(poster);
    } else {
      openModal(poster);
    }
  };

  // 상세 보기용 모달 데이터 연결
  const modalSource =
    tab === 'like' ? mockModalMovieDataList : mockModalDislikedMovieDataList;

  const modalMovieData: ContentDetail | null =
    modalSource.find(
      (item: ContentDetail) => item.contentId === selectedPosterData?.contentId,
    ) ?? null;

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-6">
      {/* 헤더 */}
      <div className="relative w-full max-w-screen-md flex items-center justify-center mb-2 h-10">
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
            aria-label="뒤로가기"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="text-lg font-bold text-white">선호 콘텐츠</h1>
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
              aria-label="편집"
            >
              <Pencil size={20} />
            </button>
          )}
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="w-full max-w-screen-md flex justify-around mb-4 border-b border-white/30">
        <button
          onClick={() => setTab('like')}
          className={`pb-2 font-semibold text-sm transition-all ${
            tab === 'like'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400'
          }`}
        >
          좋아요 {likedPosters.length}
        </button>
        <button
          onClick={() => setTab('dislike')}
          className={`pb-2 font-semibold text-sm transition-all ${
            tab === 'dislike'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400'
          }`}
        >
          싫어요 {dislikedPosters.length}
        </button>
      </div>

      {/* 카드 리스트 */}
      <div className="w-full max-w-screen-md">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 justify-items-center">
          {posters.map((poster) => (
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

      {/* 삭제 바 */}
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

export default FeedbackPage;
