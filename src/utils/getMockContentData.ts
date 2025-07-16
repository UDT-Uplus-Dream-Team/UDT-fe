import { getYouTubeEmbedUrl } from '@utils/getYouTubeEmbedUrl';

export interface MockContentData {
  title: string;
  description: string;
  openDate: string;
  runningTime: number;
  backdropUrl: string;
  trailerUrl: string;
  rating: string;
  countries: string[];
  cast: { name: string; image: string }[];
  directors: { name: string }[];
}

// TODO: 추후 이것은 삭제될 예정 (임시로 데이터 넣어둠)
// Mock 데이터를 contentId에 따라 반환하는 함수
const mockDataMap: Record<number, MockContentData> = {
  1: {
    title: '주토피아',
    description:
      '애니메이션 「주토피아(Zootopia)」는 다양한 동물들이 인간처럼 살아가는 현대적인 도시 ‘주토피아’를 배경으로, 토끼 주인공 ‘주디 홉스’가 경찰이 되겠다는 꿈을 이루기 위해 고군분투하는 이야기다. 포식자와 초식자가 평화롭게 공존하는 이상적인 도시처럼 보이지만, 그 이면에는 차별과 편견, 고정관념이 존재한다. 주디는 여우 사기꾼 ‘닉 와일드’와 협력해 동물들이 사라지는 미스터리한 사건을 추적하며, 사건의 배후에 있는 진실을 밝혀낸다. 이 과정에서 둘은 서로에 대한 편견을 극복하고 진정한 파트너로 성장한다. 영화는 흥미진진한 추리와 코믹한 요소를 결합하면서도, 다양성과 편견, 사회적 갈등 같은 주제를 섬세하게 다뤄 깊은 울림을 준다. 어린이와 성인 모두에게 의미 있는 메시지를 전하는 작품으로, 비주얼과 스토리, 캐릭터의 조화가 돋보이는 디즈니의 대표 애니메이션 중 하나다. 집에 가고 싶다. 나가 놀고 싶다.',
    openDate: '2019-01-17',
    runningTime: 104,
    backdropUrl: '/images/mockdata/zootopia.jpg',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=K4OJXmoakF4',
    ),
    rating: '전체관람가',
    countries: ['미국'],
    cast: [
      { name: '짱귀여운 주디', image: '/images/mockdata/judy.webp' },
      { name: '상남자 닉', image: '/images/mockdata/nick.jpeg' },
      { name: '홉스 부부', image: '/images/mockdata/hops.webp' },
      { name: '춘식이', image: '/images/mockdata/choonsik.webp' },
    ],
    directors: [{ name: '바이런 하워드' }, { name: '리치 무어' }],
  },
  2: {
    title: '타짜',
    description:
      '함께 원정을 뛰며 나름의 도박인생을 꾸려가는 고니와 고광렬. 원정 중 우연히 들른 한 술집에서 고니는 술집주인 화란을 만나고 둘은 첫 눈에 서로에게 끌리지만 한없이 떠도는 타짜의 인생에 사랑은 그리 쉬운 일이 아니다. 한편, 고니는 자신을 이 세계에 발 담그게 한 장본인 박무석과 그를 조종하는 인물 곽철용을 찾게 되고, 드디어 보기 좋게 한 판 복수에 성공한다. 하지만 곽철용의 수하는 복수가 낳은 복수를 위해 아귀에게 도움을 청하고, 아귀는 고니에게 애증을 가진 정마담을 미끼로 고니와 고광렬을 화투판으로 끌어들인다. 기차역에서 스쳤던 아귀를 기억해내며 그것이 ‘죽음의 한 판’이란 것을 느끼는 고니. 하지만 고니는 이를 거절하지 않는다. 고광렬의 만류도 뿌리친 채, 그리고 처음으로 평범한 삶을 꿈꾸게 한 여자 화란과의 사랑도 뒤로 한 채, 고니는 그렇게 죽음의 판이 펼쳐질 배에 스스로 오르는데…. 물러설 곳 없는 꽃들의 전쟁..! 각자의 원한과 욕망, 그리고 덧없는 희망, 이 모든 것이 뒤엉킨 한 판이 시작된다..!',
    openDate: '2006-09-28',
    runningTime: 139,
    backdropUrl: '/images/mockdata/tazza-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=vLHyh8F-vQo',
    ),
    rating: '청소년 관람불가',
    countries: ['한국'],
    cast: [
      { name: '조승우', image: '/images/mockdata/judy.webp' },
      { name: '김혜수', image: '/images/mockdata/nick.jpeg' },
      { name: '백윤식', image: '/images/mockdata/hops.webp' },
      { name: '유해진', image: '/images/mockdata/choonsik.webp' },
    ],
    directors: [{ name: '최동훈' }],
  },
  3: {
    title: '인사이드 아웃',
    description:
      '카 2 이후 침체기에 빠졌던 픽사를 다시 최정상으로 올려놓은 작품으로 평가받는다. 머릿속의 의인화된 감정과 우리 사회와 유사한 형상을 보이는 현실화된 뇌의 모습을 정교하고 독창적이게 그려내어 비주얼적으로 높은 성과를 이루었다는 평가를 받았다. 꿈, 무의식, 기억, 어릴 적 상상의 친구와 같은 무형의 기제를 하나의 독자적이고 구체적인 영역으로 매우 신선하게 표현했으며, 감정들이 이 영역을 거치면서 겪는 크고 작은 사건들이 마치 모험과도 같은 구조를 띄고 있어 서사가 매우 흥미진진하게 구성되어 낭비되는 장면이 없다. 훗날 비슷한 컨셉의 영향을 소울이나 엘리멘탈 등에서 엿볼 수 있다.',
    openDate: '2015-06-19',
    runningTime: 94,
    backdropUrl: '/images/mockdata/insideout-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=1KGZtWbZtq8',
    ),
    rating: '전체관람가',
    countries: ['미국'],
    cast: [
      { name: '버럭이', image: '/images/mockdata/judy.webp' },
      { name: '까칠이', image: '/images/mockdata/nick.jpeg' },
      { name: '기쁨이', image: '/images/mockdata/hops.webp' },
      { name: '소심이', image: '/images/mockdata/choonsik.webp' },
      { name: '슬픔이', image: '/images/mockdata/choonsik.webp' },
    ],
    directors: [{ name: '피트 닥터' }],
  },
  // 추가된 mockDataMap 항목 (contentId: 4 ~ 9)
  4: {
    title: '이웃집 토토로',
    description:
      '도쿄 외곽의 시골 마을로 이사 온 사츠키와 메이는 숲속에서 신비로운 생명체 토토로를 만나게 된다. 자연과 조화롭게 살아가는 가족의 모습을 통해 따뜻함과 치유를 선사하는 지브리 대표작. 어린 시절의 순수함과 상상력이 빛나는 작품으로, 세대를 초월해 사랑받고 있다.',
    openDate: '1988-04-16',
    runningTime: 86,
    backdropUrl: '/images/mockdata/totoro-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=yrqmx630BIA',
    ),
    rating: '전체관람가',
    countries: ['일본'],
    cast: [
      { name: '사츠키', image: '/images/mockdata/placeholder.jpg' },
      { name: '메이', image: '/images/mockdata/placeholder.jpg' },
      { name: '토토로', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '미야자키 하야오' }],
  },
  5: {
    title: '센과 치히로의 행방불명',
    description:
      '평범한 소녀 치히로가 부모와 함께 이사 도중 신비한 세계로 들어가게 되면서 벌어지는 모험 이야기. 이름을 빼앗기고, 용기와 지혜로 위기를 극복해가는 성장담이 인상적이며, 일본 애니메이션 역사상 가장 위대한 작품 중 하나로 평가된다.',
    openDate: '2001-07-20',
    runningTime: 125,
    backdropUrl: '/images/mockdata/sen-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=lwrG3HQXTFw',
    ),
    rating: '전체관람가',
    countries: ['일본'],
    cast: [
      { name: '치히로', image: '/images/mockdata/placeholder.jpg' },
      { name: '하쿠', image: '/images/mockdata/placeholder.jpg' },
      { name: '유바바', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '미야자키 하야오' }],
  },
  6: {
    title: '하울의 움직이는 성',
    description:
      '저주로 인해 노파가 된 소피가 마법사 하울과 함께 전쟁과 마법이 얽힌 세계를 모험하며 점차 자신을 찾아가는 이야기. 화려한 배경과 다층적인 메시지가 어우러진 판타지 명작으로, 지브리 특유의 분위기와 로맨스가 돋보인다.',
    openDate: '2004-11-20',
    runningTime: 119,
    backdropUrl: '/images/mockdata/haul-backdrop.jpeg',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=YpqMZt1gOXU',
    ),
    rating: '전체관람가',
    countries: ['일본'],
    cast: [
      { name: '소피', image: '/images/mockdata/placeholder.jpg' },
      { name: '하울', image: '/images/mockdata/placeholder.jpg' },
      { name: '마르클', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '미야자키 하야오' }],
  },
  7: {
    title: '바람계곡의 나우시카',
    description:
      '인간 문명이 멸망한 이후, 오염된 대지에서 평화를 추구하는 공주 나우시카의 이야기. 자연과의 공존, 생명에 대한 경외심을 주제로 한 미야자키 하야오 초기 대표작이며, 지브리의 세계관 정립에 중요한 작품으로 꼽힌다.',
    openDate: '1984-03-11',
    runningTime: 117,
    backdropUrl: '/images/mockdata/nausika-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=3aZZemdUu0c',
    ),
    rating: '전체관람가',
    countries: ['일본'],
    cast: [
      { name: '나우시카', image: '/images/mockdata/placeholder.jpg' },
      { name: '크샤나', image: '/images/mockdata/placeholder.jpg' },
      { name: '아스벨', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '미야자키 하야오' }],
  },
  8: {
    title: '마녀 배달부 키키',
    description:
      '13살의 견습 마녀 키키가 독립하여 작은 도시에서 배달 일을 하며 성장하는 이야기. 실패와 외로움을 극복해가며 자아를 찾는 여정을 따뜻하게 그려낸 작품으로, 사춘기 소녀의 심리를 섬세하게 담아냈다.',
    openDate: '1989-07-29',
    runningTime: 103,
    backdropUrl: '/images/mockdata/kiki-backdrop.webp',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=zbvx7pqw5Gg',
    ),
    rating: '전체관람가',
    countries: ['일본'],
    cast: [
      { name: '키키', image: '/images/mockdata/placeholder.jpg' },
      { name: '지지', image: '/images/mockdata/placeholder.jpg' },
      { name: '토모보이', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '미야자키 하야오' }],
  },
  9: {
    title: '모노노케 히메',
    description:
      '산신의 저주를 받은 청년 아시타카가 자연과 인간 사이의 갈등 속에서 진실을 찾아가는 이야기. 인간의 탐욕과 생태 파괴에 대한 날카로운 통찰을 담아낸 작품으로, 지브리 스튜디오의 철학이 가장 잘 드러나는 수작이다.',
    openDate: '1997-07-12',
    runningTime: 134,
    backdropUrl: '/images/mockdata/hime-backdrop.jpg',
    trailerUrl: getYouTubeEmbedUrl(
      'https://www.youtube.com/watch?v=YOuG8m2RqOs',
    ),
    rating: '12세 이상 관람가',
    countries: ['일본'],
    cast: [
      { name: '아시타카', image: '/images/mockdata/placeholder.jpg' },
      { name: '산', image: '/images/mockdata/placeholder.jpg' },
      { name: '에보시', image: '/images/mockdata/placeholder.jpg' },
    ],
    directors: [{ name: '미야자키 하야오' }],
  },
};

export const getMockContentData = (contentId: number): MockContentData => {
  return mockDataMap[contentId] ?? mockDataMap[1];
};
