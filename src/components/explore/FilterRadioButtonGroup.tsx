import { FilterRadioButton } from './FilterRadioButton';
import { FilterBottomSheetContent } from '@components/explore/FilterBottomSheetContent';
import { Sheet, SheetContent, SheetTrigger } from '@components/ui/sheet';
import Image from 'next/image';
import { useExplorePageState } from '@hooks/useExplorePageState';

// FilterRadioButton을 모아두는 그룹 컴포넌트
export const FilterRadioButtonGroup = () => {
  const {
    clearSelectedOptions,
    confirmBottomSheet,
    displayedOptionsInTop, // 모든 표시될 옵션들 (기본 + 선택된 옵션들)
    currentSelectedOptions, // 실제 적용된 옵션들만 표시
    toggleOption,
    isBottomSheetOpen,
    openBottomSheet,
    closeBottomSheet,
  } = useExplorePageState();

  return (
    <div className="w-full">
      <div className="flex flex-row justify-start items-center gap-3 overflow-x-auto scrollbar-hide max-w-full overscroll-x-none px-6">
        {/* 필터링 버튼 (누를 시 BottomSheet 표시) */}
        <Sheet
          open={isBottomSheetOpen}
          onOpenChange={(open) => {
            if (open) {
              openBottomSheet();
            } else {
              closeBottomSheet(); // X 버튼이나 외부 클릭 시 취소되는 action
            }
          }}
        >
          <SheetTrigger asChild>
            <button className="flex-shrink-0 p-1 flex items-center justify-center w-fit h-auto bg-primary-300/80 rounded-[8px] hover:bg-gray-50 transition-colors">
              <Image
                src="/icons/tune-icon.svg"
                alt="필터"
                width={24}
                height={24}
              />
            </button>
          </SheetTrigger>

          {/* Sheet 콘텐츠 (해당 콘텐츠는 FilterBottomSheetContent 컴포넌트로 구현) */}
          <SheetContent
            side="bottom"
            className="flex flex-col gap-0 h-[60vh] max-h-[60vh] bg-[#07033E] border-t-0 rounded-t-[20px]"
          >
            {/* 헤더 영역 */}
            <div className="flex items-center justify-center p-4">
              <span className="text-xl font-semibold text-white">필터</span>
            </div>

            {/* 스크롤 가능한 메인 콘텐츠 영역 */}
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              <FilterBottomSheetContent />
            </div>

            {/* 하단 고정 버튼 영역 */}
            <div className="flex flex-row items-center justify-center p-4 gap-12">
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
          </SheetContent>
        </Sheet>

        {/* 필터 버튼 옆에는 각 옵션에 대한 라디오 버튼 표시 */}
        {displayedOptionsInTop.map((option) => (
          <FilterRadioButton
            key={option}
            label={option}
            isSelected={currentSelectedOptions.includes(option)}
            onToggle={toggleOption}
          />
        ))}
      </div>
    </div>
  );
};
