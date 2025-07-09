'use client';

import { RecommendationCardProps } from '@/types/mypage/Mypage';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const RecommendationCard = ({
  imageUrl,
  title,
  description,
  route,
}: RecommendationCardProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(route);
  };

  return (
    <div className="relative w-[310px] h-[250px] rounded-[20px] overflow-hidden shadow-md">
      {/* 배경 이미지 */}
      <Image src={imageUrl} alt={title} fill className="object-cover" />

      {/* 텍스트 및 버튼 */}
      <div className="absolute bottom-0 left-0 p-3 w-full text-white">
        <p className="text-[15px] mb-1 font-bold">{title}</p>
        <p className="text-[11px]">{description}</p>
        <button
          onClick={handleClick}
          className="w-full my-2 py-2 text-[12px] bg-white/40 text-white rounded-[10px] font-semibold cursor-pointer"
        >
          보러가기
        </button>
      </div>
    </div>
  );
};

export default RecommendationCard;
