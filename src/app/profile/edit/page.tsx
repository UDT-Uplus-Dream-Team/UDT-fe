'use client';

import { useEffect, useState } from 'react';
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
import { usePreferenceHandler } from '@hooks/profile/usePreferenceHandler';
import { useGetUserProfile } from '@hooks/useGetUserProfile';
import { showSimpleToast } from '@components/common/Toast';

export default function EditPreferencePage() {
  const [selectedOtt, setSelectedOtt] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const router = useRouter();
  const { handleSave } = usePreferenceHandler(selectedOtt, selectedGenres);
  const { data: userProfile } = useGetUserProfile();

  useEffect(() => {
    if (userProfile) {
      setSelectedOtt(userProfile.platforms || []);
      setSelectedGenres(userProfile.genres || []);
    }
  }, [userProfile]);

  const showLimit = (message: string) => {
    showSimpleToast.error({
      message,
      position: 'top-center',
      className: 'w-full bg-black/80 shadow-lg text-white',
    });
  };

  const toggleSelection = (
    value: string,
    setFn: React.Dispatch<React.SetStateAction<string[]>>,
    selectedList: string[],
  ) => {
    if (selectedList.includes(value)) {
      setFn(selectedList.filter((v) => v !== value));
    } else {
      if (selectedList.length >= 3) {
        showLimit('장르는 최대 3개까지 선택할 수 있어요.');
        return;
      }
      setFn([...selectedList, value]);
    }
  };

  return (
    <div className="h-[calc(100vh-80px)] overflow-y-auto px-9 py-4 text-white max-w-[550px] mx-auto">
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
      <div className="my-4 flex justify-between items-center px-1">
        <h2 className="text-[20px] font-bold ml-3">시청 OTT</h2>
        <Button
          size="sm"
          className="bg-white/30 text-white px-4 py-1 rounded-md"
          onClick={() => handleSave('platform')}
        >
          확인
        </Button>
      </div>

      <div className="mb-10 bg-primary-900/40 rounded-[20px] p-4 md:p-8 shadow-[0_0_10px_rgba(255,255,255,0.4)]">
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
      <div className="flex justify-between items-center my-4">
        <h2 className="text-[20px] font-bold ml-3">
          선호 장르
          <span className="ml-2 text-sm font-normal text-white/70">
            (선택: {selectedGenres.length}/3)
          </span>
        </h2>

        <Button
          size="sm"
          className="bg-white/30 text-white px-4 py-1 rounded-md"
          onClick={() => handleSave('genre')}
        >
          확인
        </Button>
      </div>

      <div className="bg-primary-900/40 rounded-[20px] p-4 md:p-8  shadow-[0_0_10px_rgba(255,255,255,0.4)] relative">
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
          <CarouselPrevious className="left-[-16px] md:left-[-30px] top-1/2 -translate-y-1/2 z-10" />
          <CarouselNext className="right-[-16px] md:right-[-30px] top-1/2 -translate-y-1/2 z-10" />
        </Carousel>
      </div>
    </div>
  );
}
