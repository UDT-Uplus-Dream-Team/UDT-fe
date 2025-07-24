import { cn } from '@lib/utils';

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

// 탐색 페이지에서 사용되는 공통 Skeleton 기본 컴포넌트
export const Skeleton = ({ className, children }: SkeletonProps) => {
  return (
    <div className={cn('animate-pulse bg-gray-700/50 rounded-lg', className)}>
      {children}
    </div>
  );
};
