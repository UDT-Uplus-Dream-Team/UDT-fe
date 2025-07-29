'use client';

import { X } from 'lucide-react';
import MovieCard from '@components/profile/MovieCard';
import { StoredContentDetail } from '@type/profile/StoredContentDetail';
import { useEffect, useRef } from 'react';

interface MovieDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: StoredContentDetail;
}

const MovieDetailModal = ({ isOpen, onClose, data }: MovieDetailModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // 스크롤 막기
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 bg-opacity-50 flex justify-center items-center"
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      ref={modalRef}
    >
      <div className="relative bg-white rounded-2xl h-[70svh] aspect-[75/135] min-w-70 min-h-110 max-w-100 max-h-180 md:w-[440px] md:h-[680px] overflow-hidden">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 rounded-full bg-gray-500 p-1 hover:bg-gray-700"
        >
          <X size={16} className="text-white" />
        </button>
        <MovieCard {...data} />
      </div>
    </div>
  );
};

export default MovieDetailModal;
