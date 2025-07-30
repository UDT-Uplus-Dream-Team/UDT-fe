'use client';

import React, { useState, useEffect } from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@components/ui/button';

interface StartScreenProps {
  onStart: () => void;
}

interface Star {
  left: string;
  top: string;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [showContent, setShowContent] = useState(false);
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    // 클라이언트에서만 랜덤 위치를 계산
    const generatedStars = Array.from({ length: 50 }, () => ({
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
    }));
    setStars(generatedStars);

    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-full flex items-center justify-center relative overflow-hidden">
      {/* 랜덤 위치 별들 */}
      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0.8, 1],
              scale: [0, 1.2, 1, 1.2],
            }}
            transition={{
              duration: 3,
              delay: i * 0.05,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
            style={{
              left: star.left,
              top: star.top,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      {showContent && (
        <motion.div
          className="text-center text-white z-10 max-w-2xl px-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          {/* Custom welcome message */}
          <motion.div
            className="mb-12 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              반딧불에 오신 걸 환영해요
            </h2>
            <p className="text-yellow-100 text-xl font-bold mt-4">
              간단한 튜토리얼을 함께 살펴볼까요?
            </p>
          </motion.div>

          {/* Start button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Button
              onClick={onStart}
              size="lg"
              className="px-15 py-4 text-lg font-semibold
                bg-gradient-to-r from-primary-100 to-primary-400 
                text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <Play className="w-6 h-6 mr-3" />
              튜토리얼 시작히기
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
