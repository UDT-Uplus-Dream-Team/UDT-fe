import { useContext } from 'react';
import { ExplorePageContext } from '@/store/ExplorePageContext';

// "탐색" 페이지에서 사용되는 컨텍스트 정보(지역 전역 state)를 관리하는 커스텀 훅
export const useExplorePageState = () => {
  const context = useContext(ExplorePageContext);
  if (context === undefined) {
    throw new Error(
      'useExploreFilter는 반드시 ExploreFilterProvider 내에서 사용되어야 합니다.',
    );
  }
  return context;
};
