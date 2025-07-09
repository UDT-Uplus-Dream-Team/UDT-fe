import Image from 'next/image';
import { PosterCardProps } from '@type/PosterCardProps';

// 포스터 카드 컴포넌트 (누르면 상세페이지로 이동)
export const PosterCard = ({
  title,
  image,
  isTitleVisible = true,
  onClick,
}: PosterCardProps) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer flex flex-col items-center"
    >
      <Image
        src={image}
        alt={title}
        width={100}
        height={142}
        className="object-cover rounded-lg"
      />
      {isTitleVisible && ( // 포스터 카드 title(제목) 표시 여부 (width 100px 제한)
        <span className="text-sm text-white font-normal mt-2 max-w-[100px] truncate block">
          {title}
        </span>
      )}
    </div>
  );
};
