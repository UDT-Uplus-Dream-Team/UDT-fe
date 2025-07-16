import type { Content } from '@/types/admin/Content';

export const mockContentList: Content[] = [
  {
    contentId: 1,
    title: '드래곤 길들이기',
    description:
      '용맹한 바이킹과 사나운 드래곤의 우정 이야기. 히컵이라는 소년이 투슬리스라는 드래곤과 만나면서 벌어지는 모험과 성장의 이야기를 그린 애니메이션 영화입니다.',
    posterUrl: '/images/dragon.jpg',
    backdropUrl: '/placeholder.svg?height=600&width=1200',
    trailerUrl: 'https://youtube.com/trailer123',
    openDate: '2019-01-17',
    runningTime: 137,
    episode: 1,
    rating: '12세 관람가',
    categories: [
      {
        categoryType: '영화',
        genres: ['SF', '코미디', '가족'],
      },
    ],
    countries: ['미국', '영국'],
    directors: ['딘 드블루아', '크리스 샌더스'],
    casts: [
      {
        castName: '제이 바루첼',
        castImageUrl: '/images/jay.jpg',
      },
      {
        castName: '아메리카 페레라',
        castImageUrl: '/placeholder.svg?height=100&width=100',
      },
      {
        castName: '제라드 버틀러',
        castImageUrl: '/placeholder.svg?height=100&width=100',
      },
    ],
    platforms: [
      {
        platformType: '넷플릭스',
        watchUrl: 'https://netflix.com/dragon',
        isAvailable: true,
      },
      {
        platformType: '디즈니플러스',
        watchUrl: 'https://disneyplus.com/dragon',
        isAvailable: true,
      },
    ],
  },
  {
    contentId: 2,
    title: '기생충',
    description:
      '전 세계를 충격에 빠뜨린 봉준호 감독의 대표작. 계급 사회의 모순을 날카롭게 파헤친 블랙 코미디 스릴러로, 아카데미 작품상을 수상한 한국 영화의 걸작입니다.',
    posterUrl: '/placeholder.svg?height=400&width=300',
    backdropUrl: '/placeholder.svg?height=600&width=1200',
    trailerUrl: 'https://youtube.com/parasite',
    openDate: '2019-05-30',
    runningTime: 132,
    episode: 1,
    rating: '15세 관람가',
    categories: [
      {
        categoryType: '영화',
        genres: ['스릴러', '드라마', '코미디'],
      },
    ],
    countries: ['한국'],
    directors: ['봉준호'],
    casts: [
      {
        castName: '송강호',
        castImageUrl: '/placeholder.svg?height=100&width=100',
      },
      {
        castName: '이선균',
        castImageUrl: '/placeholder.svg?height=100&width=100',
      },
      {
        castName: '조여정',
        castImageUrl: '/placeholder.svg?height=100&width=100',
      },
      {
        castName: '최우식',
        castImageUrl: '/placeholder.svg?height=100&width=100',
      },
    ],
    platforms: [
      {
        platformType: '넷플릭스',
        watchUrl: 'https://netflix.com/parasite',
        isAvailable: true,
      },
      {
        platformType: '왓챠',
        watchUrl: 'https://watcha.com/parasite',
        isAvailable: true,
      },
      {
        platformType: '웨이브',
        watchUrl: 'https://wavve.com/parasite',
        isAvailable: false,
      },
    ],
  },
  {
    contentId: 3,
    title: '오징어 게임',
    description:
      '생존을 위한 극한의 게임이 시작된다. 거액의 상금을 놓고 벌이는 죽음의 게임에서 살아남기 위한 사람들의 이야기를 그린 넷플릭스 오리지널 시리즈.',
    posterUrl: '/placeholder.svg?height=400&width=300',
    backdropUrl: '/placeholder.svg?height=600&width=1200',
    trailerUrl: 'https://youtube.com/squidgame',
    openDate: '2021-09-17',
    runningTime: 60,
    episode: 9,
    rating: '청소년 관람불가',
    categories: [
      {
        categoryType: '드라마',
        genres: ['스릴러', '드라마', '서스펜스'],
      },
    ],
    countries: ['한국'],
    directors: ['황동혁'],
    casts: [
      {
        castName: '이정재',
        castImageUrl: '/placeholder.svg?height=100&width=100',
      },
      {
        castName: '박해수',
        castImageUrl: '/placeholder.svg?height=100&width=100',
      },
      {
        castName: '위하준',
        castImageUrl: '/placeholder.svg?height=100&width=100',
      },
    ],
    platforms: [
      {
        platformType: '넷플릭스',
        watchUrl: 'https://netflix.com/squidgame',
        isAvailable: true,
      },
    ],
  },
  {
    contentId: 4,
    title: '귀멸의 칼날',
    description:
      '가족을 잃고 여동생이 귀신이 된 탄지로의 복수와 구원의 이야기. 일본에서 큰 인기를 얻은 애니메이션으로, 뛰어난 작화와 스토리로 전 세계적인 사랑을 받고 있습니다.',
    posterUrl: '/placeholder.svg?height=400&width=300',
    backdropUrl: '/placeholder.svg?height=600&width=1200',
    trailerUrl: 'https://youtube.com/demonslayer',
    openDate: '2019-04-06',
    runningTime: 24,
    episode: 26,
    rating: '15세 관람가',
    categories: [
      {
        categoryType: '애니메이션',
        genres: ['액션', '판타지', '드라마'],
      },
    ],
    countries: ['일본'],
    directors: ['소토자키 하루오'],
    casts: [
      {
        castName: '하나에 나츠키',
        castImageUrl: '/placeholder.svg?height=100&width=100',
      },
      {
        castName: '사토 사토미',
        castImageUrl: '/placeholder.svg?height=100&width=100',
      },
    ],
    platforms: [
      {
        platformType: '넷플릭스',
        watchUrl: 'https://netflix.com/demonslayer',
        isAvailable: true,
      },
    ],
  },
  {
    contentId: 5,
    title: '런닝맨',
    description:
      '대한민국 최고의 예능 프로그램 중 하나. 매주 다양한 게임과 미션을 통해 웃음을 선사하는 버라이어티 쇼로, 고정 멤버들의 케미와 게스트들의 활약이 볼거리입니다.',
    posterUrl: '/placeholder.svg?height=400&width=300',
    backdropUrl: '/placeholder.svg?height=600&width=1200',
    trailerUrl: 'https://youtube.com/runningman',
    openDate: '2010-07-11',
    runningTime: 90,
    episode: 700,
    rating: '전체관람가',
    categories: [
      {
        categoryType: '예능',
        genres: ['버라이어티', '게임', '코미디'],
      },
    ],
    countries: ['한국'],
    directors: ['조효진', '임형택'],
    casts: [
      {
        castName: '유재석',
        castImageUrl: '/placeholder.svg?height=100&width=100',
      },
      {
        castName: '김종국',
        castImageUrl: '/placeholder.svg?height=100&width=100',
      },
      {
        castName: '송지효',
        castImageUrl: '/placeholder.svg?height=100&width=100',
      },
    ],
    platforms: [
      {
        platformType: '웨이브',
        watchUrl: 'https://wavve.com/runningman',
        isAvailable: true,
      },
    ],
  },
];
