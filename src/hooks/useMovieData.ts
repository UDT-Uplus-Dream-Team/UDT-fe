import { useState, useEffect } from 'react';
import { MovieData } from '@/types/Moviedata';

interface UseMovieDataReturn {
  movies: MovieData[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// 테스트용 더미 영화 데이터 (나중에 API 연동 시 제거)
const mockMovies: MovieData[] = [
  {
    contentId: 1,
    title: '인터스텔라',
    description: '우주를 배경으로 한 SF 영화',
    posterUrl: '/images/poster1.webp',
    backdropUrl: '/images/poster1.webp',
    openDate: '2014-11-06',
    runtimeTime: 169,
    rating: '12세이상관람가',
    categories: ['SF', '드라마'],
    genres: ['SF', '드라마', '모험', '스릴러'],
    directors: ['크리스토퍼 놀란'],
    platforms: ['넷플릭스', '티빙'],
  },
  {
    contentId: 2,
    title: '듄',
    description: '사막 행성 아라키스의 운명을 건 모험',
    posterUrl: '/images/poster2.webp',
    backdropUrl: '/images/poster2.webp',
    openDate: '2021-10-22',
    runtimeTime: 155,
    rating: '12세이상관람가',
    categories: ['SF', '모험'],
    genres: ['SF', '모험', '드라마', '액션'],
    directors: ['드니 빌뇌브'],
    platforms: ['티빙', '웨이브'],
  },
  {
    contentId: 3,
    title: '오펜하이머',
    description: '원자폭탄 개발의 역사적 순간',
    posterUrl: '/images/poster3.webp',
    backdropUrl: '/images/poster3.webp',
    openDate: '2023-08-15',
    runtimeTime: 180,
    rating: '15세이상관람가',
    categories: ['드라마', '스릴러'],
    genres: ['드라마', '스릴러', '역사', '전쟁'],
    directors: ['크리스토퍼 놀란'],
    platforms: ['넷플릭스', '쿠팡플레이'],
  },
  {
    contentId: 4,
    title: '아바타: 물의 길',
    description: '판도라 행성의 새로운 모험',
    posterUrl: '/images/poster1.webp',
    backdropUrl: '/images/poster1.webp',
    openDate: '2022-12-14',
    runtimeTime: 192,
    rating: '12세이상관람가',
    categories: ['SF', '모험'],
    genres: ['SF', '모험', '액션', '판타지'],
    directors: ['제임스 카메론'],
    platforms: ['디즈니플러스', '티빙'],
  },
  {
    contentId: 5,
    title: '블랙 팬서: 와칸다 포에버',
    description: '와칸다의 새로운 전설',
    posterUrl: '/images/poster2.webp',
    backdropUrl: '/images/poster2.webp',
    openDate: '2022-11-09',
    runtimeTime: 161,
    rating: '12세이상관람가',
    categories: ['액션', '모험'],
    genres: ['액션', '모험', 'SF', '드라마'],
    directors: ['라이언 쿠글러'],
    platforms: ['디즈니플러스', '티빙'],
  },
  {
    contentId: 6,
    title: '탑건: 매버릭',
    description: '최고의 파일럿이 돌아왔다',
    posterUrl: '/images/poster3.webp',
    backdropUrl: '/images/poster3.webp',
    openDate: '2022-05-27',
    runtimeTime: 130,
    rating: '12세이상관람가',
    categories: ['액션', '드라마'],
    genres: ['액션', '드라마', '전쟁', '스릴러'],
    directors: ['조셉 코신스키'],
    platforms: ['넷플릭스', '쿠팡플레이'],
  },
  {
    contentId: 7,
    title: '스파이더맨: 노 웨이 홈',
    description: '멀티버스의 문이 열렸다',
    posterUrl: '/images/poster1.webp',
    backdropUrl: '/images/poster1.webp',
    openDate: '2021-12-15',
    runtimeTime: 148,
    rating: '12세이상관람가',
    categories: ['액션', '모험'],
    genres: ['액션', '모험', 'SF', '판타지'],
    directors: ['존 왓츠'],
    platforms: ['디즈니플러스', '넷플릭스'],
  },
  {
    contentId: 8,
    title: '배트맨',
    description: '고담시의 어둠을 밝히는 영웅',
    posterUrl: '/images/poster2.webp',
    backdropUrl: '/images/poster2.webp',
    openDate: '2022-03-01',
    runtimeTime: 176,
    rating: '15세이상관람가',
    categories: ['액션', '스릴러'],
    genres: ['액션', '스릴러', '범죄', '드라마'],
    directors: ['맷 리브스'],
    platforms: ['티빙', '웨이브'],
  },
];

export const useMovieData = (filters?: {
  genre?: string;
  platform?: string;
  rating?: string;
  limit?: number;
}): UseMovieDataReturn => {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMovieData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 로딩 시뮬레이션 (1초)
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 필터링 로직 (실제 API와 동일한 방식으로)
      let filteredMovies = [...mockMovies];

      if (filters?.genre) {
        filteredMovies = filteredMovies.filter((movie) =>
          movie.genres.some((genre) =>
            genre.toLowerCase().includes(filters.genre!.toLowerCase()),
          ),
        );
      }

      if (filters?.platform) {
        const platformList = filters.platform
          .split(',')
          .map((p) => p.trim().toLowerCase());
        filteredMovies = filteredMovies.filter((movie) =>
          movie.platforms.some((platform) =>
            platformList.some((filterPlatform) =>
              platform.toLowerCase().includes(filterPlatform),
            ),
          ),
        );
      }

      if (filters?.rating) {
        filteredMovies = filteredMovies.filter((movie) =>
          movie.rating.includes(filters.rating!),
        );
      }

      if (filters?.limit) {
        filteredMovies = filteredMovies.slice(0, filters.limit);
      }

      // 에러 시뮬레이션 (5% 확률로 에러 발생)
      if (Math.random() < 0.05) {
        throw new Error('네트워크 오류가 발생했습니다.');
      }

      setMovies(filteredMovies);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : '영화 데이터를 불러오는데 실패했습니다.',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovieData();
  }, [filters]);

  const refetch = () => {
    fetchMovieData();
  };

  return { movies, loading, error, refetch };
};
