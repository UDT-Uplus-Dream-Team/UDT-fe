import Image from 'next/image';
import type { StaticImageData } from 'next/image';

interface PosterCardProps {
  title: string;
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
  // 사이즈별 width/height 설정
  const dimensions =
    size === 'lg' ? { width: 160, height: 220 } : { width: 100, height: 142 };

  const titleClass =
    size === 'lg' ? 'text-base max-w-[160px]' : 'text-sm max-w-[100px]';

  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer flex flex-col items-center"
    >
      <Image
        src={image}
        alt={title}
        width={dimensions.width}
        height={dimensions.height}
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
