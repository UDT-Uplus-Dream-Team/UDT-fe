import type { StaticImageData } from 'next/image';

// PosterCard 컴포넌트의 props 타입 정의
export interface PosterCardProps {
  title: string;
  image: string | StaticImageData;
  isTitleVisible?: boolean;
  onClick: () => void;
}
