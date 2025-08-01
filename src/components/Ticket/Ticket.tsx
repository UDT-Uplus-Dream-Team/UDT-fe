import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Heart, X } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@components/ui/card';
import { Badge } from '@components/ui/badge';
import { TicketComponent } from '@type/recommend/TicketComponent';
import { getPlatformLogo } from '@utils/getPlatformLogo';
import { CircleOption } from '@components/common/circleOption';

type TicketProps = {
  movie: TicketComponent;
  feedback?: 'liked' | 'unliked' | 'neutral';
  variant: 'initial' | 'detail' | 'result';
};

export const Ticket = ({ movie, variant, feedback }: TicketProps) => {
  const [expanded, setExpanded] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const descRef = useRef<HTMLParagraphElement>(null);

  const formatInfo = (
    value: string | number | string[] | null | undefined,
    fallback = '정보 없음',
  ): string => {
    if (Array.isArray(value)) return value.length > 0 ? value[0] : fallback;
    if (typeof value === 'number') return value > 0 ? `${value}분` : fallback;
    return value ? value : fallback;
  };

  const formatDateInfo = (
    value: string | null | undefined,
    fallback = '정보 없음',
  ): string => {
    if (!value) return fallback;
    const date = new Date(value);
    if (isNaN(date.getTime())) return fallback;

    return date.toISOString().slice(0, 10); // 'YYYY-MM-DD'
  };

  //카드 크기 고정을 위한 값지정
  const cardBaseClass =
    'flex flex-col min-w-[280px] min-h-[440px] max-w-[400px] max-h-[680px] w-full h-full border-none rounded-2xl overflow-hidden';

  const [backdropSrc, setBackdropSrc] = useState(
    movie.backdropUrl || '/images/default-backdrop.png',
  );

  const [posterSrc, setPosterSrc] = useState(
    movie.posterUrl || '/images/default-poster.png',
  );

  //더보기 초기화
  useEffect(() => {
    setExpanded(false); // 강제 초기화
  }, [movie.contentId]);

  useEffect(() => {
    const el = descRef.current;
    if (el) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      setShowMore(el.scrollHeight > lineHeight * 3);
    }
  }, [movie.description]);

  if (variant === 'detail') {
    return (
      <Card className={cardBaseClass}>
        <div className="relative w-full h-[30%] min-h-[135px] md:min-h-[220px]">
          <Image
            src={backdropSrc}
            alt={movie.title}
            fill
            unoptimized
            className="object-cover"
            priority
            onError={() => setBackdropSrc('/images/default-backdrop.png')}
          />
        </div>
        <div className="overflow-y-auto">
          {!expanded && (
            <CardHeader>
              <div className="space-y-1 pb-2">
                <h3 className="font-bold text-xl leading-tight">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div>{movie.genres.join(', ')}</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm md:text-lg">플랫폼</h4>
                <div className="flex flex-wrap gap-2">
                  {movie.platforms.map((platformLabel) => {
                    const imageSrc = getPlatformLogo(platformLabel);
                    return imageSrc ? (
                      <CircleOption
                        key={platformLabel}
                        label={platformLabel}
                        imageSrc={imageSrc}
                        size="sm"
                        onClick={() => {}}
                        showLabel={false}
                      />
                    ) : null;
                  })}
                </div>
              </div>
            </CardHeader>
          )}
          <CardContent className="relative flex flex-col space-y-3 py-3 flex-1">
            {!expanded ? (
              <>
                {/* 일반 정보 */}
                <div className="space-y-2 text-sm md:text-base">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-60">감독</span>
                    <span className="ml-auto">
                      {formatInfo(movie.directors)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-60">개봉일</span>
                    <span className="ml-auto">
                      {formatDateInfo(movie.openDate)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-60">러닝타임</span>
                    <span className="ml-auto">
                      {formatInfo(movie.runningTime)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-60">연령 등급</span>
                    <span className="ml-auto">{formatInfo(movie.rating)}</span>
                  </div>
                </div>

                {/* 줄거리 요약 */}
                <div className="relative">
                  <h4 className="font-medium text-sm md:text-lg mb-2">
                    줄거리
                  </h4>
                  <p
                    ref={descRef}
                    className="text-sm md:text-base leading-relaxed line-clamp-2"
                  >
                    {movie.description}
                  </p>

                  {showMore && (
                    <div className="flex justify-end mt-1">
                      <button
                        onClick={() => setExpanded(true)}
                        className="text-xs md:text-sm text-primary-500 hover:underline"
                      >
                        더보기
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                {/* 줄거리 전체 보기 */}
                <div className="flex flex-col justify-between flex-1 px-2">
                  <div>
                    <h4 className="font-bold text-lg md:text-xl mb-2">
                      줄거리
                    </h4>
                    <p className="text-sm md:text-base leading-relaxed overflow-hidden">
                      {movie.description}
                    </p>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button
                      onClick={() => setExpanded(false)}
                      className="text-xs md:text-sm text-primary-500 hover:underline"
                    >
                      접기
                    </button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </div>
      </Card>
    );
  }

  if (variant === 'result') {
    return (
      <Card className={cardBaseClass}>
        <div className="relative flex-grow pointer-events-none">
          <Image
            src={posterSrc}
            alt={movie.title}
            fill
            unoptimized
            className="object-cover"
            priority
            onError={() => setPosterSrc('/images/default-poster.png')}
          />
        </div>
        <CardHeader>
          <div className="space-y-1">
            <h3 className="font-bold text-lg leading-tight">{movie.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{movie.genres.join(', ')}</span>
              {/* <span>•</span>
              <span>{movie.rating}</span> */}
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col py-3 space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-60">감독</span>
              <span className="ml-auto">{formatInfo(movie.directors)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-60">
                {movie.category === '드라마' ? '회차' : '러닝타임'}
              </span>
              <span className="ml-auto">
                {movie.category === '드라마'
                  ? movie.episode
                  : formatInfo(movie.runningTime)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'initial') {
    return (
      <Card className={cardBaseClass}>
        <div className="relative flex-grow">
          <Image
            src={posterSrc}
            alt={movie.title}
            fill
            unoptimized
            className="object-cover"
            priority
            onError={() => setPosterSrc('/images/default-poster.png')}
          />
          {feedback === 'liked' && (
            <div className="absolute inset-0 z-20 flex justify-start items-center bg-like/70">
              <div className="p-4 flex items-center gap-2 text-white">
                <Heart className="w-6 h-6 fill-current" />
                <div className="flex flex-col">
                  <span className="font-bold text-lg">좋아요</span>
                  <span className="text-xs">이런 컨텐츠 보고 싶어요!</span>
                </div>
              </div>
            </div>
          )}
          {feedback === 'unliked' && (
            <div className="absolute inset-0 z-20 flex justify-end items-center bg-dislike/50">
              <div className="p-4 flex items-center gap-2 text-white">
                <div className="flex flex-col text-right">
                  <span className="font-bold text-lg">싫어요</span>
                  <span className="text-xs">이런 컨텐츠는 별로예요</span>
                </div>
                <X className="w-6 h-6 fill-current" />
              </div>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
          <div className="absolute bottom-0 left-0 right-0 px-5 text-white flex flex-col items-center z-10">
            <h3 className="font-bold text-xl mb-3 leading-tight text-center">
              {movie.title}
            </h3>
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
  }

  return null;
};
