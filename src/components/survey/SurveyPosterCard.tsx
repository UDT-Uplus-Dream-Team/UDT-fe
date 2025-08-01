import Image from 'next/image';
import { cn } from '@lib/utils';
import React from 'react';

interface SurveyPosterCardProps {
  title: string;
  image: string;
  selected?: boolean;
  onClick: () => void;
}

export function SurveyPosterCard({
  title,
  image,
  selected = false,
  onClick,
}: SurveyPosterCardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'cursor-pointer transition-all overflow-hidden',
        selected ? 'scale-105' : 'hover:opacity-90',
      )}
      style={
        selected
          ? {
              boxShadow: '2px 2px 10px 0px rgba(255, 255, 255, 1)',
            }
          : undefined
      }
    >
      <div className="relative w-full aspect-[2/3]">
        <Image
          src={image}
          alt={title}
          fill
          unoptimized
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
        />
      </div>
    </div>
  );
}
