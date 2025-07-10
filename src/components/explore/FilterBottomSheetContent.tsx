import { FilterRadioButton } from '@components/explore/FilterRadioButton';
import { useExplorePageState } from '@hooks/useExplorePageState';
import { filterData } from '@lib/filterData';
import Image from 'next/image';

// 필터링 버튼 누를 시 표시되는 BottomSheet 콘텐츠의 내용
export const FilterBottomSheetContent = () => {
  const {
    currentSelectedOptions,
    toggleOption,
    clearSelectedOptions,
    confirmBottomSheet,
  } = useExplorePageState();

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
            <span className="text-sm font-medium text-white">카테고리</span>
            <div className="flex flex-wrap gap-3 mt-2">
              {filterData.mainCategories.map((option) => (
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
            <span className="text-sm font-medium text-white">국가</span>
            <div className="flex flex-wrap gap-3 mt-2">
              {filterData.countries.map((country) => (
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
            <span className="text-sm font-medium text-white">등급</span>
            <div className="flex flex-wrap gap-3 mt-2">
              {filterData.grades.map((grade) => (
                <FilterRadioButton
                  key={grade}
                  label={grade}
                  isSelected={currentSelectedOptions.includes(grade)}
                  onToggle={toggleOption}
                />
              ))}
            </div>
          </div>

          {/* 세부 카테고리 필터 */}
          <div className="max-w-full">
            <span className="text-sm font-medium text-white">
              세부 카테고리
            </span>
            <div className="flex flex-wrap gap-3 mt-2">
              {filterData.detailedCategories.map((category) => (
                <FilterRadioButton
                  key={category}
                  label={category}
                  isSelected={currentSelectedOptions.includes(category)}
                  onToggle={toggleOption}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-row items-center justify-center p-4 gap-10">
          <button
            className="flex items-center text-white text-sm hover:opacity-80 transition cursor-pointer"
            onClick={clearSelectedOptions}
          >
            <Image
              alt="reset"
              width={12}
              height={12}
              src="/icons/reset-icon.svg"
            />
            <span className="pl-2">초기화</span>
          </button>

          <button
            className="bg-primary-800 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-200 transition cursor-pointer"
            onClick={confirmBottomSheet}
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  );
};
