'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence, type PanInfo } from 'framer-motion';
import { Ticket } from '@/components/Recommend/Ticket';
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
    <div className="relative flex flex-col w-full h-full items-center justify-center text-white px-4">
      {/* 안내 멘트 */}
      <div className="absolute top-4 text-center z-20">
        <p className="md:text-lg  text-[16px] font-semibold leading-relaxed text-white ">
          👀 <strong>눈 버튼</strong>을 눌러 상세 정보를 확인하고 <br />
          🔄 <strong>리롤 버튼(1회)</strong>으로 다른 콘텐츠도 확인이 가능해요!
        </p>
      </div>

      {/* 카드 슬라이더 */}
      <div className="relative h-[70%] md:h-[80%] w-[80%] min-w-70 min-h-130 flex items-center justify-center mt-10">
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
              className="
                  absolute my-4
                  min-w-[280px] min-h-[480px]
                  max-w-[400px] max-h-[680px]  w-[80svw] h-[65svh] md:w-full md:h-full
                "
            >
              {isCenter ? (
                <div className="relative w-full h-full">
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
                </div>
              ) : (
                <div className="relative w-full h-[calc(100%-20px)]">
                  <Ticket movie={movie} variant="result" feedback="neutral" />
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
                          rerollUsed[idx] ? 'text-gray-400' : 'text-black'
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
      <Button
        variant="default"
        className=" md:mt-2 px-8 py-4  text-sm md:text-lg font-semibold rounded-xl bg-white text-black hover:bg-white/90 transition"
        onClick={onNext}
      >
        계속
      </Button>
    </div>
  );
}
