// components/ResultScreen.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { LoadingScreen } from './LoadingScreen';
import { RefreshCw, Eye, EyeOff, Plus } from 'lucide-react';
import { motion, type PanInfo } from 'framer-motion';
import { Ticket } from '@components/Ticket/Ticket';
import type { MovieData } from '@type/Moviedata';
import { Button } from '@/components/ui/button';
import { dummyMovies } from './moviedata';

export const ResultScreen: React.FC = () => {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [rerollUsed, setRerollUsed] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [showDetails, setShowDetails] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMovies(dummyMovies.slice(0, 3));
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleReroll = (idx: number) => {
    if (rerollUsed[idx] || movies.length < 3 || dummyMovies.length < 6) return;
    const next = [...movies];
    next[idx] = dummyMovies[idx + 3];
    setMovies(next);
    setRerollUsed((u) => {
      u[idx] = true;
      return [...u];
    });
  };

  const toggleDetails = (idx: number) => {
    setShowDetails((s) => {
      s[idx] = !s[idx];
      return [...s];
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

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-full flex items-center justify-center">
      <div className="w-full overflow-hidden">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold mb-2">추천 결과</h1>
          <p className="text-gray-600">마음에 드는 컨텐츠를 선택해보세요</p>
        </div>
        {/* Carousel Container (높이 고정) */}
        <div className="relative h-[600px] py-5 flex items-center justify-center">
          <div className="flex items-center justify-center">
            {movies.map((movie, index) => {
              const pos = getCardPosition(index);
              const isCenter = index === currentIndex;

              return (
                <motion.div
                  key={movie.contentId}
                  className="absolute w-80 h-full flex flex-col items-center overflow-visible"
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0}
                  onDragEnd={handleDragEnd}
                  animate={{
                    x: pos.x,
                    scale: pos.scale,
                    opacity: pos.opacity,
                    zIndex: pos.zIndex,
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  {/* Ticket을 flex-1 래퍼로 감싸서 부모 높이 전파 */}
                  <div className="relative flex-1 w-full">
                    <Ticket
                      movie={movie}
                      variant={showDetails[index] ? 'detail' : 'result'}
                      feedback="neutral"
                    />
                  </div>

                  {/* 중앙 카드에만 보여질 컨트롤 버튼 */}
                  {isCenter && (
                    <motion.div
                      className="absolute -top-2 -right-2 flex gap-2 z-50"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, ease: 'linear' }}
                    >
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleDetails(index)}
                        className="w-8 h-8 p-0 bg-white shadow-md hover:shadow-lg transition-all hover:scale-110"
                      >
                        {showDetails[index] ? (
                          <EyeOff className="w-4 h-4 text-black" />
                        ) : (
                          <Eye className="w-4 h-4 text-black" />
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReroll(index)}
                        disabled={rerollUsed[index]}
                        className={`w-8 h-8 p-0 bg-white shadow-md transition-all ${
                          rerollUsed[index]
                            ? 'opacity-50 cursor-not-allowed'
                            : 'hover:shadow-lg hover:scale-110'
                        }`}
                      >
                        <RefreshCw
                          className={`w-4 h-4 ${
                            rerollUsed[index] ? 'text-gray-60' : 'text-black'
                          }`}
                        />
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
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
