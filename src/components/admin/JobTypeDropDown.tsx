import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import { Button } from '@components/ui/button';
import { Filter, ChevronDown } from 'lucide-react';

interface JobTypeDropdownProps {
  options: string[];
  value: string;
  onChange: (val: string) => void;
}

// 표 오른쪽 상단에 있는 필터링 드롭다운 (관리자 페이지에서 사용하는 공통 컴포넌트)
export function JobTypeDropdown({
  options,
  value,
  onChange,
}: JobTypeDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2 bg-transparent">
          <Filter className="h-4 w-4" />
          {value}
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {options.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => onChange(option)}
            className={value === option ? 'bg-accent' : ''}
          >
            {option}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
