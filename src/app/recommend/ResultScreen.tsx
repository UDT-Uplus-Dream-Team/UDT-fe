'use client';

import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { RefreshCw, Plus, Eye, EyeOff, Undo2 } from 'lucide-react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Ticket } from '@components/Ticket/Ticket';
import { Button } from '@components/ui/button';
import { dummyMovies } from './ContentList';
import { TicketComponent } from '@type/recommend/TicketComponent';
import { getCuratedContents } from '@lib/apis/recommend/getCuratedContents';
import { useRecommendStore } from '@store/useRecommendStore';

export const ResultScreen: React.FC = () => {
  const {
    setPhase,
    curatedContents,
    setCuratedContents,
    isResultLoading,
    setIsResultLoading,
  } = useRecommendStore();

  const [contents, setContents] = useState<TicketComponent[]>([]);
  const [rerollUsed, setRerollUsed] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [rerollCount, setRerollCount] = useState([0, 0, 0]);
  const [isFlipped, setIsFlipped] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const fetchCuratedContents = async (): Promise<void> => {
      try {
        setIsResultLoading(true);

        // API 호출과 최소 3초 대기를 동시에 시작
        const [response] = await Promise.all([
          getCuratedContents(),
          new Promise((resolve) => setTimeout(resolve, 3000)), // 3초 최소 대기
        ]);

        if (response.success && response.data.length > 0) {
          setCuratedContents(response.data);
          setContents(response.data.slice(0, 3));
        } else {
          // API 실패 시 fallback으로 더미 데이터
          console.warn(
            '큐레이션 데이터 로드 실패, 더미 데이터 사용:',
            response.message,
          );
          setContents(dummyMovies.slice(0, 3));
        }

        setIsResultLoading(false);
      } catch (error: unknown) {
        console.error('큐레이션 콘텐츠 로드 중 오류:', error);
        // 에러 시 fallback으로 더미 데이터
        setContents(dummyMovies.slice(0, 3));
        setIsResultLoading(false);
      }
    };

    fetchCuratedContents();
  }, []);

  const handleReroll = (idx: number) => {
    if (rerollUsed[idx] || curatedContents.length < 3 || dummyMovies.length < 6)
      return;

    // 1단계: 카운터만 증가시켜서 exit 애니메이션 트리거
    setRerollCount((prev) => {
      const copy = [...prev];
      copy[idx] = copy[idx] + 1;
      return copy;
    });

    // 2단계: exit 애니메이션 완료 후 새로운 데이터로 교체
    setTimeout(() => {
      const next = [...curatedContents];
      if (curatedContents.length >= 6) next[idx] = curatedContents[idx + 3];
      else next[idx] = dummyMovies[idx + 3];
      setContents(next);

      setRerollUsed((prev) => {
        const copy = [...prev];
        copy[idx] = true;
        return copy;
      });
    }, 300); // exit 애니메이션 duration과 맞춤
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
    if (movie) console.log('추가된 콘텐츠:', movie);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 50 && currentIndex > 0) setCurrentIndex((i) => i - 1);
    else if (info.offset.x < -50 && currentIndex < contents.length - 1)
      setCurrentIndex((i) => i + 1);
  };

  const getCardPosition = (idx: number) => {
    const diff = idx - currentIndex;
    return {
      x: diff * 300,
      scale: diff === 0 ? 1 : 0.8,
      opacity: diff === 0 ? 1 : 0.6,
      zIndex: diff === 0 ? 10 : 1,
    };
  };

  if (isResultLoading) return <LoadingScreen />;

  return (
    <div className="flex min-h-full items-center justify-center">
      {/* overflow-hidden 제거 */}
      <div className="w-full">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2">추천 결과</h1>
          <p className="text-gray-600">마음에 드는 콘텐츠를 선택해보세요</p>
        </div>

        {/* Carousel Container */}
        <div className="relative h-[600px] py-5 flex items-center justify-center">
          {contents.map((content, idx) => {
            const pos = getCardPosition(idx);
            const isCenter = idx === currentIndex;
            return (
              <motion.div
                key={content.contentId}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0}
                onDragEnd={handleDragEnd}
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  x: pos.x,
                  scale: pos.scale,
                  opacity: pos.opacity,
                  zIndex: pos.zIndex,
                }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="absolute w-80 h-full flex flex-col items-center"
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
                  // 비중앙 카드는 static 렌더
                  <div className="relative w-full h-full">
                    <Ticket
                      movie={content}
                      variant="result"
                      feedback="neutral"
                    />
                  </div>
                )}

                {isCenter && (
                  <div className="absolute -top-2 -right-2 flex gap-2 z-50">
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
                        disabled={rerollUsed[idx]}
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${
                            rerollUsed[idx] ? 'text-gray-60' : 'text-black'
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

        {/* Add Content Button */}
        <div className="flex justify-center mt-8 gap-4">
          <Button
            onClick={handleAddContent}
            className="px-8 py-3 bg-primary-500 text-white rounded-full shadow-lg flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">이 콘텐츠 추가하기</span>
          </Button>

          <Button
            onClick={() => {
              setPhase('start');
            }}
            className="px-8 py-3 bg-primary-500 text-white rounded-full shadow-lg flex items-center gap-2"
          >
            <Undo2 className="w-5 h-5" />
            다시 추천받기
          </Button>
        </div>
      </div>
    </div>
  );
};
