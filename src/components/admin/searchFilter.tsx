'use client';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search } from 'lucide-react';
import { CONTENT_CATEGORIES } from '@/constants';

interface SearchFilterProps {
  searchTerm: string;
  filterType: string;
  onSearchChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

export default function SearchFilter({
  searchTerm,
  filterType,
  onSearchChange,
  onFilterChange,
}: SearchFilterProps) {
  return (
    <div className="flex gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="콘텐츠 검색..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 border border-gray-300 focus:border-gray-500 focus:ring-0 text-black"
        />
      </div>
      <Select value={filterType} onValueChange={onFilterChange}>
        <SelectTrigger className="w-40 border border-gray-300 bg-white text-black cursor-pointer">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="border border-gray-300 bg-white">
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
