'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Eye, EyeOff, Plus } from 'lucide-react';
import { motion, type PanInfo } from 'framer-motion';
import { Ticket } from '@components/Ticket/Ticket';
import { Button } from '@/components/ui/button';
import { dummyMovies } from '../moviedata';
import { ContentDetail } from '@type/ContentDetail';

const RecommendationResults: React.FC = () => {
  const [movies, setMovies] = useState<ContentDetail[]>([]);
  const [rerollUsed, setRerollUsed] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(1); // 가운데부터 시작
  const [showDetails, setShowDetails] = useState<boolean[]>([
    false,
    false,
    false,
  ]);

  // Initialize movies after loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setMovies(dummyMovies.slice(0, 3));
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleReroll = (index: number) => {
    if (rerollUsed[index] || movies.length < 3 || dummyMovies.length < 6)
      return;

    const newMovies = [...movies];
    newMovies[index] = dummyMovies[index + 3];
    setMovies(newMovies);

    const newUsed = [...rerollUsed];
    newUsed[index] = true;
    setRerollUsed(newUsed);
  };

  const toggleDetails = (index: number) => {
    const newShow = [...showDetails];
    newShow[index] = !newShow[index];
    setShowDetails(newShow);
  };

  const handleAddContent = () => {
    const movie = movies[currentIndex];
    if (movie) {
      console.log('추가된 콘텐츠 ID:', movie.contentId);
      console.log('추가된 콘텐츠 정보:', movie);
    }
  };

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    const threshold = 50;
    if (info.offset.x > threshold && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (info.offset.x < -threshold && currentIndex < movies.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const getCardPosition = (index: number) => {
    const diff = index - currentIndex;
    return {
      x: diff * 300,
      scale: diff === 0 ? 1 : 0.8,
      opacity: diff === 0 ? 1 : 0.6,
      zIndex: diff === 0 ? 10 : 1,
    };
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated stars appearing one by one */}
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full opacity-0 animate-star-appear"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.1}s`,
              }}
            />
          ))}
        </div>

        {/* Main loading content */}
        <div className="text-center text-white z-10">
          <div
            className="mb-8 animate-fade-in-up"
            style={{ animationDelay: '1s' }}
          >
            <h2 className="text-xl font-medium mb-2 animate-typing">
              추천 결과를 갖고 오고 있어요...
            </h2>
            <p
              className="text-sm opacity-80 animate-fade-in"
              style={{ animationDelay: '1.5s' }}
            >
              잠시만 기다려주세요....
            </p>
          </div>

          {/* Animated crescent moon formation */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-20 h-20">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-200 rounded-full animate-moon-particle"
                  style={{
                    animationDelay: `${2 + i * 0.2}s`,
                    left: '50%',
                    top: '50%',
                    transform: `rotate(${i * 45}deg) translateY(-40px)`,
                  }}
                />
              ))}

              <div
                className="absolute inset-0 opacity-0 animate-moon-form"
                style={{ animationDelay: '4s' }}
              >
                <div className="w-full h-full rounded-full bg-gradient-to-br from-yellow-200 to-yellow-100 shadow-lg shadow-yellow-200/30"></div>
                <div className="absolute top-1 right-1 w-16 h-16 rounded-full bg-gradient-to-br from-slate-900 to-purple-900"></div>
              </div>
            </div>
          </div>

          {/* Animated button */}
          <div
            className="opacity-0 animate-fade-in-up"
            style={{ animationDelay: '4.5s' }}
          >
            <div className="inline-block px-8 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 animate-glow">
              <span className="text-sm font-medium">반달별 시작하기</span>
            </div>
          </div>

          {/* Loading dots */}
          <div
            className="flex justify-center mt-6 space-x-1 opacity-0 animate-fade-in"
            style={{ animationDelay: '5s' }}
          >
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 bg-white/60 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full p-6 flex items-center justify-center">
      <div className="w-full">
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
                  dragConstraints={{ left: -300, right: 300 }}
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
                          } `}
                        />
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {movies.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentIndex
                  ? 'bg-blue-500 scale-125'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
            />
          ))}
        </div>

        {/* Add Content Button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={handleAddContent}
            className="px-8 py-3 bg-primary-600 hover:bg-primary-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">이 콘텐츠 추가하기</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationResults;
