import * as React from 'react';
import { cn } from '@lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { getPlatformLogo } from '@utils/getPlatformLogo';

// OTT Label 타입 정의
type OttLabel =
  | '넷플릭스'
  | '애플티비'
  | '티빙'
  | '디즈니+'
  | '웨이브'
  | '왓챠'
  | '쿠팡플레이';

type OttCircleOptionProps = {
  label: OttLabel; // OTT 라벨 텍스트 (맵핑된 OTT 중 하나)
  isSelected?: boolean; // 선택 여부
  showLabel?: boolean; // 라벨 표시 여부
  onToggle: (label: string, isSelected: boolean) => void; // 토글 이벤트 핸들러
};

// OTwT 원형 옵션 컴포넌트 (52px x 52px 고정 크기)
export function OttCircleOption({
  label,
  isSelected = false,
  onToggle,
  showLabel = false,
  ...props
}: OttCircleOptionProps) {
  // label을 통해 자동으로 이미지 소스 가져오기
  const imageSrc = getPlatformLogo(label);

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
            src={imageSrc || 'images/ott/netflix.webp'}
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
