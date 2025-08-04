import { checkImgSrcValidity } from '@utils/checkImgSrcValidity';
import Image from 'next/image';
import { useCallback, useMemo, useState } from 'react';

interface PosterCardProps {
  title: string | undefined;
  image: string;
  isTitleVisible?: boolean;
  onClick: () => void;
  size?: 'sm' | 'lg';
  isDeletable?: boolean;
  isSelected?: boolean;
}

// 포스터 카드 컴포넌트 (누르면 상세페이지로 이동)
export const PosterCard = ({
  title,
  image,
  isTitleVisible = true,
  onClick,
  size = 'sm',
  isDeletable = false,
  isSelected = false,
}: PosterCardProps) => {
  const [hasError, setHasError] = useState(false); // 이미지 로딩 오류 여부 상태 관리
  const [hasLoaded, setHasLoaded] = useState(false);

  // 드래그(누름) 시 기본 동작 막기
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault(); // 기본 클릭/포커스/이미지 드래그 방지!
  };

  // 사이즈별 width/height 설정
  const dimensions =
    size === 'lg' ? { width: 160, height: 220 } : { width: 110, height: 154 };

  const titleClass =
    size === 'lg' ? 'text-base max-w-[160px]' : 'text-sm max-w-[120px]';

  // 이미지가 유효한 지 렌더 타임에 검증하는 메소드 validSrc
  const validSrc = useMemo(() => {
    if (hasError) {
      // 에러가 있다면
      return '/images/default-poster.png';
    }

    if (checkImgSrcValidity(image)) {
      // 이미지 경로를 검증했을 때, 유효한지 여부 탐색
      return image;
    } else {
      return '/images/default-poster.png';
    }
  }, [image, hasError]);

  // onError 핸들러 (한 번만 호출돼도 hasError=true)
  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  // 로드가 다 되었는지 확인하는 handleLoadComplete
  const handleLoadComplete = useCallback(() => setHasLoaded(true), []);

  return (
    <div
      onClick={onClick}
      onPointerDown={handlePointerDown}
      className="relative cursor-pointer flex flex-col items-center"
      style={{
        width: `${dimensions.width}px`,
        minWidth: `${dimensions.width}px`,
        maxWidth: `${dimensions.width}px`,
      }}
    >
      {/* 이미지 로딩 전: 스켈레톤 */}
      {!hasLoaded && (
        <div
          className={`inset-0 bg-gray-100 animate-pulse rounded-lg transition-opacity duration-500 ease-in-out ${
            hasLoaded ? 'opacity-0' : 'opacity-100'
          }`}
          style={{
            width: `${dimensions.width}px`,
            height: `${dimensions.height}px`,
            backgroundColor: '#a4a9b0', // Tailwind의 bg-gray-300
          }}
        />
      )}

      {/* 포스터 이미지 (오류 나면 default-poster.png 로 대체)*/}
      <Image
        src={validSrc}
        alt={title || '포스터'}
        width={dimensions.width}
        height={dimensions.height}
        onError={handleError}
        onLoad={handleLoadComplete}
        unoptimized
        style={{
          position: hasLoaded ? 'static' : 'absolute',
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
        className={`object-cover rounded-lg transition-opacity duration-500 ease-in-out delay-100 ${
          isDeletable && isSelected ? 'opacity-60' : 'opacity-100'
        }`}
      />
      {/* 삭제 모드 체크 아이콘 */}
      {isDeletable && (
        <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center z-10">
          {isSelected && (
            <span className="text-xs text-black font-bold">✔</span>
          )}
        </div>
      )}

      {isTitleVisible && ( // 포스터 카드 title(제목) 표시 여부 제한 사이즈별 분기
        <span
          className={`${titleClass} text-white font-normal mt-2 truncate block`}
        >
          {title}
        </span>
      )}
    </div>
  );
};
