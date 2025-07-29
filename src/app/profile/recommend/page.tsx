'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, Pencil } from 'lucide-react';
import { usePosterModal } from '@/hooks/usePosterModal';
import { useInfiniteCuratedContents } from '@hooks/profile/useInfiniteCuratedContents';
import { useGetStoredContentDetail } from '@hooks/profile/useGetStoredContentDetail';
import { PosterCard } from '@components/explore/PosterCard';
import MovieDetailModal from '@components/profile/MovieDetailModal';
import { useDeleteMode } from '@hooks/profile/useDeleteMode';
import { useDeleteCurated } from '@hooks/profile/useDeleteCurated';
import { usePageStayTracker } from '@hooks/usePageStayTracker';
import { useDeleteToast } from '@/hooks/profile/useDeleteToast';

const RecommendPage = () => {
  // 페이지 머무르는 시간 추적 (저장된 엄선된 콘텐츠 조회하는 페이지 추적 / Google Analytics 연동을 위함)
  usePageStayTracker('profile_recommend');

  const router = useRouter();

  // 상세보기 모달 관련 상태 및 액션 훅
  const {
    state: { selectedPosterData },
    actions: { openModal, closeModal },
  } = usePosterModal();

  // 무한스크롤 API 호출
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCuratedContents({ size: 20 });

  const posters = useMemo(
    () => data?.pages.flatMap((page) => page.item) ?? [],
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
  }, [hasNextPage, isFetchingNextPage, isEmpty]);

  // 상세보기 데이터 contentid로 찾아서 데이터 보여줌
  const selectedContentId = selectedPosterData?.contentId ?? null;
  const { data: modalMovieData } = useGetStoredContentDetail(selectedContentId);

  //삭제 모드 및 상세보기 상태를 관리
  const {
    state: { isDeleteMode, isAllSelected, selectedIds },
    actions: {
      setIsDeleteMode,
      handleCardClickInDeleteMode,
      handleSelectAll,
      handleCancelDeleteMode,
    },
  } = useDeleteMode(posters, (item) => item.contentId);

  const handleCardClick = (poster: (typeof posters)[number]) => {
    if (isDeleteMode) {
      handleCardClickInDeleteMode(poster);
    } else {
      openModal(poster);
    }
  };

  // 삭제 api 연동
  const { mutateAsync: deleteCurated } = useDeleteCurated();

  const { handleDelete } = useDeleteToast({
    selectedIds,
    onDeleteComplete: handleCancelDeleteMode,
    deleteFn: deleteCurated,
    isBatch: true,
  });

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
              aria-label="편집"
            >
              <Pencil size={20} />
            </button>
          )}
        </div>
      </div>

      {/* 카드 영역 */}
      <div className="w-full max-w-screen-md">
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm font-medium">
            현재 저장된 추천 콘텐츠가 없습니다
          </div>
        ) : (
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
            <div ref={observerRef} className="h-1 w-full" />
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

export default RecommendPage;
