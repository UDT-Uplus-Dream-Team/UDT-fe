'use client';

import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { Badge } from '@components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { CONTENT_CATEGORIES, COUNTRIES } from '@/constants';
import { getGenresByCategory } from '@lib/genres';
import type { ContentWithoutId } from '@type/admin/Content';

interface DetailedInfoProps {
  formData: ContentWithoutId;
  updateFormData: (
    updater: (prev: ContentWithoutId) => ContentWithoutId,
  ) => void;
  addGenre: (selectedGenre: string) => void;
  removeGenre: (genreToRemove: string) => void;
  addCountry: (selected: string) => void;
  removeCountry: (countryToRemove: string) => void;
}

export default function DetailedInfo({
  formData,
  updateFormData,
  addGenre,
  removeGenre,
  addCountry,
  removeCountry,
}: DetailedInfoProps) {
  const selectedCategory = formData.categories[0]?.categoryType || '';
  const availableGenres = getGenresByCategory(selectedCategory);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="mt-5">상세 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="openDate" className="mb-3">
              개봉일
            </Label>
            <Input
              id="openDate"
              type="date"
              value={
                formData.openDate?.includes('T')
                  ? formData.openDate.split('T')[0]
                  : formData.openDate || ''
              }
              onChange={(e) =>
                updateFormData((prev) => ({
                  ...prev,
                  openDate: e.target.value,
                }))
              }
              className="dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <Label htmlFor="runningTime" className="mb-3">
              상영시간 (분)
            </Label>
            <Input
              id="runningTime"
              type="number"
              min="0"
              value={formData.runningTime}
              onChange={(e) =>
                updateFormData((prev) => ({
                  ...prev,
                  runningTime: Number(e.target.value) || 0,
                }))
              }
            />
          </div>
          <div>
            <Label htmlFor="episode" className="mb-3">
              에피소드
            </Label>
            <Input
              id="episode"
              type="number"
              min="0"
              value={formData.episode}
              onChange={(e) =>
                updateFormData((prev) => ({
                  ...prev,
                  episode: Number(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>

        <div>
          <Label htmlFor="category" className="mb-3">
            카테고리 *
          </Label>
          <Select
            value={formData.categories[0]?.categoryType || ''}
            onValueChange={(value) => {
              updateFormData((prev) => {
                return {
                  ...prev,
                  categories: [
                    {
                      categoryType: value,
                      genres: [],
                    },
                  ],
                };
              });
            }}
          >
            <SelectTrigger className="cursor-pointer">
              <SelectValue placeholder="카테고리 선택" />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_CATEGORIES.map((category) => (
                <SelectItem
                  key={category}
                  value={category}
                  className="cursor-pointer"
                >
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.categories[0]?.categoryType && (
          <div>
            <Label className="mb-3">장르 *</Label>
            <div className="flex flex-wrap gap-2 max-w-full">
              {availableGenres.map((genre) => {
                const isSelected =
                  formData.categories[0]?.genres.includes(genre);

                return (
                  <Badge
                    key={genre}
                    variant={isSelected ? 'default' : 'secondary'}
                    className={`cursor-pointer select-none ${
                      isSelected ? 'bg-blue-600 text-white' : ''
                    }`}
                    onClick={() =>
                      isSelected ? removeGenre(genre) : addGenre(genre)
                    }
                  >
                    {genre}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <Label className="mb-3">제작 국가</Label>
          <div className="flex flex-wrap gap-2 mb-5">
            {COUNTRIES.map((country) => {
              const isSelected = formData.countries.includes(country);

              return (
                <Badge
                  key={country}
                  variant={isSelected ? 'default' : 'secondary'}
                  className={`cursor-pointer select-none ${
                    isSelected ? 'bg-green-600 text-white' : ''
                  }`}
                  onClick={() =>
                    isSelected ? removeCountry(country) : addCountry(country)
                  }
                >
                  {country}
                </Badge>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
