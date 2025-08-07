import { FilterRadioButton } from '@components/explore/FilterRadioButton';
import {
  CONTENT_CATEGORIES,
  PLATFORMS,
  GENRES,
  RATING_OPTIONS,
  COUNTRIES,
} from '@constants/FilterData';
import { OttCircleOption } from '@components/explore/OttCircleOption';
import { useExploreTempFilters } from '@hooks/useExplorePageState';

// 필터링 버튼 누를 시 표시되는 BottomSheet 콘텐츠의 내용
export const FilterBottomSheetContent = () => {
  const { tempFilters, toggleTempFilter } = useExploreTempFilters();

  // BottomSheet 내부에서 옵션을 토글할 때의 핸들러
  const handleToggle = (label: string) => {
    toggleTempFilter(label);
  };

  return (
    <>
      {/* 필터 옵션 영역 */}
      <div className="flex flex-col items-center justify-start w-full p-4 gap-5">
        {/* OTT 필터 (해당 구역은 스크롤이 발생해야 함) */}
        <div className="w-full">
          <span className="text-sm font-medium text-white">OTT</span>
          <div className="flex flex-nowrap gap-3 mt-2 overflow-x-auto scrollbar-hide">
            {PLATFORMS.map((option) => (
              <OttCircleOption
                key={option}
                label={option}
                isSelected={tempFilters.includes(option)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>

        {/* 카테고리 필터 */}
        <div className="w-full">
          <span className="text-sm font-medium text-white">카테고리</span>
          <div className="flex flex-wrap gap-3 mt-2">
            {CONTENT_CATEGORIES.map((option) => (
              <FilterRadioButton
                key={option}
                label={option}
                isSelected={tempFilters.includes(option)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>

        {/* 국가 필터 */}
        <div className="w-full">
          <span className="text-sm font-medium text-white">국가</span>
          <div className="flex flex-wrap gap-3 mt-2">
            {COUNTRIES.map((country) => (
              <FilterRadioButton
                key={country}
                label={country}
                isSelected={tempFilters.includes(country)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>

        {/* 등급 필터 */}
        <div className="w-full">
          <span className="text-sm font-medium text-white">등급</span>
          <div className="flex flex-wrap gap-3 mt-2">
            {RATING_OPTIONS.map((grade) => (
              <FilterRadioButton
                key={grade}
                label={grade}
                isSelected={tempFilters.includes(grade)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>

        {/* 세부 카테고리 필터 */}
        <div className="w-full">
          <span className="text-sm font-medium text-white">세부 카테고리</span>
          <div className="flex flex-wrap gap-3 mt-2">
            {GENRES.map((category) => (
              <FilterRadioButton
                key={category}
                label={category}
                isSelected={tempFilters.includes(category)}
                onToggle={handleToggle}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
