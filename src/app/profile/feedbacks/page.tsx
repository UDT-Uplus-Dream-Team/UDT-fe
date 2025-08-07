'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PosterCard } from '@components/explore/PosterCard';
import { ChevronLeft, Pencil } from 'lucide-react';
import MovieDetailModal from '@components/profile/MovieDetailModal';
import { useDeleteMode } from '@hooks/profile/useDeleteMode';
import { usePosterModal } from '@hooks/usePosterModal';
import { useInfiniteFeedbacks } from '@hooks/profile/useInfiniteFeedbacks';
import { useGetStoredContentDetail } from '@hooks/profile/useGetStoredContentDetail';
import { FeedbackContent } from '@type/profile/FeedbackContent';
import { useDeleteFeedback } from '@hooks/profile/useDeleteFeedback';
import { usePageStayTracker } from '@hooks/usePageStayTracker';
import { useDeleteToast } from '@hooks/profile/useDeleteToast';

const FeedbackPage = () => {
  // 페이지 머무르는 시간 추적 (피드백 페이지 추적 / Google Analytics 연동을 위함)
  usePageStayTracker('profile_feedback');

  const router = useRouter();
  const [tab, setTab] = useState<'like' | 'dislike'>('like');

  //무한 스크롤을 통한 데이터 연동
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
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

  //무한 스크롤
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

  const triggerIndex = Math.max(posters.length - 8, 0);

  //삭제 모드에 대한 관리
  const {
    state: { isDeleteMode, isAllSelected, selectedIds },
    actions: {
      setIsDeleteMode,
      handleCardClickInDeleteMode,
      handleSelectAll,
      handleCancelDeleteMode,
    },
  } = useDeleteMode(posters, (item) => item.feedbackId);

  // 탭 변경 시 삭제 모드 자동 종료
  useEffect(() => {
    handleCancelDeleteMode();
  }, [tab]);

  // 실제 삭제 api 연동 토스토 확인 시 삭제 되도록 구성
  const { mutateAsync: deleteFeedback } = useDeleteFeedback();

  // 배열 삭제로 수정
  const { handleDelete } = useDeleteToast({
    selectedIds,
    onDeleteComplete: handleCancelDeleteMode,
    deleteFn: deleteFeedback,
  });

  //상세보기를 위한 모달 처리
  const {
    state: { selectedPosterData },
    actions: { openModal, closeModal },
  } = usePosterModal();

  //삭제모드 시 클릭하면 삭제 토글, 일반 상태시 선택 상세보기 처리
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
    <div className="h-full w-full flex flex-col items-center px-4 py-6 overflow-y-auto">
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
      <div className="relative w-full max-w-screen-md min-h-[70Svh]">
        {isLoading ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-white">데이터를 불러오는 중...</p>
            </div>
          </div>
        ) : isEmpty ? (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white md:text-m  text-sm font-medium">
            현재 저장된 콘텐츠가 없습니다
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 justify-items-center">
            {posters.map((poster, index) => (
              <PosterCard
                key={poster.feedbackId ?? poster.contentId}
                ref={index === triggerIndex ? observerRef : null}
                title={poster.title}
                image={poster.posterUrl}
                size="lg"
                isDeletable={isDeleteMode}
                isSelected={
                  poster.feedbackId !== undefined &&
                  selectedIds.includes(poster.feedbackId)
                }
                onClick={() => handleCardClick(poster)}
              />
            ))}
          </div>
        )}
      </div>

      {/* 삭제 바 */}
      {isDeleteMode && (
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 bg-gray-700 h-[80px] px-4 flex items-center justify-between z-50 w-full max-w-160">
          <p className="text-white text-sm">삭제할 콘텐츠를 선택하세요.</p>
          <button
            onClick={() => {
              if (selectedIds.length > 0) {
                handleDelete();
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
