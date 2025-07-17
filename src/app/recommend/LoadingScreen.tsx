// components/LoadingScreen.tsx
'use client';

import React from 'react';

export const LoadingScreen: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
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
    <div className="text-center text-white z-10">
      <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '1s' }}>
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
      <div
        className="opacity-0 animate-fade-in-up"
        style={{ animationDelay: '4.5s' }}
      >
        <div className="inline-block px-8 py-3 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 animate-glow">
          <span className="text-sm font-medium">반달별 시작하기</span>
        </div>
      </div>
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
