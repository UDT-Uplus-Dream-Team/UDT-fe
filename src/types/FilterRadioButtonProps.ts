// FilterRadioButton 컴포넌트의 props 타입 정의
export interface FilterRadioButtonProps {
  label: string; // 라디오 버튼에 들어갈 글자 (value로도 사용)
  isSelected?: boolean; // 선택된 상태
  onToggle?: (label: string, isSelected: boolean) => void; // 토글 시 호출될 콜백
}
