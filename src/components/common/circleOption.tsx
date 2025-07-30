import * as React from 'react';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cva, type VariantProps } from 'class-variance-authority';

const avatarWrapperVariants = cva(
  'relative rounded-full overflow-hidden border-2 transition-all',
  {
    variants: {
      size: {
        xs: 'w-[14px] h-[14px]',
        sm: 'w-[43px] h-[43px]',
        md: 'w-[52px] h-[52px]',
        default: 'w-[70px] h-[70px]',
      },
      selected: {
        true: 'border-white',
        false: 'border-white/30',
      },
    },
    defaultVariants: {
      size: 'default',
      selected: false,
    },
  },
);

type CircleOptionProps = React.HTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof avatarWrapperVariants> & {
    imageSrc: string;
    label: string;
    selected?: boolean;
    showLabel?: boolean;
    selectedOverlay?: React.ReactNode; // 선택되었을 때 보여줄 커스텀 오버레이
    onClick: () => void;
  };

export function CircleOption({
  imageSrc,
  label,
  selected = false,
  size,
  onClick,
  className,
  showLabel = true,
  selectedOverlay,
  ...props
}: CircleOptionProps) {
  return (
    <button
      className={cn('flex flex-col items-center space-y-1', className)}
      {...props}
    >
      <div className={avatarWrapperVariants({ size, selected })}>
        <Avatar
          onClick={onClick}
          className="cursor-pointer w-full h-full rounded-full"
        >
          <AvatarImage
            src={imageSrc}
            alt={label}
            className="object-cover w-full h-full"
          />
          <AvatarFallback>{label[0]}</AvatarFallback>
        </Avatar>

        {selected && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center pointer-events-none">
            {selectedOverlay ?? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-9 h-9 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
          </div>
        )}
      </div>

      {showLabel && <span className="text-xs text-white mt-1">{label}</span>}
    </button>
  );
}
