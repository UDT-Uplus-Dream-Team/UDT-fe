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
import Image from 'next/image';
import { useGetUserProfile } from '@hooks/useGetUserProfile';
import { Skeleton } from '@components/ui/skeleton';
import { useLogoutHandler } from '@hooks/profile/useLogoutHandler';
import { usePageStayTracker } from '@hooks/usePageStayTracker';
import { useQueryErrorToast } from '@/hooks/useQueryErrorToast';
import { useMemo } from 'react';

const ProfilePage = () => {
  // 페이지 머무르는 시간 추적 (프로필 페이지 추적 / Google Analytics 연동을 위함)
  usePageStayTracker('profile_main');

  const router = useRouter();

  const userQuery = useGetUserProfile(); // 유저 프로필 조회 쿼리 전체 가져오기 (에러 핸들링에서 용이함을 위함)

  // 쿼리에서 에러가 발생했을 경우, 토스트 띄우기
  useQueryErrorToast(userQuery);

  // userQuery.data가 변경될 때만 새로운 값을 반환하도록 함
  const userProfile = useMemo(() => userQuery.data, [userQuery.data]);

  const handleEditClick = () => {
    router.push('/profile/edit');
  };

  const { handleLogout } = useLogoutHandler();

  if (userQuery.status === 'pending') {
    return (
      <div className="h-[calc(100vh-80px)] overflow-y-auto w-full mx-auto px-4 pt-6 text-white flex flex-col items-center">
        <div className="w-full flex justify-center mb-16 h-10">
          <span className="text-lg font-bold text-center text-white">
            프로필
          </span>
        </div>
        <div className="w-full max-w-[600px] flex flex-col justify-center items-center gap-3 px-4 sm:px-6">
          {/* 유저 정보 스켈레톤 */}
          <div className="w-full max-w-[500px] bg-white/20 rounded-[16px] p-4">
            <div className="flex items-center gap-4 mb-2">
              <Skeleton className="w-[60px] h-[60px] rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="w-[120px] h-[18px] rounded-md" />
                <Skeleton className="w-[180px] h-[14px] rounded-md" />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Skeleton className="w-[100px] h-[30px] rounded-md" />
              <Skeleton className="w-[100px] h-[30px] rounded-md" />
            </div>
          </div>

          {/* SubscriptionBox 2개 스켈레톤 */}
          <Skeleton className="w-full max-w-[500px] h-[80px] rounded-[16px]" />
          <Skeleton className="w-full max-w-[500px] h-[80px] rounded-[16px]" />

          {/* 추천 캐러셀 카드 스켈레톤 */}
          <Skeleton className="w-full max-w-[500px] h-[240px] rounded-[16px]" />
        </div>
      </div>
    );
  }

  if (userQuery.status === 'error' || !userProfile) {
    return (
      <p className="text-red-500 text-center mt-10">
        유저 정보를 불러오지 못했습니다.
      </p>
    );
  }

  const { name, email, profileImageUrl, platforms, genres } = userProfile;

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto w-full mx-auto px-4 pt-6 text-white flex flex-col items-center">
      {/* 상단 제목 */}
      <div className="w-full flex justify-center mb-10  h-10">
        <span className="text-lg font-bold text-center text-white">프로필</span>
      </div>

      <div className="w-full max-w-[600px] flex flex-col justify-center items-center gap-3 px-4 sm:px-6">
        {/* 프로필 페이지 상단의 유저 정보 (편집/로그아웃 버튼 포함) */}
        <div className="w-full max-w-[500px] flex flex-col justify-start bg-white/20 rounded-[16px] p-4">
          {/* 프로필 이미지 + 이름/이메일 수평 정렬 */}
          <div className="flex flex-row items-center justify-start gap-4 mb-2">
            {/* 프로필 이미지 */}
            <Image
              src={
                profileImageUrl
                  ? profileImageUrl.replace(/^http:\/\//, 'https://')
                  : '/images/default-profile.png'
              }
              alt="프로필 이미지"
              width={60}
              height={60}
              className="rounded-full object-cover"
              style={{ aspectRatio: '1 / 1' }}
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
              onClick={handleLogout}
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
        <div className="w-full max-w-[500px] relative">
          <Carousel opts={{ align: 'center', loop: false }} className="w-full">
            <CarouselContent>
              {recommendData.map((card, index) => (
                <CarouselItem key={index} className="w-full">
                  <RecommendationCard {...card} />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-1 top-1/2 -translate-y-1/2 z-10" />
            <CarouselNext className="right-1  top-1/2 -translate-y-1/2 z-10" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
