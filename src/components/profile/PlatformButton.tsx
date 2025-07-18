import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { PlatFormButtonProps } from '@type/profile/Mypage';
import { Button } from '../ui/button';

// 누르면 해당 콘텐츠에 대해 바로 해당 OTT 페이지로 이동하는 버튼
export const PlatformButton = ({
  platformName,
  iconUrl,
  url,
}: PlatFormButtonProps) => {
  const handleClick = () => {
    if (url) {
      // null 체크
      window.open(url, '_blank');
    }
  };

  return (
    <Button
      onClick={handleClick}
      className="w-full h-[48px] px-4 py-2 flex justify-between items-center rounded-[12px] text-white bg-white/30"
    >
      <div className="flex items-center gap-2">
        <Avatar className="w-[25px] h-[25px]">
          <AvatarImage src={iconUrl} alt={platformName} />
          <AvatarFallback>{platformName[0]}</AvatarFallback>
        </Avatar>
        <span className="text-sm">{platformName}</span>
      </div>
      <span className="text-sm">보러가기 →</span>
    </Button>
  );
};
