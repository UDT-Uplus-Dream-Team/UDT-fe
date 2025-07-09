'use client';

import RecommendationCard from '@/components/mypage/RecommendationCard';
import SubscriptionBox from '@/components/mypage/SubscriptionBox';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

const recommendationData = [
  {
    imageUrl: '/movie.webp',
    title: '추천 콘텐츠 보기',
    description: '지금까지 추천 받은 모든 콘텐츠를 한눈에 만나보세요!',
    route: '/recommend',
  },
  {
    imageUrl: '/images/poster4.webp',
    title: '나의 취향 추천보기',
    description: '당신만을 위한 추천 콘텐츠를 확인해보세요!',
    route: '/recommend/me',
  },
];

const ProfilePage = () => {
  const router = useRouter();

  const handleEditClick = () => {
    router.push('/profile/edit');
  };

  return (
    <div className="grid grid-cols-1 gap-5 w-full px-6 pt-6 text-white place-items-center">
      {/* 프로필 아바타 + 이메일 */}
      <div className="relative flex flex-col items-center">
        <div className="w-[50px] h-[50px] bg-white rounded-full mb-2" />
        <h2 className="text-lg font-bold">테스트</h2>
        <p className="text-sm text-gray-200">test@gmail.com</p>
      </div>

      {/* 편집 버튼 */}
      <div className="w-full flex justify-center ml-60">
        <Button
          size="sm"
          className="w-[50px] h-[30px] text-[13px] rounded-[8px] bg-primary-200/70 text-white font-semibold"
          onClick={handleEditClick}
        >
          편집
        </Button>
      </div>

      {/* OTT 구독 현황 */}
      <div>
        <SubscriptionBox title="OTT 구독 현황" items={['Netflix', 'Wave']} />
      </div>

      {/* 선호 장르 */}
      <div>
        <SubscriptionBox
          title="선호 장르"
          items={['#드라마', '#범죄', '#로맨스']}
        />
      </div>

      {/* 추천 콘텐츠 카드 영역 - ShadCN Carousel 적용 */}
      <div className="w-full max-w-[320px]">
        <Carousel opts={{ align: 'center', loop: false }} className="w-full">
          <CarouselContent>
            {recommendationData.map((card, index) => (
              <CarouselItem key={index} className="w-full">
                <RecommendationCard {...card} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
};

export default ProfilePage;
