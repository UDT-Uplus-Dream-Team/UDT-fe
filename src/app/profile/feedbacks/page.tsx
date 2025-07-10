'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { PosterCard } from '@components/explore/PosterCard';
import { ChevronLeft, Pencil } from 'lucide-react';
import MovieDetailModal from '@/components/mypage/MovieDetailModal';
import { MovieCardProps } from '@/types/mypage/Mypage';

const likedPosters = [
  { id: '1', title: '센과 치히로의 행방불명', image: '/images/poster1.webp' },
  { id: '2', title: '바람이 분다', image: '/images/poster2.webp' },
  { id: '3', title: '이웃집 토토로', image: '/images/poster3.webp' },
  { id: '4', title: '모노노케 히메', image: '/images/poster4.webp' },
];

const dislikedPosters = [
  { id: '1', title: '이웃집 토토로', image: '/images/poster3.webp' },
  { id: '2', title: '모노노케 히메', image: '/images/poster4.webp' },
  { id: '3', title: '센과 치히로의 행방불명', image: '/images/poster1.webp' },
  { id: '4', title: '바람이 분다', image: '/images/poster2.webp' },
  { id: '5', title: '이웃집 토토로', image: '/images/poster3.webp' },
  { id: '6', title: '모노노케 히메', image: '/images/poster4.webp' },
];

const FeedbackPage = () => {
  const router = useRouter();
  const [isDeleteMode, setIsDeleteMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedPosterData, setSelectedPosterData] = useState<
    (typeof likedPosters)[0] | null
  >(null);
  const [isAllSelected, setIsAllSelected] = useState(false);
  const [tab, setTab] = useState<'like' | 'dislike'>('like');

  const posters = tab === 'like' ? likedPosters : dislikedPosters;

  const modalMovieData: MovieCardProps | null = selectedPosterData
    ? {
        title: selectedPosterData.title,
        genres: ['애니메이션'],
        runtime: '120분',
        releaseDate: '2020-01-01',
        rating: '전체 이용가',
        description:
          "왕년의 게임 챔피언이었지만 지금은 폐업 직전의 게임샵 주인이 된 '개릿'과 엄마를 잃고 낯선 동네로 이사 온 남매 '헨리'와 '나탈리' 그리고 그들을 돕는 부동산 중개업자 '던'. 이들은 ‘개릿’이 수집한 ‘큐브’가 내뿜는 신비한 빛을 따라가다 어느 폐광 속에 열린 포털을 통해 미지의 공간으로 빨려들어간다. 산과 나무, 구름과 달, 심지어 꿀벌까지 상상하는 모든 것이 네모난 현실이 되는 이곳은 바로 ‘오버월드’. 일찍이 이 세계로 넘어와 완벽하게 적응한 ‘스티브’를 만난 네 사람은 지하세계 ‘네더’를 다스리는 마법사 ‘말고샤’의 침공으로 ‘오버월드’가 위험에 빠졌다는 사실을 알게 된다. 현실 세계로 돌아가기 위해서는 일단 살아남아야 하는 법!",
        thumbnailUrl: selectedPosterData.image,
        platformList: [
          {
            name: '넷플릭스',
            iconUrl: '/images/ott/neflix.png',
            url: 'https://www.netflix.com',
          },
          {
            name: '왓챠',
            iconUrl: '/images/ott/watcha.png',
            url: 'https://watcha.com',
          },
        ],
      }
    : null;

  const handleCardClick = (poster: (typeof posters)[0]) => {
    if (isDeleteMode) {
      setSelectedIds((prev) =>
        prev.includes(poster.id)
          ? prev.filter((i) => i !== poster.id)
          : [...prev, poster.id],
      );
    } else {
      setSelectedPosterData(poster);
    }
  };

  const handleCloseModal = () => setSelectedPosterData(null);
  const handleDelete = () => {
    if (selectedIds.length === 0) {
      alert('삭제할 콘텐츠를 선택해 주세요.');
      return;
    }
    alert(`삭제할 ID들: ${selectedIds.join(', ')}`);
    setSelectedIds([]);
    setIsDeleteMode(false);
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
      setIsAllSelected(false);
    } else {
      const allIds = posters.map((poster) => poster.id);
      setSelectedIds(allIds);
      setIsAllSelected(true);
    }
  };

  const handleCancelDeleteMode = () => {
    setIsDeleteMode(false);
    setIsAllSelected(false);
    setSelectedIds([]);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center px-4 py-6">
      {/* 헤더 */}
      <div className="relative w-full max-w-screen-md flex items-center justify-center mb-2 h-10">
        {isDeleteMode ? (
          <button
            onClick={handleSelectAll}
            className="absolute left-0 pl-2 text-white text-sm"
          >
            {isAllSelected ? '선택해제' : '모두선택'}
          </button>
        ) : (
          <button
            onClick={() => router.push('/profile')}
            className="absolute left-0 pl-2 text-white"
            aria-label="뒤로가기"
          >
            <ChevronLeft size={24} />
          </button>
        )}
        <h1 className="text-lg font-bold text-white">선호 콘텐츠</h1>
        <div className="absolute right-0 pr-2">
          {isDeleteMode ? (
            <button
              onClick={handleCancelDeleteMode}
              className="text-white text-sm"
            >
              취소
            </button>
          ) : (
            <button
              onClick={() => setIsDeleteMode(true)}
              className="text-white"
              aria-label="편집"
            >
              <Pencil size={20} />
            </button>
          )}
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="w-full max-w-screen-md flex justify-around mb-4 border-b border-white/30">
        <button
          onClick={() => setTab('like')}
          className={`pb-2 font-semibold text-sm transition-all ${
            tab === 'like'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400'
          }`}
        >
          좋아요 {likedPosters.length}
        </button>
        <button
          onClick={() => setTab('dislike')}
          className={`pb-2 font-semibold text-sm transition-all ${
            tab === 'dislike'
              ? 'text-white border-b-2 border-white'
              : 'text-gray-400'
          }`}
        >
          싫어요 {dislikedPosters.length}
        </button>
      </div>

      {/* 카드 리스트 */}
      <div className="w-full max-w-screen-md">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-8 justify-items-center">
          {posters.map((poster) => (
            <PosterCard
              key={poster.id}
              title={poster.title}
              image={poster.image}
              size="lg"
              isDeletable={isDeleteMode}
              isSelected={selectedIds.includes(poster.id)}
              onClick={() => handleCardClick(poster)}
            />
          ))}
        </div>
      </div>

      {/* 삭제 바 */}
      {isDeleteMode && (
        <div className="fixed inset-x-0 bottom-0 bg-gray-700 h-[80px] px-4 flex items-center justify-between z-50 max-w-160 mx-auto w-full">
          <p className="text-white text-sm">삭제할 콘텐츠를 선택하세요.</p>
          <button
            onClick={handleDelete}
            disabled={selectedIds.length === 0}
            className={`text-2xl ${
              selectedIds.length > 0
                ? 'text-white'
                : 'text-gray-400 cursor-not-allowed'
            }`}
          >
            🗑️
          </button>
        </div>
      )}

      {modalMovieData && (
        <MovieDetailModal
          isOpen={true}
          onClose={handleCloseModal}
          data={modalMovieData}
        />
      )}
    </div>
  );
};

export default FeedbackPage;
