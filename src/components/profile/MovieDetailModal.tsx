'use client';

import { X } from 'lucide-react';
import MovieCard from '@components/profile/MovieCard';
import { ContentDetail } from '@/types/ContentDetail';

interface MovieDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ContentDetail;
}

const MovieDetailModal = ({ isOpen, onClose, data }: MovieDetailModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 bg-opacity-50 flex justify-center items-center">
      <div className="relative bg-white rounded-xl w-[300px] h-[538px] max-h-[90vh] overflow-y-auto">
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
