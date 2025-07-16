'use client';

import React, { useState, useEffect } from 'react';
import { Play, Film } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@components/ui/button';

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

      {/* Floating movie icons */}
      {/* <div className="absolute inset-0 pointer-events-none">
        {[Film, Heart, Star, Sparkles].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white/20"
            initial={{ y: 100, opacity: 0 }}
            animate={{
              y: [-20, -40, -20],
              opacity: [0.2, 0.4, 0.2],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 4,
              delay: i * 0.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            style={{
              left: `${20 + i * 20}%`,
              top: `${20 + (i % 2) * 40}%`,
            }}
          >
            <Icon size={32} />
          </motion.div>
        ))}
      </div> */}

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

              {/* Orbiting sparkles */}
              {/* {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-2 h-2 bg-yellow-300 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: 'linear',
                    delay: i * 0.3,
                  }}
                  style={{
                    left: '50%',
                    top: '50%',
                    transformOrigin: `0 ${40 + i * 5}px`,
                  }}
                />
              ))} */}
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
              컨텐츠들에 대해서 사용자님의 생각을 알려주시면
              <br />
              가장 적합한 컨텐츠를 추천해드려요!
            </p>
          </motion.div>

          {/* Features */}
          {/* <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            {[
              { icon: Heart, title: '개인 맞춤', desc: '당신의 취향 분석' },
              {
                icon: Star,
                title: '엄선된 콘텐츠',
                desc: '높은 평점의 작품들',
              },
              {
                icon: Sparkles,
                title: '새로운 발견',
                desc: '숨겨진 명작 추천',
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
                whileHover={{ scale: 1.05, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <feature.icon className="w-8 h-8 mx-auto mb-3 text-yellow-300" />
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-purple-200">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div> */}

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
