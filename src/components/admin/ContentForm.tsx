'use client';

import type React from 'react';

import { useCallback, useState } from 'react';

import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Textarea } from '@components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { Badge } from '@components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { X, Plus } from 'lucide-react';
import type {
  ContentWithoutId,
  ContentCreateUpdate,
  Cast,
  Platform,
  Director,
} from '@type/admin/Content';
import { PLATFORMS } from '@/lib/platforms';
import { showSimpleToast } from '@components/common/Toast';
import { useErrorToastOnce } from '@hooks/useErrorToastOnce';
import { RATING_OPTIONS, CONTENT_CATEGORIES, COUNTRIES } from '@/constants';
import { getGenresByCategory } from '@/lib/genres';
import Image from 'next/image';

interface ContentFormProps {
  content?: ContentWithoutId;
  onSave: (content: ContentCreateUpdate) => void;
  onCancel: () => void;
}

// 폼 데이터 초기값
const getInitialFormData = (content?: ContentWithoutId): ContentWithoutId => ({
  title: content?.title || '',
  description: content?.description || '',
  posterUrl: content?.posterUrl || '',
  backdropUrl: content?.backdropUrl || '',
  trailerUrl: content?.trailerUrl || '',
  openDate: content?.openDate || '',
  runningTime: content?.runningTime || 0,
  episode: content?.episode || 0,
  rating: content?.rating || '',
  categories: content?.categories || [{ categoryType: '영화', genres: [] }],
  countries: content?.countries || [],
  directors: content?.directors || [],
  casts: content?.casts || [],
  platforms: content?.platforms || [],
});

// ContentWithoutId를 ContentCreateUpdate로 변환하는 함수
const convertContentWithoutIdToContentCreateUpdate = (
  content: ContentWithoutId,
): ContentCreateUpdate => ({
  title: content.title,
  description: content.description,
  posterUrl: content.posterUrl,
  backdropUrl: content.backdropUrl,
  trailerUrl: content.trailerUrl,
  openDate: content.openDate,
  runningTime: content.runningTime,
  episode: content.episode,
  rating: content.rating,
  categories: content.categories,
  countries: content.countries,
  directors: content.directors.map((director) => director.directorId),
  casts: content.casts.map((cast) => cast.castId),
  platforms: content.platforms,
});

// 유효성 검사 함수
const validateFormData = (formData: ContentWithoutId): string | null => {
  // 제목 검증
  if (!formData.title.trim()) return '제목은 필수 항목입니다.';

  // 관람등급 검증
  if (!formData.rating || formData.rating.trim() === '') {
    return '관람등급은 필수 항목입니다.';
  }

  // 카테고리 검증
  if (
    !formData.categories[0]?.categoryType ||
    formData.categories[0].categoryType.trim() === ''
  ) {
    return '카테고리는 필수 항목입니다.';
  }

  // 장르 검증 (하나 이상 선택되어야 함)
  if (
    !formData.categories[0]?.genres ||
    formData.categories[0].genres.length === 0
  ) {
    return '장르는 하나 이상 선택해야 합니다.';
  }

  // 플랫폼 검증 (하나 이상 선택되어야 함)
  if (!formData.platforms || formData.platforms.length === 0) {
    return '플랫폼은 하나 이상 입력해야 합니다.';
  }

  // 플랫폼 타입이 허용된 플랫폼 중 하나인지 검증
  const allowedPlatformLabels = PLATFORMS.map((p) => p.label);
  for (const platform of formData.platforms) {
    if (!allowedPlatformLabels.includes(platform.platformType)) {
      return `플랫폼은 다음 중 하나여야 합니다: ${allowedPlatformLabels.join(
        ', ',
      )}`;
    }
  }

  return null;
};

export default function ContentForm({
  content,
  onSave,
  onCancel,
}: ContentFormProps) {
  const [formData, setFormData] = useState<ContentWithoutId>(() =>
    getInitialFormData(content),
  );
  const showErrorToast = useErrorToastOnce();

  // 입력 필드 상태
  const [newDirector, setNewDirector] = useState<Director>({
    directorId: 0,
    directorName: '',
    directorImageUrl: '',
  });
  const [newCast, setNewCast] = useState<Cast>({
    castId: 0,
    castName: '',
    castImageUrl: '',
  });
  const [newPlatform, setNewPlatform] = useState<Platform>({
    platformType: '',
    watchUrl: '',
  });

  // 폼 제출 핸들러
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errorMessage = validateFormData(formData);
    if (errorMessage) {
      showSimpleToast.error({ message: errorMessage });
      return;
    }

    // 날짜 형식 정규화
    let normalizedDate = formData.openDate;
    if (formData.openDate && formData.openDate.trim() !== '') {
      normalizedDate = formData.openDate.includes('T00:00:00')
        ? formData.openDate
        : formData.openDate + 'T00:00:00';
    }

    // ContentWithoutId를 ContentCreateUpdate로 변환하여 저장
    const contentToSave = convertContentWithoutIdToContentCreateUpdate({
      ...formData,
      openDate: normalizedDate,
    });

    onSave(contentToSave);
  };

  // 폼 데이터 업데이트 헬퍼 함수
  const updateFormData = useCallback(
    (updater: (prev: ContentWithoutId) => ContentWithoutId) => {
      setFormData(updater);
    },
    [],
  );

  // 장르 관리
  const addGenre = useCallback(
    (selectedGenre: string) => {
      if (!selectedGenre.trim()) return;

      updateFormData((prev) => {
        const currentGenres = prev.categories[0]?.genres || [];
        if (currentGenres.includes(selectedGenre)) return prev;

        const updatedCategories = prev.categories.map((cat, index) =>
          index === 0
            ? { ...cat, genres: [...cat.genres, selectedGenre] }
            : cat,
        );
        return { ...prev, categories: updatedCategories };
      });
    },
    [updateFormData],
  );

  const removeGenre = useCallback(
    (genreToRemove: string) => {
      updateFormData((prev) => {
        const updatedCategories = prev.categories.map((cat, index) =>
          index === 0
            ? { ...cat, genres: cat.genres.filter((g) => g !== genreToRemove) }
            : cat,
        );
        return { ...prev, categories: updatedCategories };
      });
    },
    [updateFormData],
  );

  // 국가 관리
  const addCountry = useCallback(
    (selected: string) => {
      updateFormData((prev) => {
        if (!prev.countries.includes(selected)) {
          return { ...prev, countries: [...prev.countries, selected] };
        }
        return prev;
      });
    },
    [updateFormData],
  );

  const removeCountry = useCallback(
    (countryToRemove: string) => {
      updateFormData((prev) => ({
        ...prev,
        countries: prev.countries.filter((c) => c !== countryToRemove),
      }));
    },
    [updateFormData],
  );

  // 감독 관리
  const addDirector = useCallback(() => {
    if (!newDirector.directorName.trim()) return;

    // 임시로 ID를 생성 (실제로는 API에서 받아와야 함)
    const directorId = Date.now();
    const newDirectorObj = {
      directorId,
      directorName: newDirector.directorName.trim(),
      directorImageUrl: newDirector.directorImageUrl.trim(),
    };

    updateFormData((prev) => {
      if (
        !prev.directors.some(
          (d) => d.directorName === newDirector.directorName.trim(),
        )
      ) {
        return {
          ...prev,
          directors: [...prev.directors, newDirectorObj],
        };
      }
      return prev;
    });
    setNewDirector({ directorId: 0, directorName: '', directorImageUrl: '' });
  }, [newDirector, updateFormData, showErrorToast]);

  const removeDirector = useCallback(
    (directorToRemove: string) => {
      updateFormData((prev) => ({
        ...prev,
        directors: prev.directors.filter(
          (d) => d.directorName !== directorToRemove,
        ),
      }));
    },
    [updateFormData],
  );

  // 출연진 관리
  const addCast = useCallback(() => {
    if (!newCast.castName.trim()) return;

    // 임시로 ID를 생성 (실제로는 API에서 받아와야 함)
    const castId = Date.now();
    const newCastObj = {
      castId,
      castName: newCast.castName.trim(),
      castImageUrl: newCast.castImageUrl.trim(),
    };

    updateFormData((prev) => ({ ...prev, casts: [...prev.casts, newCastObj] }));
    setNewCast({ castId: 0, castName: '', castImageUrl: '' });
  }, [newCast, updateFormData, showErrorToast]);

  const removeCast = useCallback(
    (castToRemove: string) => {
      updateFormData((prev) => ({
        ...prev,
        casts: prev.casts.filter((c) => c.castName !== castToRemove),
      }));
    },
    [updateFormData],
  );

  // 플랫폼 관리
  const addPlatform = useCallback(() => {
    if (!newPlatform.platformType.trim() || !newPlatform.watchUrl.trim()) {
      showErrorToast('플랫폼과 URL을 모두 입력해주세요');
      return;
    }

    // URL 유효성 검사
    try {
      new URL(newPlatform.watchUrl);
    } catch {
      showErrorToast('올바른 URL을 입력해주세요');
      return;
    }

    updateFormData((prev) => ({
      ...prev,
      platforms: [...prev.platforms, newPlatform],
    }));
    setNewPlatform({ platformType: '', watchUrl: '' });
  }, [newPlatform, updateFormData, showErrorToast]);

  const removePlatform = useCallback(
    (index: number) => {
      updateFormData((prev) => ({
        ...prev,
        platforms: prev.platforms.filter((_, i) => i !== index),
      }));
    },
    [updateFormData],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Tabs defaultValue="contentInfo" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contentInfo" className="cursor-pointer">
            콘텐츠 등록
          </TabsTrigger>
          <TabsTrigger value="platforms" className="cursor-pointer">
            인물 등록
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contentInfo" className="space-y-6 mt-3">
          {/* 기본 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="mt-5">기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title" className="mb-3">
                    제목 *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rating" className="mb-3">
                    관람등급 *
                  </Label>
                  <Select
                    value={formData.rating}
                    onValueChange={(value) =>
                      updateFormData((prev) => ({ ...prev, rating: value }))
                    }
                  >
                    <SelectTrigger className="cursor-pointer">
                      {formData.rating ? (
                        <span>{formData.rating}</span>
                      ) : (
                        <SelectValue placeholder="관람등급 선택" />
                      )}
                    </SelectTrigger>
                    <SelectContent>
                      {RATING_OPTIONS.map((rating) => (
                        <SelectItem
                          key={rating}
                          value={rating}
                          className="cursor-pointer"
                        >
                          {rating}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="mb-3">
                  줄거리
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="posterUrl" className="mb-3">
                    포스터 URL
                  </Label>
                  <Input
                    id="posterUrl"
                    value={formData.posterUrl}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        posterUrl: e.target.value,
                      }))
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="backdropUrl" className="mb-3">
                    배경 이미지 URL
                  </Label>
                  <Input
                    id="backdropUrl"
                    value={formData.backdropUrl}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        backdropUrl: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="trailerUrl" className="mb-3">
                  예고편 URL
                </Label>
                <Input
                  id="trailerUrl"
                  value={formData.trailerUrl}
                  onChange={(e) =>
                    updateFormData((prev) => ({
                      ...prev,
                      trailerUrl: e.target.value,
                    }))
                  }
                  className="mb-5"
                />
              </div>
            </CardContent>
          </Card>

          {/* 상세 정보 */}
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
                    value={formData.openDate?.split('T')[0] || ''}
                    onChange={(e) =>
                      updateFormData((prev) => ({
                        ...prev,
                        openDate: e.target.value,
                      }))
                    }
                    className="dark:bg-gray-700 dark:text-black"
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
                      const updatedCategories = [...prev.categories];
                      const currentGenres = updatedCategories[0]?.genres || [];
                      const newAvailableGenres = getGenresByCategory(value);

                      // 새로운 카테고리에서 허용되지 않는 장르 제거
                      const filteredGenres = currentGenres.filter((genre) =>
                        newAvailableGenres.includes(genre),
                      );

                      if (updatedCategories[0]) {
                        updatedCategories[0].categoryType = value;
                        updatedCategories[0].genres = filteredGenres;
                      } else {
                        updatedCategories[0] = {
                          categoryType: value,
                          genres: filteredGenres,
                        };
                      }
                      return { ...prev, categories: updatedCategories };
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
                    {(() => {
                      const selectedCategory =
                        formData.categories[0]?.categoryType || '';
                      const availableGenres =
                        getGenresByCategory(selectedCategory);

                      return availableGenres.map((genre) => {
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
                      });
                    })()}
                  </div>
                </div>
              )}

              <div>
                <Label className="mb-3">제작 국가</Label>
                <div className="flex flex-wrap gap-2 mb-5 ">
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
                          isSelected
                            ? removeCountry(country)
                            : addCountry(country)
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

          {/* 감독 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="mt-5">감독 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Input
                  value={newDirector.directorName}
                  onChange={(e) =>
                    setNewDirector({
                      ...newDirector,
                      directorName: e.target.value,
                    })
                  }
                  placeholder="감독 이름"
                />
                <Input
                  value={newDirector.directorImageUrl}
                  onChange={(e) =>
                    setNewDirector({
                      ...newDirector,
                      directorImageUrl: e.target.value,
                    })
                  }
                  placeholder="감독 이미지 URL"
                />
              </div>
              <Button
                type="button"
                onClick={addDirector}
                className="w-full cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                감독 추가
              </Button>
              <div className="space-y-2 mb-5">
                {formData.directors.map((director) => (
                  <div
                    key={director.directorId}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      {director.directorImageUrl && (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={
                              director.directorImageUrl || '/placeholder.svg'
                            }
                            alt={director.directorName || '감독 이미지'}
                            fill
                            unoptimized
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        </div>
                      )}
                      <span>{director.directorName}</span>
                    </div>
                    <Button
                      type="button"
                      className="cursor-pointer"
                      size="sm"
                      onClick={() => removeDirector(director.directorName)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 출연진 정보 */}
          <Card>
            <CardHeader>
              <CardTitle className="mt-5">출연진 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Input
                  value={newCast.castName}
                  onChange={(e) =>
                    setNewCast({ ...newCast, castName: e.target.value })
                  }
                  placeholder="배우 이름"
                />
                <Input
                  value={newCast.castImageUrl}
                  onChange={(e) =>
                    setNewCast({ ...newCast, castImageUrl: e.target.value })
                  }
                  placeholder="배우 이미지 URL"
                />
              </div>
              <Button
                type="button"
                onClick={addCast}
                className="w-full cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                출연진 추가
              </Button>
              <div className="space-y-2 mb-5">
                {formData.casts.map((cast) => (
                  <div
                    key={cast.castId}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      {cast.castImageUrl && (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={cast.castImageUrl || '/placeholder.svg'}
                            alt={cast.castName || '출연진 이미지'}
                            fill
                            unoptimized
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        </div>
                      )}
                      <span>{cast.castName}</span>
                    </div>
                    <Button
                      type="button"
                      className="cursor-pointer"
                      size="sm"
                      onClick={() => removeCast(cast.castName)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 시청 플랫폼 */}
          <Card>
            <CardHeader>
              <CardTitle className="mt-5">시청 플랫폼 *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 mb-5">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Select
                  value={newPlatform.platformType}
                  onValueChange={(value) =>
                    setNewPlatform({
                      ...newPlatform,
                      platformType: value,
                    })
                  }
                >
                  <SelectTrigger className="cursor-pointer">
                    <SelectValue placeholder="플랫폼 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((platform) => (
                      <SelectItem
                        key={platform.id}
                        value={platform.label}
                        className="cursor-pointer"
                      >
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={newPlatform.watchUrl}
                  onChange={(e) =>
                    setNewPlatform({ ...newPlatform, watchUrl: e.target.value })
                  }
                  placeholder="시청 URL"
                />
              </div>
              <div className="flex items-center space-x-2 mb-3"></div>
              <Button
                type="button"
                onClick={addPlatform}
                className="w-full mb-10 cursor-pointer"
              >
                <Plus className="h-4 w-4 mr-2" />
                플랫폼 추가
              </Button>
              <div className="space-y-2">
                {formData.platforms.map((platform, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div>
                      <div className="font-medium">{platform.platformType}</div>
                      <div className="text-sm text-gray-500">
                        {platform.watchUrl}
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      className="cursor-pointer"
                      size="sm"
                      onClick={() => removePlatform(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6 mt-3">
          {/* 추가 인물 등록 탭은 현재 비어있음 */}
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="cursor-pointer"
        >
          취소
        </Button>
        <Button type="submit" className="cursor-pointer">
          {content ? '수정' : '추가'}
        </Button>
      </div>
    </form>
  );
}
