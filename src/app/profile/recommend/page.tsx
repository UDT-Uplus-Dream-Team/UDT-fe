'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { usePosterModal } from '@/hooks/usePosterModal';
import { useInfiniteCuratedContents } from '@hooks/profile/useInfiniteCuratedContents';
import { useGetStoredContentDetail } from '@hooks/profile/useGetStoredContentDetail';
import { PosterCard } from '@components/explore/PosterCard';
import MovieDetailModal from '@components/profile/MovieDetailModal';

const RecommendPage = () => {
  const router = useRouter();

  // 상세보기 모달 관련 상태 및 액션 훅
  const {
    state: { selectedPosterData }, // 모달에 표시할 포스터 데이터
    actions: { openModal, closeModal }, // 모달 열기/닫기 액션
  } = usePosterModal();

  // 무한스크롤 API 호출
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCuratedContents({ size: 20 });

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
  }, [hasNextPage, isFetchingNextPage]);

  const posters = useMemo(
    () => data?.pages.flatMap((page) => page.item) ?? [],
    [data],
  );

  const handleCardClick = (poster: (typeof posters)[number]) => {
    openModal(poster);
  };

  //컨텐츠 아예 없을 경우 api 호출을 막음
  const isEmpty = posters.length === 0;

  // 상세보기 데이터 contentid로 찾아서 데이터 보여줌
  const selectedContentId = selectedPosterData?.contentId ?? null;
  const { data: modalMovieData } = useGetStoredContentDetail(selectedContentId);

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
        {isEmpty ? (
          <div className="flex flex-col items-center justify-center h-[calc(100vh-80px)] text-gray-400 text-sm font-medium">
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
                onClick={() => handleCardClick(poster)}
              />
            ))}
            <div ref={observerRef} className="h-1 w-full" />
          </div>
        )}
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
