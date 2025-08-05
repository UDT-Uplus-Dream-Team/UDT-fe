'use client';

import { Button } from '@components/ui/button';
import { CheckCircle, RotateCcw, Eye } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRecommendStore } from '@store/useRecommendStore';
import { useQueryClient } from '@tanstack/react-query';
import { useRefreshCuratedContents } from '@/hooks/recommend/useGetCuratedContents';
import { LoadingScreen } from './LoadingScreen';

export const FinishScreen: React.FC = () => {
  const { setPhase } = useRecommendStore();
  const { forceRefresh } = useRefreshCuratedContents();
  const queryClient = useQueryClient();

  // 상태 관리
  const [isLoadingResults, setIsLoadingResults] = useState(false);
  const [showContent, setShowContent] = useState(false);

  // 컴포넌트 마운트 시 등장 애니메이션 시작
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleViewResults = async () => {
    setIsLoadingResults(true);

    try {
      // 최소 2초 로딩 시간 보장
      await Promise.all([
        forceRefresh(),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);

      setPhase('result');
    } catch (error) {
      console.error('FinishScreen에서 큐레이션 콘텐츠 새로고침 실패:', error);
      // 에러 발생 시에도 최소 로딩 시간 유지
      await new Promise((resolve) => setTimeout(resolve, 2000));
      setPhase('result');
    } finally {
      setIsLoadingResults(false);
    }
  };

  const handleStartAgain = async () => {
    queryClient.removeQueries({ queryKey: ['curatedContents'] });
    setPhase('start');
  };

  // 로딩 상태일 때 LoadingScreen 표시
  if (isLoadingResults) {
    return (
      <LoadingScreen
        message="추천 결과를 불러오고 있어요!"
        submessage="곧 완성된 결과를 보여드릴게요..."
      />
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      {showContent && (
        <motion.div
          className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Success icon */}
          <motion.div
            className="w-20 h-20 bg-yellow-400 rounded-full flex items-center justify-center mb-8 shadow-lg"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.3,
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, delay: 0.8 }}
            >
              <CheckCircle className="w-10 h-10 text-purple-900" />
            </motion.div>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            className="text-2xl font-bold text-white mb-4 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            추천이 완료되었습니다!
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            className="text-purple-200 text-base mb-12 leading-relaxed max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            당신만을 위한 맞춤 콘텐츠를 준비했어요.
            <br />
            지금 바로 확인해보세요!
          </motion.p>

          {/* Action buttons */}
          <motion.div
            className="space-y-4 w-full max-w-xs"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleViewResults}
                disabled={isLoadingResults}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-full text-base font-medium shadow-lg transition-all duration-200 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Eye className="w-5 h-5 mr-2" />
                추천 결과 보러가기
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                onClick={handleStartAgain}
                disabled={isLoadingResults}
                variant="outline"
                className="w-full border-2 border-purple-400 text-purple-200 hover:bg-purple-800 hover:text-white py-4 rounded-full text-base font-medium bg-transparent transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RotateCcw className="w-5 h-5 mr-2" />
                다시 시작하기
              </Button>
            </motion.div>
          </motion.div>

          {/* Bottom hint */}
          <motion.p
            className="mt-8 text-sm text-purple-300/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            선택하신 결과에 따라 맞춤 콘텐츠를 제공합니다.
          </motion.p>
        </motion.div>
      )}
    </div>
  );
};
