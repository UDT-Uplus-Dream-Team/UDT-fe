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
export const getMockContentData = (contentId: number): MockContentData => {
  const mockDataMap = {
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
    },
    2: {
      title: '타짜',
      description:
        '함께 원정을 뛰며 나름의 도박인생을 꾸려가는 고니와 고광렬. 원정 중 우연히 들른 한 술집에서 고니는 술집주인 화란을 만나고 둘은 첫 눈에 서로에게 끌리지만 한없이 떠도는 타짜의 인생에 사랑은 그리 쉬운 일이 아니다. 한편, 고니는 자신을 이 세계에 발 담그게 한 장본인 박무석과 그를 조종하는 인물 곽철용을 찾게 되고, 드디어 보기 좋게 한 판 복수에 성공한다. 하지만 곽철용의 수하는 복수가 낳은 복수를 위해 아귀에게 도움을 청하고, 아귀는 고니에게 애증을 가진 정마담을 미끼로 고니와 고광렬을 화투판으로 끌어들인다. 기차역에서 스쳤던 아귀를 기억해내며 그것이 ‘죽음의 한 판’이란 것을 느끼는 고니. 하지만 고니는 이를 거절하지 않는다. 고광렬의 만류도 뿌리친 채, 그리고 처음으로 평범한 삶을 꿈꾸게 한 여자 화란과의 사랑도 뒤로 한 채, 고니는 그렇게 죽음의 판이 펼쳐질 배에 스스로 오르는데…. 물러설 곳 없는 꽃들의 전쟁..! 각자의 원한과 욕망, 그리고 덧없는 희망, 이 모든 것이 뒤엉킨 한 판이 시작된다..!',
      openDate: '2006-09-28',
      runningTime: 139,
      backdropUrl: '/images/mockdata/zootopia.jpg',
      trailerUrl: getYouTubeEmbedUrl(
        'https://www.youtube.com/watch?v=K4OJXmoakF4',
      ),
      rating: '청소년 관람불가',
      countries: ['한국'],
      cast: [
        { name: '조승우', image: '/images/mockdata/judy.webp' },
        { name: '김혜수', image: '/images/mockdata/nick.jpeg' },
        { name: '백윤식', image: '/images/mockdata/hops.webp' },
        { name: '유해진', image: '/images/mockdata/choonsik.webp' },
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
    },
  };

  if (contentId === 1 || contentId === 2) {
    return mockDataMap[contentId];
  }

  return mockDataMap[1]; // 기본값 설정
};
