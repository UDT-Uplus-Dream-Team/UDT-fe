import Image from 'next/image';
import { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PLATFORMS } from '@/lib/platforms';
import { ContentDetail } from '@/types/ContentDetail';

const MovieCard = ({
  title,
  categories,
  runningTime,
  openDate,
  rating,
  description,
  backdropUrl,
  platforms,
}: ContentDetail) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleDescription = () => {
    setIsExpanded((prev) => !prev);
  };

  const getPlatformIconUrl = (platformName: string): string | null => {
    const matched = PLATFORMS.find((p) => p.label === platformName);
    if (!matched) return null;
    return `/images/ott/${matched.id}.png`;
  };

  const genreList = categories.flatMap((cat) => cat.genres);

  const availablePlatforms = platforms.filter((p) => p.isAvailable);

  return (
    <div className="w-[300px] h-[538px] rounded-xl shadow-md bg-white flex flex-col overflow-hidden">
      {/* 썸네일 */}
      <div className="w-full h-[130px] relative">
        <Image
          src={backdropUrl}
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
          {genreList.map((genre) => (
            <span
              key={genre}
              className="bg-gray-200 text-gray-700 rounded px-2 py-[2px]"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>

      {/* 장르 아래 점선 */}
      <div className="border-t-2 border-dashed border-primary-900 my-4" />

      {/* 플랫폼 아이콘 */}
      <div className="flex gap-2 px-4 mb-2">
        {availablePlatforms.map((platform) => {
          const iconUrl = getPlatformIconUrl(platform.platformType);
          return iconUrl ? (
            <button
              key={platform.platformType}
              onClick={() => window.open(platform.watchUrl, '_blank')}
              className="w-8 h-8"
            >
              <Avatar className="w-8 h-8 border border-primary-900">
                <AvatarImage src={iconUrl} alt={platform.platformType} />
                <AvatarFallback className="text-[10px]">
                  {platform.platformType[0]}
                </AvatarFallback>
              </Avatar>
            </button>
          ) : null;
        })}
      </div>

      {/* 콘텐츠 상세 정보 */}
      <div className="flex flex-col gap-2 px-4 py-2 flex-grow mt-2">
        <div className="grid grid-cols-[auto_1fr] gap-x-4 text-sm text-gray-400">
          <span>러닝타임</span>
          <span className="text-black">{runningTime}분</span>

          <span>개봉일</span>
          <span className="text-black">{openDate}</span>

          <span>연령 등급</span>
          <span className="text-black">{rating}</span>
        </div>

        {/* 설명 */}
        <div className="flex flex-col mt-1">
          <h3 className="text-sm text-gray-400">줄거리</h3>

          <div
            className={`text-sm text-gray-700 transition-all duration-300 ${
              isExpanded
                ? 'max-h-[150px] overflow-y-auto pr-1'
                : 'line-clamp-4 overflow-hidden'
            }`}
          >
            {description}
          </div>

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
