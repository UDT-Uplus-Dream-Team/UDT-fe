'use client';

import { RecommendationCardProps } from '@type/profile/Mypage';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const RecommendationCard = ({
  imageUrl,
  title,
  description,
  route,
  disabled = false,
}: RecommendationCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <div className="relative w-full max-w-[500px] max-h-[320px] aspect-[5/4] rounded-[20px] overflow-hidden shadow-md">
      {/* 배경 이미지 */}
      <Image
        src={imageUrl}
        alt={title}
        fill
        unoptimized
        className="object-cover"
      />

      {/* 그라데이션 배경 (하단 어둡게) */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/0 z-10" />

      {/* 텍스트 내용 */}
      <div className="absolute bottom-0 left-0 p-3 w-full text-white text-center z-20">
        <p className="text-[15px] mb-1 font-bold">{title}</p>
        <p className="text-[11px]">{description}</p>
        <div className="w-full flex justify-center">
          <button
            onClick={handleClick}
            disabled={disabled}
            className="max-w-[200px] w-full py-2 mt-2 bg-white/40 text-white rounded-[10px] text-[12px] font-semibold cursor-pointer"
          >
            보러가기
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
