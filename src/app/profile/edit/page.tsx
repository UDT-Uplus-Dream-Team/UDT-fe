'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { CircleOption } from '@components/common/circleOption';
import { Button } from '@components/ui/button';
import { GENRES } from '@lib/genres';
import { PLATFORMS } from '@lib/platforms';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@components/ui/carousel';
import {
  showInteractiveToast,
  showSimpleToast,
} from '@components/common/Toast';

export default function EditPreferencePage() {
  const [selectedOtt, setSelectedOtt] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const router = useRouter();

  const toggleSelection = (
    value: string,
    setFn: React.Dispatch<React.SetStateAction<string[]>>,
    selectedList: string[],
  ) => {
    if (selectedList.includes(value)) {
      setFn(selectedList.filter((v) => v !== value));
    } else {
      setFn([...selectedList, value]);
    }
  };

  const handleSavePreferences = () => {
    if (selectedOtt.length === 0 && selectedGenres.length === 0) {
      showSimpleToast.error({
        message: '변경할 항목을 선택해주세요.',
        position: 'top-center',
        className: 'w-full bg-black/80 shadow-lg',
      });
      return;
    }

    showInteractiveToast.confirm({
      message: '정말 변경하시겠습니까?',
      confirmText: '변경',
      cancelText: '취소',
      position: 'top-center',
      className: 'w-[360px] bg-white shadow-lg',
      onConfirm: () => {
        console.log('✅ 저장된 OTT:', selectedOtt);
        console.log('✅ 저장된 장르:', selectedGenres);
        // TODO: 서버 전송 API 연동
      },
    });
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto px-6 py-4 text-white max-w-[550px] mx-auto">
      {/* 헤더 */}
      <div className="relative flex items-center justify-center mb-14 h-10">
        <button
          onClick={() => router.push('/profile')}
          className="absolute left-0 pl-2 text-white"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-bold text-center text-white">장르 편집</h1>
      </div>

      {/* OTT 선택 */}
      <div className="mb-2 flex justify-between items-center px-1">
        <h2 className="text-[20px] font-bold ml-3">시청 OTT</h2>
        <Button
          size="sm"
          className="bg-white/30 text-white px-4 py-1 rounded-md"
          onClick={handleSavePreferences}
        >
          확인
        </Button>
      </div>

      <div className="mb-10 bg-primary-900/40 rounded-[20px] p-4 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
        <div className="grid grid-cols-4 gap-4 justify-center">
          {PLATFORMS.map(({ label, id }) => (
            <CircleOption
              key={label}
              label={label}
              imageSrc={`/images/ott/${id}.png`}
              size="sm"
              selected={selectedOtt.includes(label)}
              onClick={() => {
                if (selectedOtt.includes(label)) {
                  setSelectedOtt(selectedOtt.filter((v) => v !== label));
                } else {
                  setSelectedOtt([...selectedOtt, label]);
                }
              }}
            />
          ))}
        </div>
      </div>

      {/* 장르 선택 */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[20px] font-bold ml-3">선호 장르</h2>
        <Button
          size="sm"
          className="bg-white/30 text-white px-4 py-1 rounded-md"
          onClick={handleSavePreferences}
        >
          확인
        </Button>
      </div>

      <div className="bg-primary-900/40 rounded-[20px] p-4 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
        <Carousel className="w-full">
          <CarouselContent>
            {[0, 1].map((page) => (
              <CarouselItem key={page}>
                <div className="grid grid-cols-4 gap-4 justify-center">
                  {GENRES.slice(page * 12, (page + 1) * 12).map(
                    ({ label, id }) => (
                      <CircleOption
                        key={label}
                        imageSrc={`/images/genre/${id}.png`}
                        label={label}
                        size="sm"
                        selected={selectedGenres.includes(label)}
                        onClick={() =>
                          toggleSelection(
                            label,
                            setSelectedGenres,
                            selectedGenres,
                          )
                        }
                      />
                    ),
                  )}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </div>
  );
}
