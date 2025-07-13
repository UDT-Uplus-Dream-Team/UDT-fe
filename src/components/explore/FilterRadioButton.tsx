import React from 'react';
import { Label } from '@components/ui/label';
import { FilterRadioButtonProps } from '@type/explore/Explore';

// 필터링 검색 때 사용하는 라디오 버튼 컴포넌트
export const FilterRadioButton = ({
  label,
  isSelected = false,
  onToggle,
}: FilterRadioButtonProps) => {
  const handleClick = () => {
    if (onToggle) {
      onToggle(label, !isSelected);
    }
  };

  return (
    <div className="flex-shrink-0">
      <input
        type="checkbox"
        id={label}
        value={label}
        checked={isSelected}
        onChange={handleClick}
        className="sr-only"
      />
      <Label
        htmlFor={label}
        className={`
          px-4 py-[10px] rounded-[8px] cursor-pointer transition-all whitespace-nowrap
          ${
            isSelected
              ? 'bg-primary-100/80 text-white'
              : 'bg-white/20 text-white hover:bg-white/60'
          }
        `}
      >
        {label}
      </Label>
    </div>
  );
};
