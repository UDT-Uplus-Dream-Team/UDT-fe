type FilterCategory =
  | 'categories'
  | 'platforms'
  | 'countries'
  | 'openDates'
  | 'ratings'
  | 'genres';

interface RequestFilterBody {
  categories: string[];
  platforms: string[];
  countries: string[];
  openDates: string[]; // ISO string
  ratings: string[];
  genres: string[];
}

const CATEGORY_SETS: Record<
  Exclude<FilterCategory, 'openDates'>,
  Set<string>
> = {
  categories: new Set(['영화', '애니메이션', '예능', '드라마']),
  platforms: new Set([
    '넷플릭스',
    '디즈니+',
    '웨이브',
    '왓챠',
    '티빙',
    '쿠팡플레이',
  ]),
  countries: new Set([
    '한국',
    '일본',
    '중국',
    '미국',
    '대만',
    '홍콩',
    '이탈리아',
    '인도',
  ]),
  ratings: new Set([
    '전체 관람가',
    '12세 이상 관람가',
    '15세 이상 관람가',
    '청소년 관람불가',
  ]),
  genres: new Set([
    '액션',
    '판타지',
    'SF',
    '스릴러',
    '미스터리',
    '어드벤처',
    '뮤지컬',
    '코미디',
    '서부극',
    '멜로/로맨스',
    '서사/드라마',
    '공포(호러)',
    '다큐멘터리',
    '범죄',
    '무협',
    '사극/시대극',
    '성인',
    '키즈',
    '버라이어티',
    '토크쇼',
    '서바이벌',
    '리얼리티',
    '스탠드업코미디',
  ]),
};

// 필터 옵션 선택 후 필터링된 콘텐츠를 받아오는 api 요청 시 Request Body를 생성하는 함수
export function createFilterRequestParam(
  selectedFilters: string[],
): RequestFilterBody {
  const result: RequestFilterBody = {
    categories: [],
    platforms: [],
    countries: [],
    openDates: [],
    ratings: [],
    genres: [],
  };

  selectedFilters.forEach((item) => {
    // "2020년"처럼 끝나는 연도 항목 처리
    const yearMatch = item.match(/^(\d{4})년$/);
    if (yearMatch) {
      const year = yearMatch[1];
      const isoDate = `${year}-01-01T00:00:00.000Z`;
      result.openDates.push(isoDate);
      return;
    }

    // 일반 카테고리 처리
    (
      Object.entries(CATEGORY_SETS) as [keyof RequestFilterBody, Set<string>][]
    ).forEach(([key, set]) => {
      if (set.has(item)) {
        result[key].push(item);
      }
    });
  });

  // 여기서 불필요한 빈 배열 제거 (정제)
  const cleanedResult = Object.entries(result).reduce((acc, [key, value]) => {
    if (Array.isArray(value) && value.length > 0) {
      acc[key as keyof RequestFilterBody] = value;
    }
    return acc;
  }, {} as Partial<RequestFilterBody>);

  return cleanedResult as RequestFilterBody;
}
