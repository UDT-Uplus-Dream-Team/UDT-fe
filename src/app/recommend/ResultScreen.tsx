'use client';

import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { RefreshCw, Plus, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Ticket } from '@components/Ticket/Ticket';
import { Button } from '@components/ui/button';
import { dummyMovies } from './moviedata';
import { TicketComponent } from '@type/recommend/TicketComponent';

export const ResultScreen: React.FC = () => {
  const [movies, setMovies] = useState<TicketComponent[]>([]);
  const [rerollUsed, setRerollUsed] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [rerollCount, setRerollCount] = useState([0, 0, 0]);
  const [isFlipped, setIsFlipped] = useState<boolean[]>([false, false, false]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMovies(dummyMovies.slice(0, 3));
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleReroll = (idx: number) => {
    if (rerollUsed[idx] || movies.length < 3 || dummyMovies.length < 6) return;

    // 1단계: 카운터만 증가시켜서 exit 애니메이션 트리거
    setRerollCount((prev) => {
      const copy = [...prev];
      copy[idx] = copy[idx] + 1;
      return copy;
    });

    // 2단계: exit 애니메이션 완료 후 새로운 데이터로 교체
    setTimeout(() => {
      const next = [...movies];
      next[idx] = dummyMovies[idx + 3];
      setMovies(next);

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
    const movie = movies[currentIndex];
    if (movie) console.log('추가된 콘텐츠:', movie);
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 50 && currentIndex > 0) setCurrentIndex((i) => i - 1);
    else if (info.offset.x < -50 && currentIndex < movies.length - 1)
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

  if (isLoading) return <LoadingScreen />;

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
          {movies.map((movie, idx) => {
            const pos = getCardPosition(idx);
            const isCenter = idx === currentIndex;
            return (
              <motion.div
                key={movie.contentId}
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
                        key={`reroll-${movie.contentId}-${rerollCount[idx]}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                      >
                        {/* 플립 애니메이션용 AnimatePresence */}
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={`flip-${movie.contentId}-${
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
                              movie={movie}
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
                    <Ticket movie={movie} variant="result" feedback="neutral" />
                  </div>
                )}

                {isCenter && (
                  <div className="absolute -top-2 -right-2 flex gap-2 z-50">
                    {/* 상세보기 버튼 */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleFlip(idx)}
                    >
                      <Button variant="outline" size="icon">
                        {isFlipped[idx] ? (
                          <EyeOff className="w-4 h-4 text-black" />
                        ) : (
                          <Eye className="w-4 h-4 text-black" />
                        )}
                      </Button>
                    </motion.button>

                    {/* 리롤 버튼 */}
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReroll(idx)}
                      disabled={rerollUsed[idx]}
                    >
                      <Button variant="outline" size="icon">
                        <RefreshCw
                          className={`w-4 h-4 ${
                            rerollUsed[idx] ? 'text-gray-60' : 'text-black'
                          }`}
                        />
                      </Button>
                    </motion.button>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Add Content Button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleAddContent}
            className="px-8 py-3 bg-gray-40 hover:bg-gray-60 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">이 콘텐츠 추가하기</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
