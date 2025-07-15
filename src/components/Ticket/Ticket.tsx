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

  useEffect(() => {
    const el = descRef.current;
    if (el) {
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      setShowMore(el.scrollHeight > lineHeight * 3);
    }
  }, [movie.description]);

  if (variant === 'detail') {
    return (
      <Card className="flex flex-col w-full h-full min-w-70 min-h-126 max-w-100 max-h-180 border-none rounded-2xl overflow-hidden">
        <div className="relative flex-grow">
          <Image
            src={movie.posterUrl || '/placeholder.svg'}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <CardHeader>
          <div className="space-y-1 pb-2">
            <h3 className="font-bold text-lg leading-tight">{movie.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{movie.categories.genres.join(', ')}</span>
              <span>•</span>
              <span>{movie.rating}</span>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-sm">플랫폼</h4>
            <div className="flex flex-wrap gap-2">
              {movie.platforms
                .map((platform) => {
                  const logo = getPlatformLogo(platform);
                  return logo ? { platform, logo } : null;
                })
                .filter(
                  (item): item is { platform: string; logo: string } => !!item,
                )
                .map(({ platform, logo }) => (
                  <CircleOption
                    key={platform}
                    label={platform}
                    imageSrc={logo}
                    size="sm"
                    onClick={() => {}}
                    showLabel={false}
                  />
                ))}
            </div>
          </div>
        </CardHeader>

        <CardContent
          className={[
            'flex flex-col space-y-3 py-2',
            'flex-1',
            expanded ? 'overflow-auto' : 'overflow-hidden',
          ].join(' ')}
        >
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-60">감독</span>
              <span className="ml-auto">{movie.directors}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-60">개봉일</span>
              <span className="ml-auto">{movie.openDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-60">러닝타임</span>
              <span className="ml-auto">{movie.runningTime}분</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-60">연령 등급</span>
              <span className="ml-auto">{movie.rating}</span>
            </div>
          </div>

          <div className="flex flex-col flex-1">
            <h4 className="font-medium text-sm mb-2">줄거리</h4>
            <div
              ref={descRef}
              className={[
                'text-sm text-muted-foreground leading-relaxed',
                expanded
                  ? 'overflow-auto' // flex-1 안에서 스크롤
                  : 'line-clamp-3', // 3줄로 자름
              ].join(' ')}
            >
              {movie.description}
            </div>
          </div>

          <div className="flex justify-end flex-shrink-0">
            {!expanded && showMore && (
              <button
                onClick={() => setExpanded(true)}
                className="text-xs text-gray-500 hover:underline"
              >
                더보기
              </button>
            )}
            {expanded && (
              <button
                onClick={() => setExpanded(false)}
                className="text-xs text-gray-500 hover:underline"
              >
                접기
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'result') {
    return (
      <Card className="flex flex-col w-full h-full min-w-70 min-h-126 max-w-100 max-h-180 border-none rounded-2xl overflow-hidden">
        <div className="relative flex-grow">
          <Image
            src={movie.posterUrl || '/placeholder.svg'}
            alt={movie.title}
            fill
            className="object-cover"
            priority
          />
        </div>
        <CardHeader>
          <div className="space-y-1">
            <h3 className="font-bold text-lg leading-tight">{movie.title}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{movie.categories.genres.join(', ')}</span>
              <span>•</span>
              <span>{movie.rating}</span>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col space-y-3">
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-60">감독</span>
              <span className="ml-auto">{movie.directors}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-60">러닝타임</span>
              <span className="ml-auto">{movie.runningTime}분</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'initial') {
    return (
      <Card className="flex flex-col w-full h-full min-w-70 min-h-126 max-w-100 max-h-180 border-none rounded-2xl overflow-hidden">
        <div className="relative flex-grow">
          <Image
            src={movie.posterUrl || '/placeholder.svg'}
            alt={movie.title}
            fill
            className="object-cover"
            priority
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
              {movie.categories.genres.slice(0, 4).map((genre) => (
                <Badge
                  key={genre}
                  variant="outline"
                  className="text-sm border-white/30 text-white hover:bg-white/10"
                >
                  #{genre}
                </Badge>
              ))}

              {movie.categories.genres.length > 4 && (
                <Badge
                  variant="outline"
                  className="text-xs border-white/30 text-white"
                >
                  +{movie.categories.genres.length - 4}
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
