import Image from 'next/image';
import { Button } from '../ui/button';
import { PlatFormButtonProps } from '@/types/mypage/Mypage.type';

export const PlatformButton = ({
  platformName,
  iconUrl,
  url,
}: PlatFormButtonProps) => {
  const handleClick = () => {
    window.open(url, '_blank');
  };

  return (
    <Button
      onClick={handleClick}
      className="w-[255px] h-[48px] px-4 py-2 flex justify-between items-center rounded-[12px] text-white bg-gradient-to-r from-[var(--primary-500)] to-[var(--primary-900)]"
    >
      <div className="flex items-center gap-2">
        <div className="w-[25px] h-[25px] rounded-full overflow-hidden">
          <Image
            src={iconUrl}
            alt={platformName}
            width={25}
            height={25}
            className="object-cover"
          />
        </div>
        <span className="text-sm">{platformName}</span>
      </div>
      <span className="text-sm">보러가기 →</span>
    </Button>
  );
};

export default PlatformButton;
