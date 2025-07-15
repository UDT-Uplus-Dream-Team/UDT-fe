import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { MockContentData } from '@utils/getMockContentData';

// 트레일러 영상 재생 컴포넌트에 사용할 props 타입
interface VideoPlayerProps {
  contentData: MockContentData;
  onLoadError?: () => void;
}

// 트레일러 영상 재생 컴포넌트
export const VideoPlayer = ({ contentData, onLoadError }: VideoPlayerProps) => {
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    setIsVideoReady(false);
    setHasError(false);

    // YouTube iframe 로드 완료를 위한 타이머 (더 안정적)
    const loadTimer = setTimeout(() => {
      setIsVideoReady(true);
    }, 2000); // 2초 후 비디오 표시

    const handleLoad = () => {
      // iframe 로드 완료 시 약간의 지연 후 비디오 표시
      setTimeout(() => {
        setIsVideoReady(true);
      }, 500);
    };

    const handleError = () => {
      setHasError(true);
      onLoadError?.();
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleLoad);
      iframe.addEventListener('error', handleError);

      return () => {
        iframe.removeEventListener('load', handleLoad);
        iframe.removeEventListener('error', handleError);
        clearTimeout(loadTimer);
      };
    }

    return () => {
      clearTimeout(loadTimer);
    };
  }, [contentData.trailerUrl, onLoadError]);

  // 불러오기 실패 시 백드롭 이미지 표시
  if (hasError) {
    return (
      <Image
        src={contentData.backdropUrl || '/placeholder.svg'}
        alt={contentData.title}
        fill
        className="object-cover"
      />
    );
  }

  return (
    <div className="relative w-full h-90 rounded-t-lg overflow-hidden">
      {/* 백드롭 이미지 (로딩 중에만 표시) */}
      {!isVideoReady && (
        <>
          <Image
            src={contentData.backdropUrl || '/placeholder.svg'}
            alt={contentData.title}
            fill
            className="object-cover"
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
              <span>{contentData.openDate.split('-')[0]}</span>
              <span>{contentData.rating}</span>
              <span>{contentData.countries[0]}</span>
            </div>
          </div>
        </>
      )}

      {/* YouTube 자동 재생 iframe - 16:9 비율 유지 */}
      <div
        className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
          isVideoReady ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <iframe
          ref={iframeRef}
          src={contentData.trailerUrl}
          title={`${contentData.title} trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          className="w-full h-full border-0"
          style={{
            border: 'none',
            aspectRatio: '16/9',
            objectFit: 'cover',
          }}
        />
      </div>
    </div>
  );
};
