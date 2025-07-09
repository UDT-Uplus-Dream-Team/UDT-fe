// "탐색 페이지"에서 사용되는 컨텍스트 타입 정의
export interface ExplorePageContextType {
  filterOptions: string[]; // 상단에 표시될 필터 옵션들
  selectedOptions: string[]; // 선택된 필터 옵션들
  hasUserData: boolean; // 사용자 정보 존재 여부
  toggleOption: (label: string, isSelected: boolean) => void; // 필터 옵션 토글 함수
  clearSelectedOptions: () => void; // 선택된 옵션들 초기화 함수
}
