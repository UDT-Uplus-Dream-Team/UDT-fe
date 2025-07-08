import * as React from 'react';
import Image from 'next/image';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const imageWrapperVariants = cva(
  'relative rounded-full overflow-hidden border-2 transition-all',
  {
    variants: {
      size: {
        default: 'w-[70px] h-[70px]',
        lg: 'w-[100px] h-[100px]',
      },
      selected: {
        true: 'border-white',
        false: 'border-transparent',
      },
    },
    defaultVariants: {
      size: 'default',
      selected: false,
    },
  },
);

type CircleOptionProps = React.HTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof imageWrapperVariants> & {
    imageSrc: string;
    label: string;
    selected?: boolean;
    onClick: () => void;
  };

export function CircleOption({
  imageSrc,
  label,
  selected = false,
  size,
  onClick,
  className,
  ...props
}: CircleOptionProps) {
  return (
    <button
      onClick={onClick}
      className={cn('flex flex-col items-center space-y-1', className)}
      {...props}
    >
      <div className={imageWrapperVariants({ size, selected })}>
        <Image src={imageSrc} alt={label} fill className="object-cover" />
        {selected && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white text-3xl font-bold">✔</span>
          </div>
        )}
      </div>
      <span className="text-sm text-white mt-1">{label}</span>
    </button>
  );
}
