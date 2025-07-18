import { TicketComponent } from '@/types/recommend/TicketComponent';

// 실제로는 API에서 받아올 데이터
let contentDataPool: TicketComponent[] = [
  {
    contentId: 1,
    title: '주토피아',
    description:
      '토끼 경찰 주디 홉스와 여우 사기꾼 닉 와일드가 차별과 편견을 극복하며 공조 수사를 벌이는 이야기.',
    posterUrl: '/images/mockPoster/zootopia-poster.webp',
    backdropUrl: '/images/mockdata/zootopia.jpg',
    openDate: '2019년 01월 17일',
    runningTime: 104,
    episode: 1,
    rating: '전체관람가',
    categories: {
      category: '애니메이션',
      genres: ['판타지', '코미디'],
    },
    directors: ['바이런 하워드', '리치 무어'],
    platforms: ['디즈니+'],
  },
  {
    contentId: 2,
    title: '타짜',
    description:
      '도박판의 세계에 발을 들인 고니의 복수극. 화투판 위에서 펼쳐지는 치열한 심리전.',
    posterUrl: '/images/mockPoster/tazza-poster.webp',
    backdropUrl: '/images/mockdata/tazza-backdrop.webp',
    openDate: '2006년 09월 28일',
    runningTime: 139,
    episode: 1,
    rating: '청소년 관람불가',
    categories: {
      category: '영화',
      genres: ['범죄', '드라마'],
    },
    directors: ['최동훈'],
    platforms: ['왓챠'],
  },
  {
    contentId: 3,
    title: '인사이드 아웃',
    description:
      '감정들이 주인공이 된 독특한 설정의 픽사 애니메이션. 아이의 성장과 정체성을 다룬 감동적인 여정.',
    posterUrl: '/images/mockPoster/insideout-poster.webp',
    backdropUrl: '/images/mockdata/insideout-backdrop.webp',
    openDate: '2015년 06월 19일',
    runningTime: 94,
    episode: 1,
    rating: '전체관람가',
    categories: {
      category: '애니메이션',
      genres: ['가족', '판타지'],
    },
    directors: ['피트 닥터'],
    platforms: ['디즈니+'],
  },
  {
    contentId: 4,
    title: '이웃집 토토로',
    description:
      '자매와 숲의 정령 토토로의 만남. 순수함과 자연의 조화를 그린 힐링 애니메이션.',
    posterUrl: '/images/mockPoster/totoro-poster.webp',
    backdropUrl: '/images/mockdata/totoro-backdrop.webp',
    openDate: '1988년 04월 16일',
    runningTime: 86,
    episode: 1,
    rating: '전체관람가',
    categories: {
      category: '애니메이션',
      genres: ['판타지', '가족'],
    },
    directors: ['미야자키 하야오'],
    platforms: ['넷플릭스'],
  },
  {
    contentId: 5,
    title: '센과 치히로의 행방불명',
    description:
      '이름을 빼앗긴 소녀 치히로가 신비한 세계에서 자아를 찾아가는 판타지 대서사시.',
    posterUrl: '/images/mockPoster/sen-poster.webp',
    backdropUrl: '/images/mockdata/sen-backdrop.webp',
    openDate: '2001년 07월 20일',
    runningTime: 125,
    episode: 1,
    rating: '전체관람가',
    categories: {
      category: '애니메이션',
      genres: ['판타지', '모험'],
    },
    directors: ['미야자키 하야오'],
    platforms: ['넷플릭스'],
  },
  {
    contentId: 6,
    title: '하울의 움직이는 성',
    description:
      '노파가 된 소피가 하울과 함께 전쟁과 마법이 얽힌 세계를 여행하는 판타지 로맨스.',
    posterUrl: '/images/mockPoster/haul-poster.webp',
    backdropUrl: '/images/mockdata/haul-backdrop.jpeg',
    openDate: '2004년 11월 20일',
    runningTime: 119,
    episode: 1,
    rating: '전체관람가',
    categories: {
      category: '애니메이션',
      genres: ['로맨스', '전쟁'],
    },
    directors: ['미야자키 하야오'],
    platforms: ['넷플릭스'],
  },
  {
    contentId: 7,
    title: '바람계곡의 나우시카',
    description: '오염된 대지에서 평화를 추구하는 공주 나우시카의 생태 판타지.',
    posterUrl: '/images/mockPoster/nausika-poster.webp',
    backdropUrl: '/images/mockdata/nausika-backdrop.webp',
    openDate: '1984년 03월 11일',
    runningTime: 117,
    episode: 1,
    rating: '전체관람가',
    categories: {
      category: '애니메이션',
      genres: ['SF', '환경'],
    },
    directors: ['미야자키 하야오'],
    platforms: ['넷플릭스'],
  },
  {
    contentId: 8,
    title: '마녀 배달부 키키',
    description: '자립을 시작한 13살 마녀 키키의 성장과 배달 모험.',
    posterUrl: '/images/mockPoster/kiki-poster.webp',
    backdropUrl: '/images/mockdata/kiki-backdrop.webp',
    openDate: '1989년 07월 29일',
    runningTime: 103,
    episode: 1,
    rating: '전체관람가',
    categories: {
      category: '애니메이션',
      genres: ['성장', '힐링'],
    },
    directors: ['미야자키 하야오'],
    platforms: ['넷플릭스'],
  },
  {
    contentId: 9,
    title: '모노노케 히메',
    description:
      '인간과 자연의 대립 속에서 진실을 찾아가는 청년 아시타카의 여정.',
    posterUrl: '/images/mockPoster/hime-poster.webp',
    backdropUrl: '/images/mockdata/hime-backdrop.jpg',
    openDate: '1997년 07월 12일',
    runningTime: 134,
    episode: 1,
    rating: '12세 이상',
    categories: {
      category: '애니메이션',
      genres: ['판타지', '모험'],
    },
    directors: ['미야자키 하야오'],
    platforms: ['넷플릭스'],
  },
  {
    contentId: 10,
    title: '라푼젤',
    description:
      '탑 속에 갇혀 지내던 라푼젤이 자유를 찾아 떠나는 모험과 자아 발견의 이야기.',
    posterUrl: '/images/mockPoster/rapunzel-poster.webp',
    backdropUrl: '/images/mockdata/rapunzel-backdrop.webp',
    openDate: '2010년 11월 24일',
    runningTime: 100,
    episode: 1,
    rating: '전체관람가',
    categories: {
      category: '애니메이션',
      genres: ['모험', '로맨스'],
    },
    directors: ['네이선 그레노', '바이런 하워드'],
    platforms: ['디즈니+'],
  },
  {
    contentId: 11,
    title: '코코',
    description:
      '죽은 자들의 세상으로 간 소년 미겔이 가족과 음악의 소중함을 깨닫는 감동 스토리.',
    posterUrl: '/images/mockPoster/coco-poster.webp',
    backdropUrl: '/images/mockdata/coco-backdrop.webp',
    openDate: '2017년 11월 24일',
    runningTime: 105,
    episode: 1,
    rating: '전체관람가',
    categories: {
      category: '애니메이션',
      genres: ['음악', '가족'],
    },
    directors: ['리 언크리치'],
    platforms: ['디즈니+'],
  },
  {
    contentId: 12,
    title: '벼랑 위의 포뇨',
    description:
      '물고기 소녀 포뇨와 소스케의 만남, 그리고 세상을 구하는 마법 같은 우정 이야기.',
    posterUrl: '/images/mockPoster/ponyo-poster.webp',
    backdropUrl: '/images/mockdata/ponyo-backdrop.webp',
    openDate: '2008년 07월 19일',
    runningTime: 101,
    episode: 1,
    rating: '전체관람가',
    categories: {
      category: '애니메이션',
      genres: ['판타지', '가족'],
    },
    directors: ['미야자키 하야오'],
    platforms: ['넷플릭스'],
  },
  {
    contentId: 13,
    title: '업',
    description:
      '하늘을 나는 집과 함께 떠나는 노인 칼과 소년 러셀의 감동 모험 이야기.',
    posterUrl: '/images/mockPoster/up-poster.webp',
    backdropUrl: '/images/mockdata/up-backdrop.webp',
    openDate: '2009년 05월 29일',
    runningTime: 96,
    episode: 1,
    rating: '전체관람가',
    categories: {
      category: '애니메이션',
      genres: ['모험', '감동'],
    },
    directors: ['피트 닥터'],
    platforms: ['디즈니+'],
  },
  {
    contentId: 14,
    title: '루카',
    description:
      '바닷속 괴물 소년 루카가 인간 세계에서 겪는 우정과 성장을 그린 여름 이야기.',
    posterUrl: '/images/mockPoster/luca-poster.webp',
    backdropUrl: '/images/mockdata/luca-backdrop.webp',
    openDate: '2021년 06월 18일',
    runningTime: 95,
    episode: 1,
    rating: '전체관람가',
    categories: {
      category: '애니메이션',
      genres: ['성장', '우정'],
    },
    directors: ['엔리코 카사로사'],
    platforms: ['디즈니+'],
  },
];

// 새로운 영화 데이터를 풀에 추가하는 함수
export const addcontentDataPool = (newContent: TicketComponent[]): void => {
  contentDataPool.push(...newContent);
};

// 현재 사용 가능한 영화 데이터 가져오기
export const getAvailableContents = (): TicketComponent[] => {
  return [...contentDataPool]; // 복사본 반환
};

// 특정 범위의 영화 가져오기
export const getContentsSlice = (
  start: number,
  count: number,
): TicketComponent[] => {
  return contentDataPool.slice(start, start + count);
};

// 풀 크기 확인
export const getPoolSize = (): number => {
  return contentDataPool.length;
};

// API 호출 시뮬레이션 (10초마다 실행될 함수)
export const fetchMoreContents = async (): Promise<TicketComponent[]> => {
  // 실제로는 axiosInstance.get('/recommend/more') 같은 API 호출

  const newMovies: TicketComponent[] = [
    {
      contentId: 10,
      title: '플래시',
      description:
        '과거를 바꾸기 위해 시간여행을 한 플래시가 예상치 못한 결과로 인해 다중우주에서 벌어지는 모험.',
      posterUrl: '/poster.webp',
      backdropUrl: '/snapshot.webp',
      openDate: '2023년 6월 14일',
      runningTime: 144,
      episode: 1,
      rating: '12세이상관람가',
      categories: {
        category: '영화',
        genres: ['애니메이션', '액션'],
      },
      directors: ['안드레스 무스키에티'],
      platforms: ['넷플릭스', '디즈니+'],
    },
  ];

  addcontentDataPool(newMovies);
  return newMovies;
};
