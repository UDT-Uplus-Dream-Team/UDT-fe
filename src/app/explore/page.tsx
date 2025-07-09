'use client';

import { useState } from 'react';
import { FilterRadioButton } from '@/components/explore/FilterRadioButton';
import { PosterCard } from '@/components/explore/PosterCard';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@components/ui/card';

// 탐색 페이지
export default function ExplorePage() {
  const [selectedOptions, setSelectedOptions] = useState<Set<string>>(
    new Set(),
  ); // 선택된 옵션들을 저장하는 state

  const options = ['옵션 1', '옵션 2', '옵션 3']; // 라디오 버튼 옵션들

  // 라디오 버튼 토글 함수
  const handleOptionToggle = (label: string, isSelected: boolean) => {
    const newSelected = new Set(selectedOptions);
    if (isSelected) {
      newSelected.add(label);
    } else {
      newSelected.delete(label);
    }
    setSelectedOptions(newSelected);
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* 기본 RadioButton 테스트 */}
      <Card>
        <CardHeader>
          <CardTitle>기본 RadioButton 테스트</CardTitle>
          <CardDescription>여러 개 선택 가능한 토글 버튼</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {options.map((option) => (
              <FilterRadioButton
                key={option}
                label={option}
                isSelected={selectedOptions.has(option)}
                onToggle={handleOptionToggle}
              />
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            선택된 옵션: {Array.from(selectedOptions).join(', ') || '없음'}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>기본 포스터 카드 테스트</CardTitle>
          <CardDescription>
            포스터 카드 클릭하면 상세정보 뜨게 할 겁니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3">
            <PosterCard
              title="귀를 기울이면"
              image="/images/poster1.webp"
              onClick={() => {}}
            />
            <PosterCard
              title="고양이의 보은"
              image="/images/poster2.webp"
              onClick={() => {}}
            />
            <PosterCard
              title="벼랑 위의 포뇨"
              image="/images/poster3.webp"
              isTitleVisible={false}
              onClick={() => {}}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
