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
  useMemo,
} from 'react';
import { DetailedContentData } from '@type/explore/Explore';
import { VideoPlayer } from '@components/explore/VideoPlayer';
import { useGetContentDetails } from '@hooks/explore/useGetContentDetails';
import { formattingOpenDate } from '@utils/formattingOpenDate';
import { DetailBottomSheetSkeleton } from '@components/explore/DetailBottomSheetSkeleton';

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
  const { data: contentData, status } = useGetContentDetails(contentId); // 콘텐츠 상세 정보 데이터 조회

  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false); // 시놉시스(줄거리) 부분에 대해서 더 자세하게 보여주기 여부
  const [hasValidTrailer, setHasValidTrailer] = useState(true); // 트레일러 주소가 유효한지 여부
  const [isTextOverflowing, setIsTextOverflowing] = useState(false); // 텍스트가 5줄을 넘는지 여부
  const [backdropImgSrc, setBackdropImgSrc] = useState<string>(
    '/images/default-backdrop.png',
  ); // 백드랍 이미지 소스

  // contentData 관련 값들을 useMemo로 메모이제이션
  const contentDescription = useMemo(() => {
    return contentData?.description || '';
  }, [contentData]);

  const contentBackdropUrl = useMemo(() => {
    return contentData?.backdropUrl || '/images/default-backdrop.png';
  }, [contentData]);

  const contentTrailerUrl = useMemo(() => {
    return contentData?.trailerUrl || '';
  }, [contentData]);

  // 실제 이미지가 로드되면 교체
  useEffect(() => {
    setBackdropImgSrc(contentBackdropUrl);
  }, [contentBackdropUrl]);

  // 이미지 로딩 실패 시 기본 이미지로 fallback
  const handleImageError = useCallback(() => {
    setBackdropImgSrc('/images/default-backdrop.png');
  }, []);

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

    if (!contentDescription) return; // Description이 없으면 텍스트 오버플로우 확인 안함

    // 컴포넌트 마운트 후 확인
    checkTextOverflow();

    // 윈도우 리사이즈 시에도 재확인 (반응형 대응)
    window.addEventListener('resize', checkTextOverflow);

    return () => {
      window.removeEventListener('resize', checkTextOverflow);
    };
  }, [contentDescription]); // description이 변경될 때마다 재확인

  useEffect(() => {
    setHasValidTrailer(false); // 새로운 콘텐츠 로드 시에 초기화 (video 로딩 중인 상태로 초기화)

    if (contentTrailerUrl) {
      setHasValidTrailer(true);
    } else {
      setHasValidTrailer(false);
    }
  }, [contentTrailerUrl]);

  if (status === 'pending') {
    return <DetailBottomSheetSkeleton />;
  }

  if (status === 'error') {
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

  return (
    <div className="flex-1 scrollbar-hide">
      {/* 트레일러 영상 또는 backdrop 이미지 표시 */}
      <Suspense
        fallback={
          <div className="relative w-full h-90 rounded-t-lg overflow-hidden">
            <Image
              src={backdropImgSrc}
              alt={contentData.title || '썸네일'}
              fill
              unoptimized
              className="object-cover"
              onError={handleImageError}
            />
            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

            {/* 콘텐츠 정보(제목, 연도만 표시) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center space-y-3">
              <span className="text-3xl font-bold text-white">
                {contentData.title}
              </span>
              <div className="flex items-center space-x-5 text-sm text-gray-200">
                {contentData.openDate !== null ? (
                  <span>
                    {formattingOpenDate(contentData.openDate).slice(0, 4)}
                  </span>
                ) : null}
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
              src={backdropImgSrc}
              alt={contentData.title || ''}
              fill
              unoptimized
              className="object-cover"
              onError={handleImageError}
            />
            {/* 그라데이션 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

            {/* 콘텐츠 정보(제목, 연도만 표시) */}
            <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center space-y-3">
              <span className="text-3xl font-bold text-white">
                {contentData.title}
              </span>
              <div className="flex items-center space-x-5 text-sm text-gray-200">
                {contentData.openDate !== null ? (
                  <span>
                    {formattingOpenDate(contentData.openDate).slice(0, 4)}
                  </span>
                ) : null}
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

        {/* "작품정보" 보여주는 곳 */}
        <div className="flex flex-col space-y-3">
          <span className="text-lg font-semibold text-white">작품정보</span>

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
            {/* 세부 정보 2열 표 */}
            <div className="mt-4 w-full max-w-xl">
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <span className="text-gray-400">장르</span>
                <span className="text-gray-300">
                  {contentData.genres.join(', ')}
                </span>
                <span className="text-gray-400">연령등급</span>
                <span className="text-gray-300">{contentData.rating}</span>
                <span className="text-gray-400">개봉일</span>
                <span className="text-gray-300">
                  {formattingOpenDate(contentData.openDate)}
                </span>
                <span className="text-gray-400">제작국가</span>
                <span className="text-gray-300">
                  {contentData.countries.join(', ')}
                </span>
              </div>
            </div>
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
                      src={actor.castImageUrl || '/placeholder.svg'}
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
            <span className="text-sm text-gray-300">
              {contentData.directors.join(', ')}
            </span>
          ) : (
            <span className="text-sm text-gray-300">정보가 없습니다</span>
          )}
        </div>
      </div>
    </div>
  );
};
