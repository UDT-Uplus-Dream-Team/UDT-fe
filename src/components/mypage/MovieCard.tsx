import { MovieCardProps } from '@/types/mypage/Mypage';
import Image from 'next/image';
import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

const MovieCard = ({
  title,
  genres,
  runtime,
  releaseDate,
  rating,
  description,
  thumbnailUrl,
  platformList,
}: MovieCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="w-[300px] h-[538px] rounded-xl shadow-md bg-white flex flex-col overflow-hidden">
      {/* 썸네일 */}
      <div className="w-full h-[130px] relative">
        <Image
          src={thumbnailUrl}
          alt={title}
          layout="fill"
          objectFit="cover"
          className="rounded-t-xl"
        />
      </div>

      {/* 썸네일 아래 점선 */}
      <div className="border-t-2 border-dashed border-primary-900 my-2" />

      {/* 제목, 장르 블럭 */}
      <div className="px-4">
        <h2 className="text-[25px] text-black font-bold">{title}</h2>

        <div className="flex gap-2 text-xs text-gray-500 font-bold mt-1">
          {genres.map((g) => (
            <span
              key={g}
              className="bg-gray-200 text-gray-700 rounded px-2 py-[2px]"
            >
              {g}
            </span>
          ))}
        </div>
      </div>

      {/* 장르 아래 점선 */}
      <div className="border-t-2 border-dashed border-primary-900 my-4" />

      {/* ✅ 플랫폼 아이콘 아바타로 교체된 부분 */}
      <div className="flex gap-2 px-4 mb-2">
        {platformList.map((platform) => (
          <button
            key={platform.name}
            onClick={() => window.open(platform.url, '_blank')}
            className="w-8 h-8"
          >
            <Avatar className="w-8 h-8 border border-primary-900">
              <AvatarImage src={platform.iconUrl} alt={platform.name} />
              <AvatarFallback className="text-[10px]">
                {platform.name[0]}
              </AvatarFallback>
            </Avatar>
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2 px-4 py-2 flex-grow mt-2">
        {/* 러닝타임 등 정보 */}
        <div className="grid grid-cols-[auto_1fr] gap-x-4 text-sm text-gray-400">
          <span>러닝타임</span>
          <span className="text-black">{runtime}</span>

          <span>개봉일</span>
          <span className="text-black">{releaseDate}</span>

          <span>연령 등급</span>
          <span className="text-black">{rating}</span>
        </div>

        {/* 설명 */}
        <div className="flex flex-col mt-1">
          <h3 className="text-sm text-gray-400">줄거리</h3>

          {/* 설명 본문 영역 */}
          <div
            className={`text-sm text-gray-700 transition-all duration-300 ${
              isExpanded
                ? 'max-h-[150px] overflow-y-auto pr-1'
                : 'line-clamp-4 overflow-hidden'
            }`}
          >
            {description}
          </div>

          {/* 더보기/접기 버튼 */}
          <button
            className="text-xs text-primary-500 mt-1"
            onClick={toggleDescription}
          >
            {isExpanded ? '접기 ▲' : '더보기 ▼'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
