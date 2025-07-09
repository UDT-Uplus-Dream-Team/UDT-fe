import { FilterRadioButton } from '@components/explore/FilterRadioButton';
import { useExplorePageState } from '@hooks/useExplorePageState';

// 필터링 버튼 누를 시 표시되는 BottomSheet 콘텐츠의 내용
export const FilterBottomSheetContent = () => {
  const {
    filterOptions,
    currentSelectedOptions,
    toggleOption,
    clearSelectedOptions,
    closeBottomSheet,
    confirmBottomSheet,
  } = useExplorePageState();

  const countries = [
    '한국',
    '일본',
    '중국',
    '미국',
    '대만',
    '홍콩',
    '이탈리아',
    '인도',
  ];

  const grades = ['전체 관람가', '12세 이상', '15세 이상', '청소년 관람불가'];

  return (
    <div className="flex flex-col items-center justify-start h-full">
      {/* 헤더 영역 */}
      <div className="flex items-center justify-between p-4">
        <span className="text-xl font-semibold text-white">필터</span>
      </div>

      {/* 필터 옵션 영역 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* 카테고리 필터 */}
          <div className="max-w-full">
            <span className="text-sm font-medium text-white pb-3">
              카테고리
            </span>
            <div className="flex flex-wrap gap-3">
              {filterOptions.map((option) => (
                <FilterRadioButton
                  key={option}
                  label={option}
                  isSelected={currentSelectedOptions.includes(option)}
                  onToggle={toggleOption}
                />
              ))}
            </div>
          </div>

          {/* 국가 필터 */}
          <div className="max-w-full">
            <span className="text-sm font-medium text-white pb-3">국가</span>
            <div className="flex flex-wrap gap-3">
              {countries.map((country) => (
                <FilterRadioButton
                  key={country}
                  label={country}
                  isSelected={currentSelectedOptions.includes(country)}
                  onToggle={toggleOption}
                />
              ))}
            </div>
          </div>

          {/* 등급 필터 */}
          <div className="max-w-full">
            <span className="text-sm font-medium text-white pb-3">등급</span>
            <div className="flex flex-wrap gap-3">
              {grades.map((grade) => (
                <FilterRadioButton
                  key={grade}
                  label={grade}
                  isSelected={currentSelectedOptions.includes(grade)}
                  onToggle={toggleOption}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between p-4 gap-4">
        <button
          onClick={confirmBottomSheet}
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
        <button
          onClick={closeBottomSheet}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          취소
        </button>
      </div>
    </div>
  );
};
