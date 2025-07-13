import { useQueryClient } from '@tanstack/react-query';
import { UserInfo } from '@type/UserInfo';
import { useMemo } from 'react';

// TanStack Query로 인해 캐싱된 OTT 정보를 가져와 filterOptions를 업데이트하는 useFetchOttFilterOptions
export const useFetchOttFilterOptions = () => {
  const queryClient = useQueryClient();

  // 이미 캐싱된 사용자 정보 가져오기
  const userInfo = queryClient.getQueryData<UserInfo>(['userInfo']);

  // 초기 Filter 옵션 생성 (OTT 정보를 맨 앞에 배치)
  const filterOptions = useMemo(() => {
    const options: string[] = [];

    // 1. 사용자 OTT 구독 서비스들을 맨 앞에 추가
    if (userInfo?.platforms && userInfo.platforms.length > 0) {
      options.push(...userInfo.platforms);
    }

    // 2. 나머지 기본 옵션들 추가
    const remainingOptions = ['영화', '드라마', '예능', '애니메이션'];
    options.push(...remainingOptions);

    return options;
  }, [userInfo]);

  return {
    filterOptions, // 초기 필터 옵션, 추후 업데이트 될 사안 (OTT 정보 + 기본 옵션)
    isLoading: false, // 캐시된 데이터를 사용하므로 로딩 상태 항상 false
    hasUserData: !!userInfo, // 사용자 정보가 있는지 여부
  };
};
