'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cn } from '@/lib/utils';

interface ProgressBarProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> {
  value?: number; // 진행률 (0-100)
  indicatorColor?: string; // 진행률 바의 색상
  backgroundColor?: string; // 배경색 (0%일 때 보이는 색상)
  gradientFrom?: string; // 그라데이션 시작 색상
  gradientTo?: string; // 그라데이션 끝 색상
  useGradient?: boolean; // 그라데이션 사용 여부
  title?: string; // 제목 (선택사항)
  showContainer?: boolean; // 컨테이너 스타일 표시 여부
  // className은 상속받은 props에 이미 포함되어 있음
}

export const ProgressBar = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressBarProps
>(
  (
    {
      className,
      value = 0,
      indicatorColor,
      backgroundColor = 'var(--gray-10)', // 기본 배경색
      gradientFrom,
      gradientTo,
      useGradient = false,
      title,
      showContainer = false,
      ...props
    },
    ref,
  ) => {
    // CSS 변수 값을 실제 색상으로 변환하는 함수
    const resolveCSSVariable = (color: string): string => {
      if (color.startsWith('var(')) {
        // CSS 변수인 경우 그대로 반환 (브라우저가 처리)
        return color;
      }
      return color;
    };

    // 그라데이션 또는 단색 스타일 계산
    const getIndicatorStyle = () => {
      if (useGradient && gradientFrom && gradientTo) {
        const fromColor = resolveCSSVariable(gradientFrom);
        const toColor = resolveCSSVariable(gradientTo);
        return {
          transform: `translateX(-${100 - value}%)`,
          background: `linear-gradient(to right, ${fromColor}, ${toColor})`,
        };
      }

      const color = resolveCSSVariable(indicatorColor || 'var(--primary-500)');
      return {
        transform: `translateX(-${100 - value}%)`,
        backgroundColor: color,
      };
    };

    // 배경 스타일 계산
    const getBackgroundStyle = () => {
      const bgColor = resolveCSSVariable(backgroundColor);
      return {
        backgroundColor: bgColor,
      };
    };

    const progressContent = (
      <>
        {title && (
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {title}
          </h1>
        )}
        <div
          className="relative h-5 w-full rounded-full overflow-hidden"
          style={getBackgroundStyle()}
        >
          <ProgressPrimitive.Root
            ref={ref}
            className={cn(
              'relative h-full w-full overflow-hidden rounded-full',
              className,
            )}
            style={getBackgroundStyle()}
            {...props}
          >
            <ProgressPrimitive.Indicator
              className="h-full w-full flex-1 transition-transform duration-500 ease-in-out"
              style={getIndicatorStyle()}
            />
          </ProgressPrimitive.Root>
        </div>
      </>
    );

    if (showContainer) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
          <div className="w-full max-w-md space-y-6 p-6 bg-white rounded-lg shadow-lg">
            {progressContent}
          </div>
        </div>
      );
    }

    return <div className="w-full space-y-6">{progressContent}</div>;
  },
);

ProgressBar.displayName = 'ProgressBar';
