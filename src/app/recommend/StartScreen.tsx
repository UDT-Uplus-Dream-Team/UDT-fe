'use client';

import React, { useState, useEffect } from 'react';
import { Play, Film, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@components/ui/button';
import { useRecommendStore } from '@store/useRecommendStore';
import { showInteractiveToast } from '@components/common/Toast';
import { useRouter } from 'next/navigation';
import SparkleBackground from '@components/common/sparkle_background';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [showContent, setShowContent] = useState(false);
  const { resetRecommendProgress, setPhase } = useRecommendStore();
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // 추천 시작 시 이전 상태 초기화 후 phase 변경
  const handleStartRecommendation = () => {
    // 1. 이전 추천 진행 상황 모두 초기화
    resetRecommendProgress();

    // 2. phase를 recommend로 변경
    setPhase('recommend');

    // 3. 부모 컴포넌트의 onStart 콜백 실행 (호환성 유지)
    onStart();
  };

  // 도움말 버튼 클릭 핸들러
  const handleHelpClick = () => {
    showInteractiveToast.confirm({
      message: '튜토리얼을 다시 확인하시겠습니까?',
      confirmText: '보기',
      cancelText: '취소',
      duration: Number.POSITIVE_INFINITY,
      position: 'top-center',
      className: 'bg-white shadow-lg border border-gray-200',
      onConfirm: () => {
        router.push('/onboarding');
      },
      onCancel: () => {
        // 취소 시 아무것도 하지 않음
      },
    });
  };

  return (
    <div className="flex flex-col h-full w-full items-center justify-center relative overflow-y-auto">
      {/* Animated background stars */}
      <SparkleBackground />

      {/* 도움말 버튼 - 우측 상단 고정 */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleHelpClick}
          className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 hover:scale-105 transition-all duration-200"
        >
          <HelpCircle style={{ width: '32px', height: '32px' }} />
        </Button>
      </div>

      {/* Main content */}
      {showContent && (
        <motion.div
          className="text-center text-white z-10 max-w-2xl px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Logo/Title area */}
          <motion.div
            className="mb-12"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="relative mb-6">
              <motion.div
                className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-yellow-200 to-yellow-100 shadow-lg shadow-yellow-200/30 flex items-center justify-center"
                animate={{
                  rotate: [0, 5, -5, 0],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              >
                <Film className="w-12 h-12 text-slate-800" />
              </motion.div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div
            className="mb-12 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              추천을 시작해볼까요?
            </h2>
            <p className="text-purple-100 text-lg leading-relaxed">
              주어진 컨텐츠들에 대한 생각을 알려주시면
              <br />
              가장 적합한 컨텐츠를 추천해드려요!
            </p>
          </motion.div>

          {/* Start button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Button
              onClick={handleStartRecommendation}
              size="lg"
              className="px-15 py-4 text-lg font-semibold
               bg-gradient-to-r from-primary-100 to-primary-400 
               text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Play className="w-6 h-6 mr-3" />
              추천 시작하기
            </Button>
          </motion.div>

          {/* Bottom hint */}
          <motion.p
            className="mt-8 text-sm text-purple-300/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            정확한 선호도 파악을 위해 약 2~3분 정도가 소요됩니다.
          </motion.p>
        </motion.div>
      )}
    </div>
  );
};
