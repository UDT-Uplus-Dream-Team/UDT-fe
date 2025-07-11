import { FilterRadioButton } from '@components/explore/FilterRadioButton';
import { useExplorePageState } from '@hooks/useExplorePageState';
import { filterData } from '@lib/filterData';
import { OttCircleOption } from '@components/explore/OttCircleOption';

// 필터링 버튼 누를 시 표시되는 BottomSheet 콘텐츠의 내용
export const FilterBottomSheetContent = () => {
  const { currentSelectedOptions, toggleOption } = useExplorePageState();

  return (
    <>
      {/* 필터 옵션 영역 */}
      <div className="flex flex-col items-center justify-start w-full p-4 gap-5">
        {/* OTT 필터 (해당 구역은 스크롤이 발생해야 함) */}
        <div className="w-full">
          <span className="text-sm font-medium text-white">OTT</span>
          <div className="flex flex-nowrap gap-3 mt-2 overflow-x-auto scrollbar-hide">
            {filterData.ott.map((option) => (
              <OttCircleOption
                key={option}
                label={option}
                isSelected={currentSelectedOptions.includes(option)}
                onToggle={toggleOption}
              />
            ))}
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="w-full">
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
        <div className="w-full">
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
        <div className="w-full">
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
        <div className="w-full">
          <span className="text-sm font-medium text-white">세부 카테고리</span>
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
    </>
  );
};
