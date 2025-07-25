import { useState, useRef, useEffect, useCallback } from 'react';
import { DetailedContentData } from '@type/explore/Explore';
import Image from 'next/image';
import { getYouTubeEmbedUrl } from '@utils/getYouTubeEmbedUrl';
import { formattingOpenDate } from '@utils/formattingOpenDate';

// 트레일러 영상 재생 컴포넌트에 사용할 props 타입
interface VideoPlayerProps {
  contentData: DetailedContentData;
  onLoadError?: () => void;
}

// 트레일러 영상 재생 컴포넌트
export const VideoPlayer = ({ contentData, onLoadError }: VideoPlayerProps) => {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>(contentData.backdropUrl);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // YouTube iframe 로드 완료 핸들러 (최적화됨)
  const handleIframeLoad = useCallback(() => {
    // iframe DOM이 로드되면 약간의 버퍼 시간 후 비디오 표시
    // YouTube 플레이어가 실제로 초기화되는 시간 고려
    setTimeout(() => {
      setIsVideoReady(true);
    }, 500); // 0.5초
  }, []);

  // 에러 핸들러
  const handleIframeError = useCallback(() => {
    setHasError(true);
    onLoadError?.();
  }, [onLoadError]);

  // YouTube postMessage API를 통한 플레이어 상태 감지 (고급 최적화)
  const handleMessage = useCallback((event: MessageEvent) => {
    // YouTube iframe에서 오는 메시지만 처리
    if (event.origin !== 'https://www.youtube.com') return;

    try {
      const data = JSON.parse(event.data);

      // YouTube 플레이어가 실제로 준비되었을 때
      if (data.event === 'onReady' || data.event === 'onStateChange') {
        setIsVideoReady(true);
      }
    } catch (error) {
      // JSON 파싱 에러는 무시 (다른 메시지일 수 있음)
      console.log(error);
    }
  }, []);

  useEffect(() => {
    setIsVideoReady(false);
    setHasError(false);

    const iframe = iframeRef.current;
    if (!iframe) return;

    // 이벤트 리스너 등록
    iframe.addEventListener('load', handleIframeLoad);
    iframe.addEventListener('error', handleIframeError);

    // YouTube postMessage API 리스너 (더 정확한 감지)
    window.addEventListener('message', handleMessage);

    // 폴백 타이머 (최대 5초 후 강제 표시)
    const fallbackTimer = setTimeout(() => {
      if (!hasError) {
        setIsVideoReady(true);
      }
    }, 5000);

    return () => {
      iframe.removeEventListener('load', handleIframeLoad);
      iframe.removeEventListener('error', handleIframeError);
      window.removeEventListener('message', handleMessage);
      clearTimeout(fallbackTimer);
    };
  }, [
    contentData.trailerUrl,
    handleIframeLoad,
    handleIframeError,
    handleMessage,
    hasError,
  ]);

  // 불러오기 실패 시 백드롭 이미지 표시
  if (hasError) {
    return (
      <div className="relative w-full h-90 rounded-t-lg overflow-hidden">
        <Image
          src={imgSrc}
          alt={contentData.title}
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
            {contentData.openDate !== null ? (
              <span>{formattingOpenDate(contentData.openDate)}</span>
            ) : null}
            <span>{contentData.rating}</span>
            <span>{contentData.countries[0]}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-90 rounded-t-lg bg-black overflow-hidden">
      {/* 백드롭 이미지 (로딩 중에만 표시) */}
      {!isVideoReady && (
        <>
          <Image
            src={imgSrc}
            alt={contentData.title}
            fill
            className="object-cover"
            onError={() => setImgSrc('/images/default-backdrop.png')} // 이미지 로딩 실패 시 기본 이미지로 대체
            priority
          />
          {/* 그라데이션 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

          {/* 콘텐츠 정보 */}
          <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center space-y-3">
            <span className="text-3xl font-bold text-white">
              {contentData.title}
            </span>
            <div className="flex items-center space-x-5 text-sm text-gray-200">
              <span>{formattingOpenDate(contentData.openDate)}</span>
              <span>{contentData.rating}</span>
              <span>{contentData.countries[0]}</span>
            </div>
          </div>
        </>
      )}

      {/* YouTube iframe - 더 빠른 transition */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
          isVideoReady ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <iframe
          ref={iframeRef}
          src={`${getYouTubeEmbedUrl(contentData.trailerUrl)}&enablejsapi=1`} // JS API 활성화
          title={`${contentData.title} trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full border-0"
          style={{
            width: '100%',
            height: '100%',
            border: 'none',
          }}
        />
      </div>
    </div>
  );
};
