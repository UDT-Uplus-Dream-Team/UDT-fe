'use client';

import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import Image from 'next/image';

export default function KakaoLoginPage() {
  const handleKakaoLogin = () => {
    // KakaoTalk login logic would go here
    console.log('KakaoTalk login initiated');
  };

  return (
    <div className="min-h-full flex flex-col text-white items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
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
      {/* Content - 모든 요소를 중앙에 모아서 배치 */}
      <div className="flex flex-col items-center justify-center text-center w-full space-y-5">
        {/* 3D Package illustration */}
        <div className="relative animate-fade-in-up glow-effect">
          <Image
            src="/icons/FireFlyLogo.png"
            alt="biglogo"
            width={120}
            height={120}
            style={{
              width: '280px',
              height: '280px',
            }}
            className="object-cover"
          />
        </div>

        {/* 텍스트 부분 */}
        <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <h1 className="text-2xl font-bold mb-2 text-logo leading-tight">
            반딧불에 오신 걸 환영해요!
          </h1>
          <h2 className="text-lg text-white leading-tight">
            당신을 위한 컨텐츠를 찾아보세요
          </h2>
        </div>

        {/* KakaoTalk login button - 텍스트와 더 가깝게 */}
        <div
          className="w-full max-w-70 py-5 animate-fade-in-up"
          style={{ animationDelay: '1.0s' }}
        >
          <Button
            onClick={handleKakaoLogin}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold py-3 sm:py-4 lg:py-5 px-6 rounded-2xl flex items-center justify-center space-x-3 shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 text-base sm:text-lg lg:text-xl"
          >
            <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 bg-black rounded-full flex items-center justify-center">
              <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 fill-yellow-400 text-yellow-400" />
            </div>
            <span>카카오톡으로 시작하기</span>
          </Button>
        </div>
      </div>

      {/* Desktop-only decorative elements */}
      <div className="hidden lg:block absolute top-10 left-10 w-20 h-20 bg-yellow-100 rounded-full opacity-50 blur-xl" />
      <div className="hidden lg:block absolute bottom-20 right-10 w-32 h-32 bg-amber-100 rounded-full opacity-30 blur-2xl" />
      <div className="hidden xl:block absolute top-1/3 right-20 w-16 h-16 bg-yellow-200 rounded-full opacity-40 blur-lg" />
    </div>
  );
}
