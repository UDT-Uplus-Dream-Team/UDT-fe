import React from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MovieData } from '@/types/Moviedata';

type RepresentativeContentCardProps = {
  movie: MovieData;
  onClick?: () => void;
};

// 화면 위에 표시될 엄청 큰 카드 (콘텐츠 정보 표시)
export const RepresentativeContentCard = ({
  movie,
  onClick,
}: RepresentativeContentCardProps) => {
  return (
    <Card
      className="flex flex-col w-98 h-135 overflow-hidden group cursor-pointer hover:scale-105 transition-transform duration-200"
      onClick={onClick}
    >
      <div className="relative flex-grow">
        <Image
          src={movie.posterUrl || '/placeholder.svg'}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />

        {/* 그라데이션 오버레이 - 텍스트 가독성을 위한 배경 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />

        {/* 하단 콘텐츠 영역 */}
        <div className="absolute bottom-0 left-0 right-0 px-5 text-white flex flex-col items-center z-10">
          {/* 제목 */}
          <h3 className="font-bold text-xl mb-3 leading-tight text-center">
            {movie.title}
          </h3>

          {/* 장르 태그들 */}
          <div className="flex flex-wrap gap-1 pb-5 justify-center">
            {movie.genres.slice(0, 4).map((genre) => (
              <Badge
                key={genre}
                variant="outline"
                className="text-sm border-white/30 text-white hover:bg-white/10"
              >
                #{genre}
              </Badge>
            ))}
            {movie.genres.length > 4 && (
              <Badge
                variant="outline"
                className="text-xs border-white/30 text-white"
              >
                +{movie.genres.length - 4}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
