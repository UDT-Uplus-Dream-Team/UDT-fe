import * as React from 'react';
import { cn } from '@lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';

// OTT 로고 이미지 맵핑 (filterData.ts와 일치하도록 수정)
const OTT_IMAGES = {
  넷플릭스: '/images/ott/neflix.png',
  '디즈니+': '/images/ott/disneyPlus.png',
  티빙: '/images/ott/tving.png',
  왓챠: '/images/ott/watcha.png',
  웨이브: '/images/ott/wavve.png',
  '애플티비+': '/images/ott/appleTv.png',
  쿠팡플레이: '/images/ott/coupangPlay.png',
} as const;

type OttLabel = keyof typeof OTT_IMAGES; // OttLabel은 OTT_IMAGES의 키 타입

type OttCircleOptionProps = {
  label: OttLabel; // OTT 라벨 텍스트 (맵핑된 OTT 중 하나)
  isSelected?: boolean; // 선택 여부
  showLabel?: boolean; // 라벨 표시 여부
  onToggle: (label: string, isSelected: boolean) => void; // 토글 이벤트 핸들러
};

// OTT 원형 옵션 컴포넌트 (52px x 52px 고정 크기)
export function OttCircleOption({
  label,
  isSelected = false,
  onToggle,
  showLabel = false,
  ...props
}: OttCircleOptionProps) {
  // label을 통해 자동으로 이미지 소스 가져오기
  const imageSrc = OTT_IMAGES[label];

  const handleClick = () => {
    onToggle(label, !isSelected);
  };

  return (
    <button
      onClick={handleClick}
      className={cn('flex flex-col items-center space-y-1')}
      {...props}
    >
      <div
        className={cn(
          'relative rounded-full overflow-hidden border-2 transition-all w-[52px] h-[52px]',
          isSelected ? 'border-white' : 'border-transparent',
        )}
      >
        <Avatar className="w-full h-full rounded-full">
          <AvatarImage
            src={imageSrc}
            alt={label}
            className="object-cover w-full h-full"
          />
          <AvatarFallback>{label[0]}</AvatarFallback>
        </Avatar>

        {/* 선택되지 않은 경우 검은 필터 (60% 투명도) 적용 */}
        {!isSelected && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            {/* 필터만 적용하고 내용은 없음 */}
          </div>
        )}
      </div>
      {showLabel && <span className="text-sm text-white mt-1">{label}</span>}
    </button>
  );
}
