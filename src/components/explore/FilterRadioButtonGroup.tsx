import React, { useState } from 'react';
import { FilterRadioButton } from './FilterRadioButton';
import { FilterBottomSheetContent } from '@components/explore/FilterBottomSheetContent';
import { Sheet, SheetContent, SheetTrigger } from '@components/ui/sheet';
import Image from 'next/image';
import { useExplorePageState } from '@/hooks/useExplorePageState';

// FilterRadioButton을 모아두는 그룹 컴포넌트
export const FilterRadioButtonGroup = () => {
  const { filterOptions, selectedOptions, toggleOption } =
    useExplorePageState();
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false); // BottomSheet 열림 여부 상태 관리

  return (
    <div className="w-full">
      <div className="flex flex-row justify-start items-start gap-3 overflow-x-auto scrollbar-hide max-w-full overscroll-x-none">
        {/* 필터링 버튼 (누를 시 BottomSheet 표시) */}
        <Sheet open={isBottomSheetOpen} onOpenChange={setIsBottomSheetOpen}>
          <SheetTrigger asChild>
            <button className="flex-shrink-0 p-1 flex items-center justify-center w-fit h-auto bg-primary-300/80 rounded-[8px] border  hover:bg-gray-50 transition-colors">
              <Image
                src="/icons/tune-icon.svg"
                alt="필터"
                width={24}
                height={24}
              />
            </button>
          </SheetTrigger>

          {/* Sheet 콘텐츠 (해당 콘텐츠는 FilterBottomSheetContent 컴포넌트로 구현) */}
          <SheetContent side="bottom">
            <FilterBottomSheetContent
              onClose={() => setIsBottomSheetOpen(false)}
            />
          </SheetContent>
        </Sheet>

        {/* 필터 버튼 옆에는 각 옵션에 대한 라디오 버튼 표시 */}
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
  );
};
