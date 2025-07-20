import Image from 'next/image';
import type { StaticImageData } from 'next/image';
import { useState } from 'react';

interface PosterCardProps {
  title: string | undefined;
  image: string | StaticImageData;
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
  const [imgSrc, setImgSrc] = useState<string | StaticImageData>(image);

  // 사이즈별 width/height 설정
  const dimensions =
    size === 'lg' ? { width: 160, height: 220 } : { width: 110, height: 154 };

  const titleClass =
    size === 'lg' ? 'text-base max-w-[160px]' : 'text-sm max-w-[120px]';

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer flex flex-col items-center"
      style={{
        width: `${dimensions.width}px`,
        minWidth: `${dimensions.width}px`,
        maxWidth: `${dimensions.width}px`,
      }}
    >
      {/* 포스터 이미지 (오류 나면 default-poster.png 로 대체)*/}
      <Image
        src={imgSrc}
        alt={title || '포스터'}
        width={dimensions.width}
        height={dimensions.height}
        onError={() => setImgSrc('/images/default-poster.png')}
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
        }}
        className={`object-cover rounded-lg transition-opacity duration-200 ${
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
