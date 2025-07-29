import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { StoredContentDetail } from '@type/profile/StoredContentDetail';
import { Card, CardContent, CardHeader } from '../ui/card';
import { CircleOption } from '../common/circleOption';
import { getPlatformLogo } from '@/utils/getPlatformLogo';

const fallbackUrls: Record<string, string> = {
  넷플릭스: 'https://www.netflix.com',
  티빙: 'https://www.tving.com',
  쿠팡플레이: 'https://www.coupangplay.com',
  웨이브: 'https://www.wavve.com',
  '디즈니+': 'https://www.disneyplus.com',
  왓챠: 'https://watcha.com',
  애플티비: 'https://tv.apple.com',
};

const MovieCard = ({
  title,
  genres,
  runningTime,
  openDate,
  rating,
  description,
  backdropUrl,
  platforms,
  directors,
}: StoredContentDetail) => {
  const [expanded, setExpanded] = useState(false);
  const [imgSrc, setImgSrc] = useState(backdropUrl);
  const descRef = useRef<HTMLParagraphElement>(null);

  const handlePlatformClick = (platformType: string, watchUrl?: string) => {
    const url = watchUrl ?? fallbackUrls[platformType];
    if (url) window.open(url, '_blank');
  };

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

  //더보기 초기화
  useEffect(() => {
    setExpanded(false); // 강제 초기화
  }, [title]);

  const cardBaseClass =
    'flex flex-col min-w-[280px] min-h-[440px] max-w-[400px] max-h-[680px] w-full h-full border-none rounded-2xl overflow-hidden';

  return (
    <Card className={cardBaseClass}>
      <div className="relative w-full h-[30%] min-h-[135px] md:min-h-[220px]">
        <Image
          src={imgSrc}
          alt={title}
          fill
          unoptimized
          className="object-cover"
          priority
          onError={() => setImgSrc('/images/default-backdrop.png')}
        />
      </div>
      <div className="overflow-y-auto">
        {!expanded && (
          <CardHeader>
            <div className="space-y-1 pb-2">
              <h3 className="font-bold text-xl md:text-2xl leading-tight">
                {title}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{genres.join(', ')}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <h4 className="font-medium text-sm md:text-lg">플랫폼</h4>
                <span className="text-xs text-muted-foreground">
                  (플랫폼 클릭 바로 보러가기)
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {platforms.map((platform) => {
                  const imageSrc = getPlatformLogo(platform.platformType);
                  if (!imageSrc) return null;

                  return (
                    <CircleOption
                      key={platform.platformType}
                      label={platform.platformType}
                      imageSrc={imageSrc}
                      size="sm"
                      onClick={() =>
                        handlePlatformClick(
                          platform.platformType,
                          platform.watchUrl,
                        )
                      }
                      showLabel={false}
                    />
                  );
                })}
              </div>
            </div>
          </CardHeader>
        )}
        <CardContent className="relative flex flex-col space-y-3 py-2 flex-1">
          {!expanded ? (
            <>
              {/* 일반 정보 */}
              <div className="space-y-2 text-sm md:text-base">
                <div className="flex items-center gap-2">
                  <span className="text-gray-60">감독</span>
                  <span className="ml-auto">{formatInfo(directors)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-60">개봉일</span>
                  <span className="ml-auto"> {formatDateInfo(openDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-60">러닝타임</span>
                  <span className="ml-auto">{formatInfo(runningTime)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-60">연령 등급</span>
                  <span className="ml-auto">{formatInfo(rating)}</span>
                </div>
              </div>
              {/* 줄거리 요약 */}
              <div className="relative">
                <h4 className="font-medium text-sm md:text-lg mb-2">줄거리</h4>
                <p
                  ref={descRef}
                  className="text-sm md:text-base leading-relaxed line-clamp-2"
                >
                  {description}
                </p>

                <div className="flex justify-end mt-1">
                  <button
                    onClick={() => setExpanded(true)}
                    className="text-xs md:text-sm text-primary-500 hover:underline"
                  >
                    더보기 ▲
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* 줄거리 전체 - 기존 정보 사라지고 이거만 */}
              <div className="flex flex-col justify-between flex-1 px-2">
                <div>
                  <h4 className="font-medium text-sm md:text-lg mb-2">
                    줄거리
                  </h4>
                  <p className="text-sm md:text-base leading-relaxed overflow-hidden">
                    {description}
                  </p>
                </div>
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setExpanded(false)}
                    className="text-xs md:text-sm text-primary-500 hover:underline"
                  >
                    접기 ▼
                  </button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default MovieCard;
