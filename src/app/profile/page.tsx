'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@components/ui/carousel';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui/button';
import SubscriptionBox from '@components/profile/SubscriptionBox';
import RecommendationCard from '@components/profile/RecommendationCard';
import { recommendData } from './profileData';

//나중에 api로 수정 예정
import { mockUserProfile } from '@app/profile/profileData';
import Image from 'next/image';
// 프로필 데이터 나중에 api로 수정 예정
const { name, email, profileImageUrl, platforms, genres } = mockUserProfile;

const ProfilePage = () => {
  const router = useRouter();

  const handleEditClick = () => {
    router.push('/profile/edit');
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto w-full mx-auto px-4 pt-6 text-white flex flex-col items-center">
      {/* 상단 제목 */}
      <div className="w-full flex justify-center mb-4 h-10">
        <span className="text-lg font-bold text-center text-white">프로필</span>
      </div>

      <div className="w-full max-w-[600px] flex flex-col justify-center items-center gap-3 px-4 sm:px-6">
        {/* 프로필 페이지 상단의 유저 정보 (편집/로그아웃 버튼 포함) */}
        <div className="w-full max-w-[500px] flex flex-col justify-start bg-white/20 rounded-[16px] p-4">
          {/* 프로필 이미지 + 이름/이메일 수평 정렬 */}
          <div className="flex flex-row items-center justify-start gap-4 mb-2">
            {/* 프로필 이미지 */}
            <Image
              src={profileImageUrl || '/images/default-profile.png'}
              alt="프로필 이미지"
              width={60}
              height={60}
              className="rounded-full object-cover"
            />

            {/* 이름 + 이메일 */}
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-white">{name}</h2>
              <p className="text-sm text-gray-300">{email}</p>
            </div>
          </div>

          {/* 편집 버튼 */}
          <div className="w-full flex justify-end gap-4">
            <Button
              size="sm"
              className="w-fit h-[30px] text-[13px] rounded-[8px] bg-primary-200/70 text-white font-semibold"
              onClick={handleEditClick}
            >
              <Image
                src="/icons/edit-icon.svg"
                alt="편집"
                width={20}
                height={20}
              />
              구독/장르 수정
            </Button>
            <Button
              size="sm"
              className="w-fit h-[30px] text-[13px] rounded-[8px] bg-primary-200/70 text-white font-semibold"
              onClick={handleEditClick}
            >
              <Image
                src="/icons/logout-icon.svg"
                alt="로그아웃"
                width={16}
                height={16}
              />
              로그아웃
            </Button>
          </div>
        </div>
        {/* OTT 구독 현황 */}
        <SubscriptionBox title="OTT 구독 현황" items={platforms} />

        {/* 선호 장르 */}
        <SubscriptionBox
          title="선호 장르"
          items={genres.map((genre) => `#${genre}`)}
        />

        {/* 추천 콘텐츠 카드 영역 - ShadCN Carousel 적용 */}
        <div className="w-full max-w-[500px]">
          <Carousel opts={{ align: 'center', loop: false }} className="w-full">
            <CarouselContent>
              {recommendData.map((card, index) => (
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
    </div>
  );
};

export default ProfilePage;
