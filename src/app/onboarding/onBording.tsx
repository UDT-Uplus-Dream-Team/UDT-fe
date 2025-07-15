'use client';

import React, { useState, useEffect } from 'react';
import { Play, Film } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-full flex items-center justify-center relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
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
              repeat: Number.POSITIVE_INFINITY,
              repeatType: 'reverse',
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
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
          {/* Logo / Title */}
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

          {/* Custom welcome message */}
          <motion.div
            className="mb-12 space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              반딧불에 오신 걸 환영해요.
            </h2>
            <p className="text-purple-100 text-lg leading-relaxed">
              오늘은 무슨 콘텐츠를 볼 지 고민되세요?
              <br />
              고민하지 마세요.
              <br />
              반딧불이 골라 드릴게요!
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
              반딧불 출발하기!
            </Button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
