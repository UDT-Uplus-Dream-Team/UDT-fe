// 콘텐츠 상세 정보를 보여주는 BottomSheet 컴포넌트

// import { useGetContentDetail } from '@/hooks/useGetContentDetail';
import Image from 'next/image';
import { PlatformButton } from '@/components/explore/PlatformButton';
import { getPlatformLogo } from '@/utils/getPlatformLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import {
  memo,
  Suspense,
  useEffect,
  useState,
  useCallback,
  useRef,
} from 'react';
import { DetailedContentData } from '@type/explore/Explore';
import { VideoPlayer } from '@components/explore/VideoPlayer';
import { useGetContentDetails } from '@hooks/explore/useGetContentDetails';

interface DetailBottomSheetContentProps {
  contentId: number;
}

interface VideoPlayerWrapperProps {
  contentData: DetailedContentData;
  onError: () => void;
}

// 비디오 플레이어 컴포넌트를 메모이제이션하여 contentData 값, onError 메소드가 변경되지 않는 한 재렌더링 되지 않도록 함
const VideoPlayerWrapper = memo(
  ({ contentData, onError }: VideoPlayerWrapperProps) => {
    return <VideoPlayer contentData={contentData} onLoadError={onError} />;
  },
);

// 콘텐츠 상세 정보를 보여주는 BottomSheet 컴포넌트
export const DetailBottomSheetContent = ({
  contentId,
}: DetailBottomSheetContentProps) => {
  const synopsisRef = useRef<HTMLSpanElement>(null); // 시놉시스 텍스트 요소 참조
  const {
    data: contentData,
    isLoading,
    isError,
  } = useGetContentDetails(contentId); // 콘텐츠 상세 정보 데이터 조회

  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false); // 시놉시스(줄거리) 부분에 대해서 더 자세하게 보여주기 여부
  const [hasValidTrailer, setHasValidTrailer] = useState(true); // 트레일러 주소가 유효한지 여부
  const [isTextOverflowing, setIsTextOverflowing] = useState(false); // 텍스트가 5줄을 넘는지 여부
  const [imgSrc, setImgSrc] = useState<string>(contentData?.backdropUrl || ''); // 백드랍 이미지 소스

  if (isLoading) {
    return <div>로딩 중입니다.</div>;
  }

  if (isError) {
    return <div>에러가 발생했습니다, 관리자에게 문의 바랍니다.</div>;
  }

  // contentData가 없는 경우 처리
  if (!contentData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-white">콘텐츠 정보가 없습니다.</div>
      </div>
    );
  }

  // 비디오 정보를 불러 오다가 에러가 났을 경우, isVideoLoaded 상태를 false로 변경
  const handleVideoError = useCallback(() => {
    setHasValidTrailer(false);
  }, []);

  // 시놉시스 텍스트 확장 여부 토글
  const handleToggleSynopsis = useCallback((expanded: boolean) => {
    setIsSynopsisExpanded(expanded);
  }, []);

  // 시놉시스 텍스트 오버플로우 확인
  useEffect(() => {
    const checkTextOverflow = () => {
      if (synopsisRef.current) {
        const element = synopsisRef.current;
        // scrollHeight가 clientHeight보다 크면 텍스트가 잘렸음을 의미
        setIsTextOverflowing(element.scrollHeight > element.clientHeight);
      }
    };

    // 컴포넌트 마운트 후 확인
    checkTextOverflow();

    // 윈도우 리사이즈 시에도 재확인 (반응형 대응)
    window.addEventListener('resize', checkTextOverflow);

    return () => {
      window.removeEventListener('resize', checkTextOverflow);
    };
  }, [contentData.description]); // description이 변경될 때마다 재확인

  // TODO: 실제 API 호출 시에 contentId에 따른 데이터 fetching 필요 (추후 get 요청을 하는 hook과 contentId를 연동해야 함)
  useEffect(() => {
    setHasValidTrailer(false); // 새로운 콘텐츠 로드 시에 초기화 (video 로딩 중인 상태로 초기화)

    if (contentData?.trailerUrl) {
      setHasValidTrailer(true);
      console.log('지금 트레일러 영상 있음!, contentId: ', contentId);
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
              src={imgSrc}
              alt={contentData.title || '썸네일'}
              fill
              className="object-cover"
              onError={() => setImgSrc('/images/default-backdrop.png')} // 이미지 로딩 실패 시 기본 이미지로 대체
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
          <VideoPlayerWrapper
            contentData={contentData}
            onError={handleVideoError}
          />
        ) : (
          <div className="relative w-full h-90 rounded-t-lg overflow-hidden">
            <Image
              src={imgSrc}
              alt={contentData.title || ''}
              fill
              className="object-cover"
              onError={() => setImgSrc('/images/default-backdrop.png')} // 이미지 로딩 실패 시 기본 이미지로 대체
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
        {/* 플랫폼 버튼, url이 null인 경우 '보러가기' 버튼 미표시 */}
        {contentData.platforms.map((platform, idx) => (
          <PlatformButton
            key={idx}
            platformName={platform.platformType}
            iconUrl={getPlatformLogo(platform.platformType) || ''}
            url={platform.watchUrl || null}
          />
        ))}

        {/* 시놉시스(줄거리) */}
        <div className="space-y-2">
          <div className="text-sm text-gray-300 leading-relaxed">
            {isSynopsisExpanded ? (
              <>
                {contentData.description}
                {isTextOverflowing && (
                  <span
                    onClick={() => handleToggleSynopsis(false)}
                    className="text-white cursor-pointer ml-1"
                  >
                    ...접기
                  </span>
                )}
              </>
            ) : (
              <>
                <span ref={synopsisRef} className="line-clamp-5">
                  {contentData.description}
                </span>
                {/* Text가 5줄 넘어간다고 판단되는 경우에만 '...더보기' 글자 버튼 띄우기 */}
                {isTextOverflowing && (
                  <span
                    onClick={() => handleToggleSynopsis(true)}
                    className="text-white cursor-pointer ml-1"
                  >
                    ...더보기
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* 배우들 */}
        <div className="flex flex-col space-y-3">
          <span className="text-lg font-semibold text-white">출연진</span>
          {/* 출연진 정보가 있는 경우에만 표시 */}
          {contentData.casts && contentData.casts.length > 0 ? (
            <div className="flex space-x-4 overflow-x-auto">
              {contentData.casts.map((actor, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center space-y-2 min-w-[60px]"
                >
                  <Avatar className="w-15 h-15 rounded-full overflow-hidden">
                    <AvatarImage
                      src={actor.castImage || '/placeholder.svg'}
                      alt={actor.castName}
                      className="object-cover w-full h-full"
                    />
                    <AvatarFallback className="bg-gray-700 text-2xl text-white size-full rounded-full flex items-center justify-center">
                      {actor.castName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-gray-300 text-center leading-tight">
                    {actor.castName}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-300">정보가 없습니다</span>
          )}
        </div>

        {/* 감독 */}
        <div className="flex flex-col space-y-3">
          <span className="text-lg font-semibold text-white">감독</span>
          {/* 감독 정보가 있는 경우에만 표시 */}
          {contentData.directors && contentData.directors.length > 0 ? (
            <div className="flex flex-row items-center space-x-3">
              {contentData.directors.map((director, index) => (
                <span key={index} className="text-xs text-gray-300 text-center">
                  {director.name}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-gray-300">정보가 없습니다</span>
          )}
        </div>
      </div>
    </div>
  );
};
