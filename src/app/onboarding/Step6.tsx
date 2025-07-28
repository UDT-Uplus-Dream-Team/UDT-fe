'use client';

import { useEffect, useState } from 'react';
import { Ticket } from '@components/Ticket/Ticket';
import { showInteractiveToast } from '@components/common/Toast';
import { MockMovies } from './moviedata';

interface Step6Props {
  onNext: () => void;
}

export default function Step6({ onNext }: Step6Props) {
  const [toastShown, setToastShown] = useState(false);
  const [mounted, setMounted] = useState(false); // hydration 방지

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !toastShown) {
      showInteractiveToast.action({
        message: '모든 영화를 확인했습니다!\n추천 결과를 보시겠어요?',
        actionText: '결과 보기',
        duration: Infinity,
        position: 'top-center',
        className: 'bg-gray-500',
        onAction: () => {
          setToastShown(true); // 바로 true 처리 (중복 방지)
          onNext(); // Step6으로 전환
        },
        showCloseButton: false, // X 못하게 없엠
      });
    }
  }, [mounted, toastShown, onNext]);

  if (!mounted) return null;

  const currentMovie = MockMovies[1];

  return (
    <div className="relative flex flex-col items-center justify-center h-full w-full px-6 text-white">
      {/* 검정 반투명 오버레이 + 설명 */}
      <div className="absolute inset-0 bg-black/70 z-20 flex flex-col items-center justify-center text-center px-4">
        <svg
          className="w-6 h-6 animate-bounce text-white/80 mb-2"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 15l7-7 7 7"
          />
        </svg>
        <p className="text-lg font-semibold leading-relaxed">
          <span className="text-purple-100  text-xl font-bold">
            5개 이상 넘어가면
          </span>
          <br />
          사용자님의 취향을 확인하여 <br />
          완전 맞춤형 컨텐츠를 추천 드립니다! <br />
          <br />
          상단의 결과 보기를 클릭해 보세요~
        </p>
      </div>

      {/* 카드 - 중앙 정렬 */}
      <div className="relative w-[80vw] min-w-[280px] max-w-[320px] aspect-[75/135] md:max-w-[400px] sm:aspect-[75/127] max-h-[70vh]">
        <Ticket movie={currentMovie} variant="initial" feedback="neutral" />
      </div>
    </div>
  );
}
