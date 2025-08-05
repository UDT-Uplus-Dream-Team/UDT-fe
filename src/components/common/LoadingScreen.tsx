// components/LoadingScreen.tsx
'use client';

import SparkleBackground from '@components/common/sparkle_background';
import React from 'react';

interface LoadingScreenProps {
  message: string;
  submessage: string;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message,
  submessage,
}) => (
  <div className="h-full w-full flex items-center justify-center relative overflow-hidden">
    <SparkleBackground />
    <div className="text-center text-white z-10">
      <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '1s' }}>
        <h2 className="text-xl font-medium mb-2 animate-typing">{message}</h2>
        <p
          className="text-sm opacity-80 animate-fade-in"
          style={{ animationDelay: '1.5s' }}
        >
          {submessage}
        </p>
      </div>
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
    </div>
  </div>
);
