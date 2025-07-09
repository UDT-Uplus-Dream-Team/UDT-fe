import React from 'react';
import { Label } from '@components/ui/label';
import { FilterRadioButtonProps } from '@type/FilterRadioButtonProps';

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
    <div className="relative">
      <input
        type="radio"
        id={label}
        name="radio-group"
        value={label}
        checked={isSelected}
        onChange={handleClick}
        className="sr-only"
      />
      <Label
        htmlFor={label}
        className={`
          px-4 py-2 rounded-lg cursor-pointer transition-all
          ${
            isSelected
              ? 'bg-primary-500 text-white opacity-80'
              : 'bg-white text-gray-700 opacity-20 hover:opacity-60'
          }
        `}
      >
        {label}
      </Label>
    </div>
  );
};
