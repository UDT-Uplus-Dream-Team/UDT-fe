import { FilterRadioButton } from '@components/explore/FilterRadioButton';
import { useExplorePageState } from '@hooks/useExplorePageState';

// 필터링 버튼 누를 시 표시되는 BottomSheet 콘텐츠의 내용 타입 정의
interface FilterBottomSheetContentProps {
  onClose?: () => void;
}

// 필터링 버튼 누를 시 표시되는 BottomSheet 콘텐츠의 내용
export const FilterBottomSheetContent = ({
  onClose,
}: FilterBottomSheetContentProps) => {
  const { filterOptions, selectedOptions, toggleOption, clearSelectedOptions } =
    useExplorePageState();
  return (
    <div className="flex flex-col h-full">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">필터</h2>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          완료
        </button>
        <button
          onClick={clearSelectedOptions}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          초기화
        </button>
      </div>

      {/* 필터 옵션 영역 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">카테고리</h3>
            <div className="grid grid-cols-2 gap-3">
              {filterOptions.map((option) => (
                <FilterRadioButton
                  key={option}
                  label={option}
                  isSelected={selectedOptions.includes(option)}
                  onToggle={toggleOption}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
