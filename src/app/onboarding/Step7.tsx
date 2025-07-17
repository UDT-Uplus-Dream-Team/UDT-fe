'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Plus, Eye, EyeOff, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Ticket } from '@components/Ticket/Ticket';
import { Button } from '@components/ui/button';
import { TicketComponent } from '@type/recommend/TicketComponent';
import { MockMovies } from './moviedata';

interface Step7Props {
  onNext: () => void;
}

export default function Step7({ onNext }: Step7Props) {
  const [movies, setMovies] = useState<TicketComponent[]>([]);
  const [rerollUsed, setRerollUsed] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [isFlipped, setIsFlipped] = useState<boolean[]>([false, false, false]);
  const [currentIndex, setCurrentIndex] = useState(1);

  useEffect(() => {
    setMovies(MockMovies.slice(0, 3));
  }, []);

  const handleFlip = (idx: number) => {
    setIsFlipped((prev) => {
      const copy = [...prev];
      copy[idx] = !copy[idx];
      return copy;
    });
  };

  const handleReroll = (idx: number) => {
    if (rerollUsed[idx] || MockMovies.length < 6) return;
    const next = [...movies];
    next[idx] = MockMovies[idx + 3];
    setMovies(next);

    setRerollUsed((prev) => {
      const copy = [...prev];
      copy[idx] = true;
      return copy;
    });

    setIsFlipped((prev) => {
      const copy = [...prev];
      copy[idx] = false;
      return copy;
    });
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#0b0c32] via-[#4b3381] to-[#a96fd1] text-white px-4 relative">
      {/* 안내 멘트 */}
      <div className="absolute top-4 text-center z-20">
        <p className="text-lg font-semibold leading-relaxed text-white mt-8">
          👀 <strong>눈 버튼</strong>을 눌러 상세 정보를 확인하고 <br />
          🔄 <strong>리롤 버튼(1회)</strong>으로 다른 콘텐츠도 확인해보세요!
        </p>
        <ArrowDown className="w-6 h-6 text-gray-500 mt-2 animate-bounce mx-auto" />
      </div>

      {/* 카드 슬라이더 */}
      <div className="relative h-[600px] mt-20 py-5 flex items-center justify-center w-full">
        {movies.map((movie, idx) => {
          const pos = getCardPosition(idx);
          const isCenter = idx === currentIndex;
          return (
            <motion.div
              key={`${movie.contentId}-${rerollUsed[idx]}-${isFlipped[idx]}`}
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
              className="absolute w-80 h-full flex flex-col items-center"
            >
              <motion.div className="relative w-full h-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`flip-${movie.contentId}-${isFlipped[idx]}`}
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
                  >
                    <Button
                      variant="outline"
                      size="icon"
                      disabled={rerollUsed[idx]}
                    >
                      <RefreshCw
                        className={`w-4 h-4 ${
                          rerollUsed[idx] ? 'text-gray-400' : 'text-black'
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

      {/* 콘텐츠 추가 버튼 */}
      <div className="flex justify-center mt-8">
        <Button
          onClick={() => {
            onNext();
          }}
          className="px-8 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full shadow-lg flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">
            콘텐츠 추가 버튼 눌러 추천 받은 컨텐츠 저장해보기!
          </span>
        </Button>
      </div>
    </div>
  );
}
