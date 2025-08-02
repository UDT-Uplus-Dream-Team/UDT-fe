'use client';

import React, { useState, useRef } from 'react';
import { SwipeContainer } from '@components/Recommend/SwipeContainer';
import type {
  TicketData,
  SwipeResult,
  SwipeHandle,
} from '@type/recommend/swipe';

// 모크 데이터
const mockMovies: TicketData[] = [
  {
    contentId: 1,
    title: '그랜드 부다페스트 호텔',
    description:
      '1927년 세계대전이 한창이던 어느 날, 세계 최고 부호 마담 D가 그랜드 부다페스트 호텔에 다녀간 지 얼마 지나지 않아 의문의 살인을 당한다...',
    posterUrl: '/images/onboarding/onboarding1.jpg',
    backdropUrl: '/images/onboarding/onboarding_back1.jpg',
    openDate: '2014년 3월 20일',
    runningTime: 160,
    episode: '1회차',
    rating: '18세이상관람가',
    category: '영화',
    genres: ['코미디', '드라마'],
    directors: ['웨스 앤더슨'],
    casts: ['랄프 파인스', '머레이 아브라함', '매튜 아모도브'],
    platforms: ['디즈니+', '쿠팡플레이'],
  },
  {
    contentId: 2,
    title: '그린북',
    description:
      '1962년 미국, 입담과 주먹만 믿고 살아가던 토니 발레롱가는 교양과 우아함 그 자체인 천재 피아니스트 돈 셜리의 운전기사 면접을 보게 된다...',
    posterUrl: '/images/onboarding/onboarding2.jpg',
    backdropUrl: '/images/onboarding/onboarding_back2.webp',
    openDate: '2019년 1월 09일',
    runningTime: 130,
    episode: '1회차',
    rating: '12세이상관람가',
    category: '영화',
    genres: ['드라마', '역사'],
    directors: ['피터 패럴리'],
    casts: ['비고 모텐슨', '마허샬라 알리', '린다 카델리니'],
    platforms: ['웨이브', '넷플릭스'],
  },
  {
    contentId: 3,
    title: '보헤미안 랩소디',
    description:
      '공항 수하물 노동자로 일하며 음악의 꿈을 키우던 이민자 출신의 아웃사이더 파록 버사라...',
    posterUrl: '/images/onboarding/onboarding3.webp',
    backdropUrl: '/images/onboarding/onboarding_back3.jpg',
    openDate: '2018년 10월 31일',
    runningTime: 134,
    episode: '1회차',
    rating: '12세이상관람가',
    category: '영화',
    genres: ['드라마', '음악'],
    directors: ['브라이언 싱어'],
    casts: ['라미 말렉', '루시 보인턴', '그윈 리'],
    platforms: ['넷플릭스', '쿠팡플레이'],
  },
];

export default function SwipeTestPage() {
  const [swipeCount, setSwipeCount] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const swipeRef = useRef<SwipeHandle>(null);

  // 스와이프 완료 시 호출되는 콜백
  const handleSwipe = (result: SwipeResult) => {
    console.log(
      `스와이프 방향: ${result.direction}, 피드백: ${result.feedback}`,
      result.item,
    );
    setSwipeCount((prev) => prev + 1);
    setIsFlipped(false); // 스와이프 시 플립 상태 리셋
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex flex-col items-center justify-center p-4">
      {/* 헤더 */}
      <div className="text-center text-white mb-8">
        <h1 className="text-2xl font-bold mb-2">스와이프 테스트</h1>
        <p className="text-sm opacity-80">
          👆위: 관심없음 | 👈좌: 싫어요 | 👉우: 좋아요 | 스와이프 횟수:{' '}
          {swipeCount}
        </p>
        <p className="text-xs opacity-60 mt-1">
          키보드 방향키로도 테스트 가능합니다
        </p>
      </div>

      {/* 카드 영역 */}
      <div className="flex flex-col w-full max-w-sm items-center justify-center">
        <div className="my-5 flex w-full justify-center">
          <div className="mx-10 w-full">
            {/* 🎯 매우 간단해진 사용법 */}
            <SwipeContainer
              ref={swipeRef}
              items={mockMovies}
              onSwipe={handleSwipe}
              enableKeyboard={true}
            />
          </div>
        </div>

        {/* 플립 버튼 */}
        <div className="relative z-30 flex flex-col items-center gap-4">
          <button
            onClick={() => setIsFlipped((f) => !f)}
            className="bg-white/20 border border-white/20 text-white px-5 py-2 text-sm rounded hover:bg-white/20 backdrop-blur-sm transition-colors"
            disabled={swipeRef.current?.isAnimating}
          >
            {isFlipped ? '돌아가기' : '상세보기'}
          </button>
        </div>

        {/* 수동 테스트 버튼들 */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => swipeRef.current?.triggerSwipe('left', 'unliked')}
            className="bg-red-500 text-white px-3 py-2 rounded text-xs hover:bg-red-600 transition-colors"
            disabled={swipeRef.current?.isAnimating}
          >
            싫어요 ←
          </button>
          <button
            onClick={() => swipeRef.current?.triggerSwipe('up', 'neutral')}
            className="bg-gray-500 text-white px-3 py-2 rounded text-xs hover:bg-gray-600 transition-colors"
            disabled={swipeRef.current?.isAnimating}
          >
            관심없음 ↑
          </button>
          <button
            onClick={() => swipeRef.current?.triggerSwipe('right', 'liked')}
            className="bg-green-500 text-white px-3 py-2 rounded text-xs hover:bg-green-600 transition-colors"
            disabled={swipeRef.current?.isAnimating}
          >
            → 좋아요
          </button>
        </div>
      </div>
    </div>
  );
}
