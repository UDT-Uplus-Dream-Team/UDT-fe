'use client';

import { useState } from 'react';
import { CircleOption } from '@/components/common/circleOption';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';

const ottList = [
  { name: '넷플릭스', image: '/images/ott/neflix.png' },
  { name: '티빙', image: '/images/ott/tving.png' },
  { name: '쿠팡플레이', image: '/images/ott/coupangPlay.png' },
  { name: '디즈니+', image: '/images/ott/disneyPlus.png' },
  { name: '웨이브', image: '/images/ott/wavve.png' },
  { name: '왓챠', image: '/images/ott/watcha.png' },
  { name: 'Apple TV', image: '/images/ott/appleTv.png' },
];

const genreList = [
  '액션',
  '판타지',
  '로맨스',
  '스릴러',
  '어드벤처',
  '애니메이션',
  '드라마',
  '공포',
  '다큐멘터리',
  '범죄',
  '무협',
  '시극',
];

export default function EditPreferencePage() {
  const [selectedOtt, setSelectedOtt] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const toggleSelection = (
    value: string,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    setFn: Function,
    selectedList: string[],
  ) => {
    if (selectedList.includes(value)) {
      setFn(selectedList.filter((v) => v !== value));
    } else {
      setFn([...selectedList, value]);
    }
  };

  const handleSavePreferences = () => {
    // TODO: 이 데이터를 서버로 전송하는 API 호출 추가 예정
    console.log('선택된 OTT:', selectedOtt);
    console.log('선택된 장르:', selectedGenres);
  };

  const router = useRouter();

  return (
    <div className="min-h-screen px-6 py-4 text-white max-w-[600px] mx-auto">
      <div className="relative flex items-center justify-center mb-4 h-10">
        {/* 뒤로가기 버튼 (좌측 고정) */}
        <button
          onClick={() => router.push('/profile')}
          className="absolute left-0 pl-2 text-white"
        >
          <ChevronLeft size={24} />
        </button>

        {/* 중앙 제목 */}
        <h1 className="text-lg font-bold text-center text-white">장르 편집</h1>
      </div>

      {/* OTT 선택 */}
      <div className="mb-1 flex justify-between items-center px-1">
        <h2 className="text-[20px] font-bold ml-3">시청 OTT</h2>
        <Button
          size="sm"
          className="bg-white/30 text-white px-3 py-1 rounded-md"
          onClick={handleSavePreferences}
        >
          확인
        </Button>
      </div>

      <div className="mb-6 bg-primary-900/40 rounded-[20px] p-4 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
        <div className="grid grid-cols-4 gap-4 justify-center">
          {ottList.map((ott) => (
            <CircleOption
              key={ott.name}
              imageSrc={ott.image}
              label={ott.name}
              size="sm"
              selected={selectedOtt.includes(ott.name)}
              onClick={() =>
                toggleSelection(ott.name, setSelectedOtt, selectedOtt)
              }
            />
          ))}
        </div>
      </div>

      {/* 장르 선택 */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-[20px] font-bold ml-3">선호 장르</h2>
        <Button
          size="sm"
          className="bg-white/30 text-white px-3 py-1 rounded-md"
          onClick={handleSavePreferences}
        >
          확인
        </Button>
      </div>

      <div className="bg-primary-900/40 rounded-[20px] p-4 shadow-[0_0_20px_rgba(255,255,255,0.4)]">
        <div className="grid grid-cols-4 gap-4 justify-center">
          {genreList.map((genre) => (
            <CircleOption
              key={genre}
              imageSrc={`/images/genre/${genre}.webp`}
              label={genre}
              size="sm"
              selected={selectedGenres.includes(genre)}
              onClick={() =>
                toggleSelection(genre, setSelectedGenres, selectedGenres)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
