import { MovieData } from '@type/Moviedata';

// 실제 API 엔드포인트 설정
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001/api';

export interface MovieServiceResponse {
  success: boolean;
  data?: MovieData[];
  error?: string;
}

/**
 * Server에서 대표 영화 데이터를 가져오는 함수
 * @param filters - 필터 옵션 (선택사항)
 * @returns Promise<MovieServiceResponse>
 */
export const fetchMovies = async (filters?: {
  genre?: string;
  platform?: string;
  rating?: string;
  limit?: number;
}): Promise<MovieServiceResponse> => {
  try {
    // URL 파라미터 구성
    const params = new URLSearchParams();
    if (filters?.genre) params.append('genre', filters.genre);
    if (filters?.platform) params.append('platform', filters.platform);
    if (filters?.rating) params.append('rating', filters.rating);
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const url = `${API_BASE_URL}/movies${
      params.toString() ? `?${params.toString()}` : ''
    }`;

    // TODO: 지금은 fetch로 되어 있는데, 나중에 axios, next-response 등으로 변경 예정
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // 캐시 설정 (5분)
      cache: 'default',
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data.movies || data,
    };
  } catch (error) {
    console.error('영화 데이터 가져오기 실패:', error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.',
    };
  }
};

/**
 * 특정 영화의 상세 정보를 가져오는 함수
 * @param contentId - 영화 ID
 * @returns Promise<MovieServiceResponse>
 */
export const fetchMovieDetail = async (
  contentId: number,
): Promise<MovieServiceResponse> => {
  try {
    const response = await fetch(`${API_BASE_URL}/movies/${contentId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data.movie || data,
    };
  } catch (error) {
    console.error('영화 상세 정보 가져오기 실패:', error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.',
    };
  }
};

/**
 * 추천 영화 목록을 가져오는 함수
 * @param userId - 사용자 ID (선택사항)
 * @param limit - 가져올 영화 수 (기본값: 10)
 * @returns Promise<MovieServiceResponse>
 */
export const fetchRecommendedMovies = async (
  userId?: string,
  limit: number = 10,
): Promise<MovieServiceResponse> => {
  try {
    const params = new URLSearchParams();
    if (userId) params.append('userId', userId);
    params.append('limit', limit.toString());

    const response = await fetch(
      `${API_BASE_URL}/movies/recommended?${params.toString()}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return {
      success: true,
      data: data.movies || data,
    };
  } catch (error) {
    console.error('추천 영화 가져오기 실패:', error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : '알 수 없는 오류가 발생했습니다.',
    };
  }
};
