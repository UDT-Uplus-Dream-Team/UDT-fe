'use client';

import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface StarData {
  id: number;
  left: number;
  top: number;
  delay: number;
}

export default function KakaoLoginPage() {
  const [stars, setStars] = useState<StarData[]>([]);

  const handleKakaoLogin = () => {
    window.location.href =
      'https://api.banditbool.com/oauth2/authorization/kakao';
  };

  // 클라이언트에서만 별 생성
  useEffect(() => {
    const starData: StarData[] = [...Array(50)].map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: i * 0.1,
    }));
    setStars(starData);
  }, []);

  return (
    <div className="flex flex-col min-h-full text-white items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        {stars.map((star) => (
          <div
            key={star.id}
            className="absolute w-1 h-1 bg-white rounded-full opacity-0 animate-star-appear"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              animationDelay: `${star.delay}s`,
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
            width={720}
            height={720}
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
            className="w-full bg-transparent border-none transition-all duration-200 cursor-pointer hover:bg-transparent"
          >
            <Image
              src="/icons/kakaologin-icon.png"
              alt="kakao"
              width={300}
              height={45}
            />
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
