// 콘텐츠 상세 정보를 보여주는 BottomSheet 컴포넌트

// import { useGetContentDetail } from '@/hooks/useGetContentDetail';
import Image from 'next/image';
import { PlatformButton } from '@/components/explore/PlatformButton';
import { getPlatformLogo } from '@/utils/getPlatformLogo';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { useEffect, useState } from 'react';

interface DetailBottomSheetContentProps {
  contentId: number;
}

// 콘텐츠 상세 정보를 보여주는 BottomSheet 컴포넌트
export const DetailBottomSheetContent = ({
  contentId,
}: DetailBottomSheetContentProps) => {
  const [isSynopsisExpanded, setIsSynopsisExpanded] = useState(false); // 시놉시스(줄거리) 부분에 대해서 더 자세하게 보여주기 여부

  //TODO: 추후 get 요청을 하는 hook과 contentId를 연동해야 함
  const mockMovieData = {
    title: '주토피아',
    year: '2016',
    rating: '전체관람가',
    country: '미국',
    synopsis:
      '애니메이션 「주토피아(Zootopia)」는 다양한 동물들이 인간처럼 살아가는 현대적인 도시 ‘주토피아’를 배경으로, 토끼 주인공 ‘주디 홉스’가 경찰이 되겠다는 꿈을 이루기 위해 고군분투하는 이야기다. 포식자와 초식자가 평화롭게 공존하는 이상적인 도시처럼 보이지만, 그 이면에는 차별과 편견, 고정관념이 존재한다. 주디는 여우 사기꾼 ‘닉 와일드’와 협력해 동물들이 사라지는 미스터리한 사건을 추적하며, 사건의 배후에 있는 진실을 밝혀낸다. 이 과정에서 둘은 서로에 대한 편견을 극복하고 진정한 파트너로 성장한다. 영화는 흥미진진한 추리와 코믹한 요소를 결합하면서도, 다양성과 편견, 사회적 갈등 같은 주제를 섬세하게 다뤄 깊은 울림을 준다. 어린이와 성인 모두에게 의미 있는 메시지를 전하는 작품으로, 비주얼과 스토리, 캐릭터의 조화가 돋보이는 디즈니의 대표 애니메이션 중 하나다. 집에 가고 싶다. 나가 놀고 싶다.',
    posterImage: '/images/mockdata/zootopia.jpg',
    cast: [
      { name: '짱귀여운 주디', image: '/images/mockdata/judy.webp' },
      { name: '상남자 닉', image: '/images/mockdata/nick.jpeg' },
      { name: '홉스 부부', image: '/images/mockdata/hops.webp' },
      { name: '춘식이', image: '/images/mockdata/choonsik.webp' },
    ],
    directors: [
      { name: '허준호' },
      { name: '박교녕' },
      { name: '김원석' },
      { name: '배지아' },
      { name: '최희승' },
      { name: '이가인' },
      { name: '홍정기' },
      { name: '권영태' },
    ],
  };
  // const { data, isLoading, error } = useGetContentDetail(String(contentId));

  // if (isLoading) return <div className="p-4 text-white">Loading...</div>;
  // if (error || !data)
  //   return <div className="p-4 text-red-500">정보를 불러올 수 없습니다.</div>;

  // TODO: 나중에 없앨거임
  useEffect(() => {
    console.log(contentId);
  }, []);

  return (
    <div className="flex-1 scrollbar-hide">
      {/* 콘텐츠 썸네일 with Overlay */}
      <div className="relative w-full h-90 rounded-t-lg overflow-hidden border-none">
        <Image
          src={mockMovieData.posterImage || '/placeholder.svg'}
          alt={mockMovieData.title}
          fill
          className="object-cover"
        />

        {/* Gradient(검은색 그라데이션..) Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

        {/* 콘텐츠 정보 Gradient 위에 Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center text-center space-y-3">
          <span className="text-3xl font-bold text-white">
            {mockMovieData.title}
          </span>
          <div className="flex items-center space-x-5 text-sm text-gray-200">
            <span>{mockMovieData.year}</span>
            <span>{mockMovieData.rating}</span>
            <span>{mockMovieData.country}</span>
          </div>
        </div>
      </div>

      {/* 사진 밑에 콘텐츠 정보 */}
      <div className="flex flex-col space-y-6 px-4 pt-4 bg-gradient-to-b from-black/100 to-primary-800">
        {/* "보러가기" 버튼 */}
        <PlatformButton
          platformName="디즈니+"
          iconUrl={getPlatformLogo('디즈니+') || ''}
          url="https://www.disneyplus.com"
        />

        {/* 시놉시스(줄거리) */}
        <div className="space-y-2">
          <div className="text-sm text-gray-300 leading-relaxed">
            {isSynopsisExpanded ? (
              <>
                {mockMovieData.synopsis}
                <span
                  onClick={() => setIsSynopsisExpanded(false)}
                  className="text-white cursor-pointer ml-1"
                >
                  ...접기
                </span>
              </>
            ) : (
              <>
                <span className="line-clamp-5">{mockMovieData.synopsis}</span>
                <span
                  onClick={() => setIsSynopsisExpanded(true)}
                  className="text-white cursor-pointer ml-1"
                >
                  ...더보기
                </span>
              </>
            )}
          </div>
        </div>

        {/* 배우들 */}
        <div className="flex flex-col space-y-3">
          <span className="text-lg font-semibold text-white">출연진</span>
          <div className="flex space-x-4 overflow-x-auto">
            {mockMovieData.cast.map((actor, index) => (
              <div
                key={index}
                className="flex flex-col items-center space-y-2 min-w-[60px]"
              >
                <Avatar className="w-15 h-15 rounded-full overflow-hidden">
                  <AvatarImage
                    src={actor.image || '/placeholder.svg'}
                    alt={actor.name}
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="bg-gray-700 text-white">
                    {actor.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs text-gray-300 text-center leading-tight">
                  {actor.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 감독 */}
        <div className="flex flex-col space-y-3">
          <span className="text-lg font-semibold text-white">감독</span>
          <div className="flex flex-row items-center space-x-3">
            {mockMovieData.directors.map((director, index) => (
              <span key={index} className="text-xs text-gray-300 text-center">
                {director.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
