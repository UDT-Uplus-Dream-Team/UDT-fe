// 콘텐츠 상세 정보를 보여주는 BottomSheet 컴포넌트

// import { useGetContentDetail } from '@/hooks/useGetContentDetail';
import Image from 'next/image';
import { PlatformButton } from '@/components/explore/PlatformButton';
import { getPlatformLogo } from '@/utils/getPlatformLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { getMockContentData } from '@/utils/getMockContentData';
import { VideoPlayer } from './VideoPlayer';

interface DetailBottomSheetContentProps {
  contentId: number;
}

// 콘텐츠 상세 정보를 보여주는 BottomSheet 컴포넌트
export const DetailBottomSheetContent = ({
  contentId,
}: DetailBottomSheetContentProps) => {
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false); // 시놉시스(줄거리) 부분에 대해서 더 자세하게 보여주기 여부
  const [hasValidTrailer, setHasValidTrailer] = useState(true); // 트레일러 주소가 유효한지 여부

  // contentId에 따른 콘텐츠 데이터 가져오기
  const contentData = useMemo(() => getMockContentData(contentId), [contentId]);

  // 비디오 정보를 불러 오다가 에러가 났을 경우, isVideoLoaded 상태를 false로 변경
  const handleVideoError = () => {
    setHasValidTrailer(false);
  };

  // TODO: 실제 API 호출 시에 contentId에 따른 데이터 fetching 필요 (추후 get 요청을 하는 hook과 contentId를 연동해야 함)
  useEffect(() => {
    setHasValidTrailer(false); // 새로운 콘텐츠 로드 시에 초기화 (video 로딩 중인 상태로 초기화)

    if (contentData.trailerUrl) {
      setHasValidTrailer(true);
      console.log('지금 트레일러 영상 있음!');
    } else {
      setHasValidTrailer(false);
    }
  }, [contentId]);

  return (
    <div className="flex-1 scrollbar-hide">
      {/* 트레일러 영상 또는 backdrop 이미지 표시 */}
      <Suspense
        fallback={
          <div className="relative w-full h-90 rounded-t-lg overflow-hidden">
            <Image
              src={contentData.backdropUrl || '/placeholder.svg'}
              alt={contentData.title}
              fill
              className="object-cover"
            />
            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

            {/* 콘텐츠 정보 */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center space-y-3">
              <span className="text-3xl font-bold text-white">
                {contentData.title}
              </span>
              <div className="flex items-center space-x-5 text-sm text-gray-200">
                <span>{contentData.openDate.split('-')[0]}</span>
                <span>{contentData.rating}</span>
                <span>{contentData.countries[0]}</span>
              </div>
            </div>
          </div>
        }
      >
        {hasValidTrailer ? (
          <VideoPlayer
            contentData={contentData}
            onLoadError={handleVideoError}
          />
        ) : (
          <div className="relative w-full h-90 rounded-t-lg overflow-hidden">
            <Image
              src={contentData.backdropUrl || '/placeholder.svg'}
              alt={contentData.title}
              fill
              className="object-cover"
            />
            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

            {/* 콘텐츠 정보 */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center space-y-3">
              <span className="text-3xl font-bold text-white">
                {contentData.title}
              </span>
              <div className="flex items-center space-x-5 text-sm text-gray-200">
                <span>{contentData.openDate.split('-')[0]}</span>
                <span>{contentData.rating}</span>
                <span>{contentData.countries[0]}</span>
              </div>
            </div>
          </div>
        )}
      </Suspense>

      {/* 사진 밑에 콘텐츠 정보 */}
      <div className="flex flex-col space-y-6 px-4 pt-4 bg-gradient-to-b from-black/100 to-primary-800">
        {/* "보러가기" 버튼 */}
        <PlatformButton
          platformName="디즈니+"
          iconUrl={getPlatformLogo('디즈니+') || ''}
          url="https://www.disneyplus.com"
        />

        {/* 시놉시스(줄거리) */}
        <div className="space-y-2">
          <div className="text-sm text-gray-300 leading-relaxed">
            {isSynopsisExpanded ? (
              <>
                {contentData.description}
                <span
                  onClick={() => setIsSynopsisExpanded(false)}
                  className="text-white cursor-pointer ml-1"
                >
                  ...접기
                </span>
              </>
            ) : (
              <>
                <span className="line-clamp-5">{contentData.description}</span>
                <span
                  onClick={() => setIsSynopsisExpanded(true)}
                  className="text-white cursor-pointer ml-1"
                >
                  ...더보기
                </span>
              </>
            )}
          </div>
        </div>

        {/* 배우들 */}
        <div className="flex flex-col space-y-3">
          <span className="text-lg font-semibold text-white">출연진</span>
          <div className="flex space-x-4 overflow-x-auto">
            {contentData.cast.map((actor, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 min-w-[60px]"
              >
                <Avatar className="w-15 h-15 rounded-full overflow-hidden">
                  <AvatarImage
                    src={actor.image || '/placeholder.svg'}
                    alt={actor.name}
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="bg-gray-700 text-white">
                    {actor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-300 text-center leading-tight">
                  {actor.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 감독 */}
        <div className="flex flex-col space-y-3">
          <span className="text-lg font-semibold text-white">감독</span>
          <div className="flex flex-row items-center space-x-3">
            {contentData.directors.map((director, index) => (
              <span key={index} className="text-xs text-gray-300 text-center">
                {director.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
