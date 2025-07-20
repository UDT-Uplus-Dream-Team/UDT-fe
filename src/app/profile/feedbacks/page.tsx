'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PosterCard } from '@components/explore/PosterCard';
import { ChevronLeft, Pencil } from 'lucide-react';
import MovieDetailModal from '@components/profile/MovieDetailModal';
import { useDeleteMode } from '@/hooks/profile/useDeleteMode';
import { usePosterModal } from '@hooks/usePosterModal';
import { useInfiniteFeedbacks } from '@/hooks/profile/useInfiniteFeedbacks';
import { useGetStoredContentDetail } from '@/hooks/profile/useGetStoredContentDetail';
import { FeedbackContent } from '@type/profile/FeedbackContent';
import { useDeleteFeedbackToast } from '@/hooks/profile/useDeleteFeedbackToast';

const FeedbackPage = () => {
  const router = useRouter();
  const [tab, setTab] = useState<'like' | 'dislike'>('like');

  //실제 데이터 연결(로딩, 에러 나중에 추가)
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteFeedbacks({
      size: 20,
      feedbackType: tab === 'like' ? 'LIKE' : 'DISLIKE',
      feedbackSortType: 'NEWEST',
    });

  const posters = useMemo(
    () =>
      (data?.pages.flatMap((page) => page.item) ?? []).filter(
        (item): item is FeedbackContent => item !== null && item !== undefined,
      ),
    [data],
  );

  //컨텐츠 아예 없을 경우 api 호출을 막음
  const isEmpty = posters.length === 0;

  const observerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || isEmpty) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        fetchNextPage();
      }
    });
    if (observerRef.current) {
      observer.observe(observerRef.current);
    }
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, tab, isEmpty]);

  //삭제 모드 및 상세보기 상태를 관리
  const {
    state: { isDeleteMode, isAllSelected, selectedIds },
    actions: {
      setIsDeleteMode,
      handleCardClickInDeleteMode,
      handleSelectAll,
      handleCancelDeleteMode,
    },
  } = useDeleteMode(posters);

  const { handleDelete: triggerDelete } = useDeleteFeedbackToast({
    selectedIds,
    onDeleteComplete: handleCancelDeleteMode,
  });

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
  const selectedContentId = selectedPosterData?.contentId ?? null;
  const { data: modalMovieData } = useGetStoredContentDetail(selectedContentId);

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex flex-col items-center px-4 py-6 overflow-y-auto">
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
        <h1 className="text-lg font-bold text-white">피드백 콘텐츠</h1>
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
          좋아요
        </button>
        <button
          onClick={() => setTab('dislike')}
          className={`pb-2 font-semibold text-sm transition-all ${
            tab === 'dislike'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400'
          }`}
        >
          싫어요
        </button>
      </div>

      {/* 카드 리스트 */}
      <div className="w-full max-w-screen-md">
        {isEmpty ? (
          <div className="text-center text-white/60 text-sm py-10">
            현재 저장된 콘텐츠가 없습니다.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 justify-items-center">
            {posters.map((poster) => (
              // TODO: feedbackId 기반으로 복구 예정
              <PosterCard
                // key={`${poster.feedbackId ?? poster.contentId}-${index}`}
                key={poster.contentId}
                title={poster.title}
                image={poster.posterUrl}
                size="lg"
                isDeletable={isDeleteMode}
                // isSelected={
                //   poster.feedbackId !== undefined &&
                //   selectedIds.includes(poster.feedbackId)
                // }
                // onClick={() => handleCardClick(poster)}
                isSelected={
                  // TODO: feedbackId가 백에서 내려오면 아래 조건을 다시 수정
                  selectedIds.includes(poster.contentId)
                }
                onClick={() => handleCardClick(poster)}
              />
            ))}
            <div ref={observerRef} className="h-1 w-full col-span-full" />
          </div>
        )}
      </div>

      {/* 삭제 바 */}
      {isDeleteMode && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-gray-700 h-[80px] px-4 flex items-center justify-between z-[100] w-full max-w-160">
          <p className="text-white text-sm">삭제할 콘텐츠를 선택하세요.</p>
          <button
            onClick={() => {
              if (selectedIds.length > 0) {
                triggerDelete();
              }
            }}
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
