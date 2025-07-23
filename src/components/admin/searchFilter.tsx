'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { CONTENT_CATEGORIES } from '@/constants';

interface SearchFilterProps {
  filterType: string;
  onFilterChange: (value: string) => void;
}

export default function SearchFilter({
  filterType,
  onFilterChange,
}: SearchFilterProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1"></div>
      <Select value={filterType} onValueChange={onFilterChange}>
        <SelectTrigger className="w-40 border border-gray-300 text-black cursor-pointer">
          <SelectValue placeholder="전체" />
        </SelectTrigger>
        <SelectContent className="border border-gray-300">
          <SelectItem
            value="all"
            className="text-black hover:bg-gray-100 cursor-pointer "
          >
            전체
          </SelectItem>
          {CONTENT_CATEGORIES.map((category) => (
            <SelectItem
              key={category}
              value={category}
              className="text-black hover:bg-gray-100 cursor-pointer"
            >
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
