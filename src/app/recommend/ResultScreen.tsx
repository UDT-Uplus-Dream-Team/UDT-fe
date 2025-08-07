'use client';

import React, { useEffect, useRef, type FC } from 'react';
import { LoadingScreen } from '../../components/common/LoadingScreen';
import { RefreshCw, Plus, Eye, EyeOff, Undo2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Ticket } from '@components/Recommend/Ticket';
import { Button } from '@components/ui/button';
import { useRecommendStore } from '@store/useRecommendStore';
import {
  useGetCuratedContents,
  useRefreshCuratedContents,
} from '@hooks/recommend/useGetCuratedContents';
import { usePostCuratedContent } from '@hooks/recommend/usePostCuratedContents';

export const ResultScreen: FC = () => {
  const { forceRefresh } = useRefreshCuratedContents();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const {
    // 전역 저장 관리
    addSavedCuratedContent,
    removeSavedCuratedContent,
    isSavedCuratedContent,

    // ResultScreen 전용 상태
    resultScreenState: { rerollUsed, isFlipped, currentIndex, contentIndices },
    setResultRerollUsed,
    setResultIsFlipped,
    setResultCurrentIndex,
    setResultContentIndex,
    initializeResultSavedContents,

    setPhase,
  } = useRecommendStore();

  const {
    data: curatedContents = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetCuratedContents();

  // 저장 뮤테이션: 전역 저장 상태 업데이트
  const { mutate: saveCuratedContent, isPending } = usePostCuratedContent({
    onOptimisticUpdate: (contentId: number) => {
      const idx = curatedContents.findIndex((c) => c.contentId === contentId);
      if (idx !== -1) addSavedCuratedContent(idx);
    },
    onOptimisticRevert: (contentId: number) => {
      const idx = curatedContents.findIndex((c) => c.contentId === contentId);
      if (idx !== -1) removeSavedCuratedContent(idx);
    },
  });

  // 초기화: 로드된 만큼 전역 savedContentIds도 초기화
  useEffect(() => {
    if (curatedContents.length > 0) {
      initializeResultSavedContents(curatedContents.length);
    }
  }, [curatedContents, initializeResultSavedContents]);

  const getDist = () =>
    containerRef.current ? containerRef.current.offsetWidth * 0.4 : 136;
  const dist = getDist();

  const getCardPosition = (posIdx: number) => {
    const diff = posIdx - currentIndex;
    return {
      x: diff * dist,
      scale: diff === 0 ? 1 : 0.8,
      opacity: diff === 0 ? 1 : 0.6,
      zIndex: diff === 0 ? 10 : 1,
    };
  };

  // 전역 저장 여부 조회
  const isCurrentContentSaved = () => {
    const contentIdx = contentIndices[currentIndex];
    return isSavedCuratedContent(contentIdx);
  };

  const handleReroll = (idx: number) => {
    if (rerollUsed[idx] || curatedContents.length < 6) return;
    setResultRerollUsed(idx, true);
    setTimeout(() => {
      setResultContentIndex(idx, idx + 3);
    }, 300);
  };

  const handleFlip = (idx: number) => {
    setResultIsFlipped(idx, !isFlipped[idx]);
  };

  const handleAddContent = () => {
    const contentIdx = contentIndices[currentIndex];
    const movie = curatedContents[contentIdx];
    if (movie && !isCurrentContentSaved()) {
      saveCuratedContent(movie.contentId);
    }
  };

  const handleStartNewRecommendation = async () => {
    try {
      await forceRefresh();
    } finally {
      setPhase('start');
    }
  };

  // 플립 여부와 상관없이, 중앙 카드일 때만 드래그 허용
  const handleDragEnd = (_: unknown, info: PanInfo) => {
    let newIndex = currentIndex;
    if (info.offset.x > 50 && currentIndex > 0) {
      newIndex = currentIndex - 1;
    } else if (
      info.offset.x < -50 &&
      currentIndex < contentIndices.length - 1
    ) {
      newIndex = currentIndex + 1;
    }
    // 클램프
    newIndex = Math.max(0, Math.min(newIndex, contentIndices.length - 1));
    setResultCurrentIndex(newIndex);
  };

  if (isLoading || isFetching) {
    return (
      <LoadingScreen
        message="추천 컨텐츠를 선별하고 있어요!"
        submessage="조금만 기다려주세요.."
      />
    );
  }
  if (isError) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">
            데이터를 불러올 수 없습니다
          </h2>
          <p className="text-gray-600 mb-6">
            {error?.message || '알 수 없는 오류가 발생했습니다.'}
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => forceRefresh()}
              disabled={isFetching}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`}
              />
              {isFetching ? '재시도 중...' : '다시 시도'}
            </Button>
            <Button variant="outline" onClick={() => setPhase('start')}>
              처음으로
            </Button>
          </div>
        </div>
      </div>
    );
  }
  if (curatedContents.length === 0) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">추천할 콘텐츠가 없습니다</h2>
          <p className="text-gray-600 mb-6">
            다시 추천을 받아보시거나 잠시 후 시도해주세요.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={() => forceRefresh()}
              disabled={isFetching}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`}
              />
              {isFetching ? '새로고침 중...' : '새로고침'}
            </Button>
            <Button variant="outline" onClick={() => setPhase('start')}>
              다시 추천받기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full flex-col justify-center overflow-y-auto overflow-x-hidden">
      <div className="text-center py-5">
        <h1 className="text-2xl font-bold mb-1">추천 결과</h1>
        <p className="text-gray-500">마음에 드는 콘텐츠를 선택해보세요</p>
      </div>
      <div className="flex-grow h-[60%] w-full min-h-110 max-h-175 flex items-center justify-center px-4">
        <div
          ref={containerRef}
          className="relative h-full w-[80%] min-w-70 max-w-100 flex items-center justify-center touch-pan-y"
        >
          {contentIndices.map((contentIdx, idx) => {
            const content = curatedContents[contentIdx];
            const pos = getCardPosition(idx);
            const isCenter = idx === currentIndex;

            return (
              <motion.div
                key={content.contentId}
                drag={isCenter ? 'x' : false}
                dragMomentum={false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0}
                onDragStart={() => {
                  document.body.style.overflow = 'hidden';
                }}
                onDragEnd={(e, info) => {
                  document.body.style.overflow = '';
                  handleDragEnd(e, info);
                }}
                initial={{ opacity: 0 }}
                animate={{
                  x: pos.x,
                  scale: pos.scale,
                  opacity: pos.opacity,
                  zIndex: pos.zIndex,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 400, // ExplorePageCarousel과 동일
                  damping: 40, // ExplorePageCarousel과 동일
                }}
                className={`absolute my-4 min-w-[280px] min-h-[440px] max-w-[400px] max-h-[680px] w-full h-full ${
                  !isCenter ? 'pointer-events-none' : ''
                }`}
                style={{
                  transformStyle: 'preserve-3d',
                  touchAction: isCenter ? 'pan-x' : 'none',
                  cursor: isCenter ? 'grab' : 'default',
                  userSelect: 'none',
                }}
                whileDrag={{
                  cursor: 'grabbing', // 드래그 중 커서 변경
                }}
              >
                {isCenter ? (
                  <div className="relative w-full h-full">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={`reroll-${content.contentId}-${rerollUsed[idx]}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`flip-${content.contentId}-${isFlipped[idx]}`}
                            initial={{ rotateY: isFlipped[idx] ? 90 : -90 }}
                            animate={{ rotateY: 0 }}
                            exit={{ rotateY: isFlipped[idx] ? -90 : 90 }}
                            transition={{ duration: 0.2 }}
                            className="w-full h-full"
                            style={{ transformStyle: 'preserve-3d' }}
                          >
                            <Ticket
                              movie={content}
                              variant={isFlipped[idx] ? 'detail' : 'result'}
                              feedback="neutral"
                            />
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="relative w-full h-[calc(100%-20px)]">
                    <Ticket
                      movie={content}
                      variant="result"
                      feedback="neutral"
                    />
                  </div>
                )}

                {isCenter && (
                  <div className="absolute -top-2 -right-2 flex gap-x-2 z-50">
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleFlip(idx)}
                      >
                        {isFlipped[idx] ? (
                          <EyeOff className="w-4 h-4 text-black" />
                        ) : (
                          <Eye className="w-4 h-4 text-black" />
                        )}
                      </Button>
                    </motion.div>
                    <motion.div whileTap={{ scale: 0.9 }}>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleReroll(idx)}
                        disabled={rerollUsed[idx] || curatedContents.length < 6}
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${
                            rerollUsed[idx] || curatedContents.length < 6
                              ? 'text-gray-400'
                              : 'text-black'
                          }`}
                        />
                      </Button>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
      <div className="flex justify-center gap-4 my-5">
        <Button
          onClick={handleAddContent}
          disabled={isCurrentContentSaved() || isPending}
          className={`px-8 py-3 rounded-full shadow-lg flex items-center gap-2 ${
            isCurrentContentSaved()
              ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
              : isPending
                ? 'bg-primary-300 text-white'
                : 'bg-primary-500 text-white hover:bg-primary-600'
          }`}
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">
            {isCurrentContentSaved()
              ? '저장 완료'
              : isPending
                ? '저장 중...'
                : '이 콘텐츠 추가하기'}
          </span>
        </Button>
        <Button
          onClick={handleStartNewRecommendation}
          disabled={isFetching}
          className="px-8 py-3 bg-primary-500 text-white rounded-full shadow-lg flex items-center gap-2 disabled:bg-primary-300"
        >
          <Undo2 className={`w-5 h-5 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? '로딩 중...' : '다시 추천받기'}
        </Button>
      </div>
    </div>
  );
};
