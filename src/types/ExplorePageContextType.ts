// "탐색 페이지"에서 사용되는 컨텍스트 타입 정의
export interface ExplorePageContextType {
  filterOptions: string[]; // 목록 상단에 표시될 필터 옵션들
  selectedOptions: string[]; // 선택된 필터 옵션들
  hasUserData: boolean; // 사용자 정보 존재 여부
  isBottomSheetOpen: boolean; // 필터 BottomSheet 열림 여부
  currentSelectedOptions: string[]; // 현재 UI에 표시할 선택된 옵션들
  openBottomSheet: () => void; // 필터 BottomSheet 열기 함수
  closeBottomSheet: () => void; // 필터 BottomSheet 닫기 함수
  confirmBottomSheet: () => void; // 필터 BottomSheet 확정 함수
  toggleOption: (label: string, isSelected: boolean) => void; // 필터 옵션 토글 함수
  clearSelectedOptions: () => void; // 선택된 옵션들 초기화 함수
}
