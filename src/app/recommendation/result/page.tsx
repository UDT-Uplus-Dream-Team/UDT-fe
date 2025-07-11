'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { Ticket } from '@components/Ticket/Ticket';
import type { MovieData } from '@type/Moviedata';
import { Button } from '@components/ui/button';
import { dummyMovies } from './../moviedata';

// Mock data generator

const RecommendationResults = () => {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [rerollUsed, setRerollUsed] = useState<boolean[]>([
    false,
    false,
    false,
  ]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize movies after loading
  useEffect(() => {
    const timer = setTimeout(() => {
      // dummyMovies[0], [1], [2] 만 가져와서 보여줌
      setMovies(dummyMovies.slice(0, 3));
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleReroll = (index: number) => {
    // 이미 리롤했거나, 데이터 개수가 충분치 않으면 무시
    if (rerollUsed[index] || movies.length < 3 || dummyMovies.length < 6)
      return;

    const newMovies = [...movies];
    // index 0→dummyMovies[3], 1→[4], 2→[5]
    newMovies[index] = dummyMovies[index + 3];
    setMovies(newMovies);

    const newUsed = [...rerollUsed];
    newUsed[index] = true;
    setRerollUsed(newUsed);
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

        {/* Main content */}
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
              {/* Moon particles gathering */}
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

              {/* Final moon shape */}
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
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">추천 결과</h1>
          <p className="text-gray-600">마음에 드는 컨텐츠를 선택해보세요</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {movies.map((movie, index) => (
            <div
              key={movie.contentId}
              className="relative animate-bounce-in"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <Ticket movie={movie} variant="result" />

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleReroll(index)}
                disabled={rerollUsed[index]}
                className={`absolute -top-2 -right-2 w-8 h-8 p-0 bg-white shadow-md hover:shadow-lg transition-all ${
                  rerollUsed[index]
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:scale-110'
                }`}
              >
                <RefreshCw className={`w-4 h-4`} />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecommendationResults;
