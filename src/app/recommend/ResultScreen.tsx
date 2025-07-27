'use client';

import React, { useState, useEffect, useRef } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { RefreshCw, Plus, Eye, EyeOff, Undo2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Ticket } from '@components/Ticket/Ticket';
import { Button } from '@components/ui/button';
import { TicketComponent } from '@type/recommend/TicketComponent';
import { useRecommendStore } from '@store/useRecommendStore';
import {
  useGetCuratedContents,
  useRefreshCuratedContents,
} from '@hooks/recommend/useGetCuratedContents';
import { useQueryClient } from '@tanstack/react-query';
import { usePostCuratedContent } from '@hooks/recommend/usePostCuratedContents';

export const ResultScreen: React.FC = () => {
  const queryClient = useQueryClient();
  const { forceRefresh } = useRefreshCuratedContents();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [dist, setDist] = useState(136);

  // Zustand: UI 상태만
  const {
    setPhase,
    addSavedCuratedContent,
    removeSavedCuratedContent,
    isSavedCuratedContent,
    initializeSavedContentIds,
  } = useRecommendStore();

  // TanStack Query: API 상태만
  const {
    data: curatedContents = [],
    isLoading,
    isError,
    error,
    isFetching,
  } = useGetCuratedContents();

  const { mutate: saveCuratedContent, isPending } = usePostCuratedContent({
    onOptimisticUpdate: (contentId: number) => {
      const curatedIndex = findCuratedIndex(contentId);
      if (curatedIndex !== -1) {
        addSavedCuratedContent(curatedIndex);
      }
    },

    onOptimisticRevert: (contentId: number) => {
      const curatedIndex = findCuratedIndex(contentId);
      if (curatedIndex !== -1) {
        removeSavedCuratedContent(curatedIndex);
      }
    },
  });

  const findCuratedIndex = (contentId: number): number => {
    return curatedContents.findIndex(
      (content) => content.contentId === contentId,
    );
  };

  // 로컬 UI 상태들
  const [contents, setContents] = useState<TicketComponent[]>([]);
  const [rerollUsed, setRerollUsed] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [rerollCount, setRerollCount] = useState([0, 0, 0]);
  const [isFlipped, setIsFlipped] = useState<boolean[]>([false, false, false]);
  const [showLoadingScreen, setShowLoadingScreen] = useState(() => {
    const cachedData = queryClient.getQueryData(['curatedContents']);
    return !cachedData;
  });
  const [forceLoading, setForceLoading] = useState(false);

  useEffect(() => {
    if (showLoadingScreen) return;
    if (!containerRef.current) return;

    const update = () => {
      if (containerRef.current) {
        setDist(containerRef.current.offsetWidth * 0.4);
      }
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [showLoadingScreen]);

  // 큐레이션 데이터가 로드되면 contents 설정
  useEffect(() => {
    if (curatedContents.length > 0) {
      setContents(curatedContents.slice(0, 3));
      initializeSavedContentIds(curatedContents.length);

      // forceLoading 해제
      if (forceLoading) {
        setForceLoading(false);
      }

      // 최소 3초 로딩 화면 표시 (UX 개선)
      if (showLoadingScreen) {
        const timer = setTimeout(() => {
          setShowLoadingScreen(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [curatedContents, showLoadingScreen, forceLoading]);

  const isCurrentContentSaved = (): boolean => {
    const currentMovie = contents[currentIndex];
    if (!currentMovie) return false;

    const curatedIndex = findCuratedIndex(currentMovie.contentId);
    return curatedIndex !== -1 ? isSavedCuratedContent(curatedIndex) : false;
  };

  const handleReroll = (idx: number) => {
    if (rerollUsed[idx] || curatedContents.length < 6) return;

    // 1단계: 카운터 증가로 exit 애니메이션 트리거
    setRerollCount((prev) => {
      const copy = [...prev];
      copy[idx] = copy[idx] + 1;
      return copy;
    });

    // 2단계: 애니메이션 완료 후 새 데이터로 교체
    setTimeout(() => {
      const next = [...contents];
      next[idx] = curatedContents[idx + 3];
      setContents(next);

      setRerollUsed((prev) => {
        const copy = [...prev];
        copy[idx] = true;
        return copy;
      });
    }, 300);
  };

  const handleFlip = (idx: number) => {
    setIsFlipped((prev) => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  const handleAddContent = () => {
    const movie = contents[currentIndex];
    if (movie && !isCurrentContentSaved()) {
      saveCuratedContent(movie.contentId);
    }
  };

  const handleStartNewRecommendation = async () => {
    try {
      // 1. 로딩 상태 설정
      setForceLoading(true);
      setShowLoadingScreen(true);

      // 2. 기존 상태들 초기화
      setContents([]);
      setRerollUsed([false, false, false]);
      setCurrentIndex(1);
      setRerollCount([0, 0, 0]);
      setIsFlipped([false, false, false]);

      // 3. 새로운 timestamp로 완전히 새로운 쿼리 생성
      const newData = await forceRefresh();

      console.log('다시 추천받기: 새로운 큐레이션 데이터 로드 완료', newData);

      // 4. 시작 화면으로 이동 (새로운 데이터가 자동으로 로드됨)
      setPhase('start');
    } catch (error) {
      console.error('다시 추천받기 실패:', error);
      // 에러 발생해도 시작 화면으로 이동
      setForceLoading(false);
      setShowLoadingScreen(false);
      setPhase('start');
    }
  };

  const handleRetry = async () => {
    try {
      setShowLoadingScreen(true);
      setForceLoading(true);

      // 새로운 timestamp로 완전히 새로운 쿼리 생성
      await forceRefresh();
    } catch (error) {
      console.error('재시도 실패:', error);
      // 실패해도 로딩 상태 해제
      setForceLoading(false);
      setShowLoadingScreen(false);
    }
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 50 && currentIndex > 0) setCurrentIndex((i) => i - 1);
    else if (info.offset.x < -50 && currentIndex < contents.length - 1)
      setCurrentIndex((i) => i + 1);
  };

  const getCardPosition = (idx: number, dist: number) => {
    const diff = idx - currentIndex;
    return {
      x: diff * dist,
      scale: diff === 0 ? 1 : 0.8,
      opacity: diff === 0 ? 1 : 0.6,
      zIndex: diff === 0 ? 10 : 1,
    };
  };

  // 로딩 중이거나 최소 3초 대기 중인 경우
  if (isLoading || showLoadingScreen || forceLoading || isFetching) {
    return (
      <LoadingScreen
        message="추천 컨텐츠를 선별하고 있어요!"
        submessage="조금만 기다려주세요.."
      />
    );
  }

  // 에러 발생 시 에러 화면
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
              onClick={handleRetry}
              className="flex items-center gap-2"
              disabled={isFetching || forceLoading}
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  isFetching || forceLoading ? 'animate-spin' : ''
                }`}
              />
              {isFetching || forceLoading ? '재시도 중...' : '다시 시도'}
            </Button>
            <Button variant="outline" onClick={() => setPhase('start')}>
              처음으로
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // 콘텐츠가 없는 경우
  if (contents.length === 0) {
    return (
      <div className="flex min-h-full items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h2 className="text-2xl font-bold mb-4">추천할 콘텐츠가 없습니다</h2>
          <p className="text-gray-600 mb-6">
            다시 추천을 받아보시거나 잠시 후 시도해주세요.
          </p>
          <div className="flex gap-4 justify-center">
            <Button
              onClick={handleRetry}
              className="flex items-center gap-2"
              disabled={isFetching || forceLoading}
            >
              <RefreshCw
                className={`w-4 h-4 ${
                  isFetching || forceLoading ? 'animate-spin' : ''
                }`}
              />
              {isFetching || forceLoading ? '새로고침 중...' : '새로고침'}
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
    <div className="flex min-h-full flex-col items-center justify-center">
      {/* 제목 섹션 */}
      <div className="text-center my-5">
        <h1 className="text-3xl font-bold mb-2">추천 결과</h1>
        <p className="text-gray-600">마음에 드는 콘텐츠를 선택해보세요</p>
      </div>

      {/* Carousel Container */}
      <div
        ref={containerRef}
        className="relative h-[70%] md:h-[80%] w-[80%] min-w-70 min-h-130 max-w-100 max-h-175 flex items-center justify-center"
      >
        {contents.map((content, idx) => {
          const pos = getCardPosition(idx, dist);
          const isCenter = idx === currentIndex;
          return (
            <motion.div
              key={content.contentId}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0}
              onDragEnd={handleDragEnd}
              initial={{ opacity: 0 }}
              animate={{
                x: pos.x,
                scale: pos.scale,
                opacity: pos.opacity,
                zIndex: pos.zIndex,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="
                  absolute my-4
                  min-w-[280px] min-h-[480px]
                  max-w-[400px] max-h-[680px] w-full h-full
                "
            >
              {isCenter ? (
                <div className="relative w-full h-full">
                  {/* 리롤 애니메이션용 AnimatePresence */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`reroll-${content.contentId}-${rerollCount[idx]}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full"
                    >
                      {/* 플립 애니메이션용 AnimatePresence */}
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={`flip-${content.contentId}-${
                            isFlipped[idx] ? 'back' : 'front'
                          }`}
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
                  <Ticket movie={content} variant="result" feedback="neutral" />
                </div>
              )}

              {isCenter && (
                <div className="absolute -top-2 -right-2 flex gap-x-2 z-50">
                  {/* 상세보기 버튼 */}
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

                  {/* 리롤 버튼 */}
                  <motion.div whileTap={{ scale: 0.9 }}>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleReroll(idx)}
                      disabled={rerollUsed[idx] || curatedContents.length < 6}
                      title={
                        curatedContents.length < 6
                          ? '리롤할 추가 콘텐츠가 없습니다'
                          : rerollUsed[idx]
                            ? '이미 리롤을 사용했습니다'
                            : '다른 콘텐츠로 바꾸기'
                      }
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

      {/* Action Buttons */}
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
          disabled={forceLoading || isFetching}
          className="px-8 py-3 bg-primary-500 text-white rounded-full shadow-lg flex items-center gap-2 disabled:bg-primary-300"
        >
          <Undo2
            className={`w-5 h-5 ${
              forceLoading || isFetching ? 'animate-spin' : ''
            }`}
          />
          {forceLoading || isFetching ? '로딩 중...' : '다시 추천받기'}
        </Button>
      </div>
    </div>
  );
};
