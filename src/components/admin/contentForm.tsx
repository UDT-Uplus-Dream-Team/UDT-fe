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
import type { ContentWithoutId } from '@type/admin/Content';
import {
  RATING_OPTIONS,
  CONTENT_CATEGORIES,
  GENRES,
  COUNTRIES,
} from '@/constants';
import Image from 'next/image';

interface ContentFormProps {
  content?: ContentWithoutId;
  onSave: (content: ContentWithoutId) => void;
  onCancel: () => void;
}

export default function ContentForm({
  content,
  onSave,
  onCancel,
}: ContentFormProps) {
  const [formData, setFormData] = useState<ContentWithoutId>(() => ({
    title: content?.title || '',
    description: content?.description || '',
    posterUrl: content?.posterUrl || '',
    backdropUrl: content?.backdropUrl || '',
    trailerUrl: content?.trailerUrl || '',
    openDate: content?.openDate || '',
    runningTime: content?.runningTime || 0,
    episode: content?.episode || 1,
    rating: content?.rating || '',
    categories: content?.categories || [{ categoryType: '영화', genres: [] }],
    countries: content?.countries || [],
    directors: content?.directors || [],
    casts: content?.casts || [],
    platforms: content?.platforms || [],
  }));

  const [newDirector, setNewDirector] = useState('');
  const [newCast, setNewCast] = useState({ castName: '', castImageUrl: '' });
  const [newPlatform, setNewPlatform] = useState({
    platformType: '',
    watchUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { title, rating, openDate, runningTime, categories } = formData;

    // 필수 항목 검사
    if (!title.trim()) return alert('제목은 필수 항목입니다.');
    if (!rating.trim()) return alert('관람등급은 필수 항목입니다.');
    if (!openDate.trim()) return alert('개봉일은 필수 항목입니다.');
    if (!runningTime || runningTime <= 0)
      return alert('상영시간을 입력해주세요.');
    if (!categories.length || !categories[0].categoryType.trim())
      return alert('카테고리는 필수 항목입니다.');

    if (content) {
      onSave({ ...formData });
    } else {
      onSave(formData);
    }
  };

  const addGenre = useCallback((selectedGenre: string) => {
    if (!selectedGenre.trim()) return;

    setFormData((prev) => {
      const currentGenres = prev.categories[0]?.genres || [];
      if (currentGenres.includes(selectedGenre)) return prev;
      const updatedCategories = prev.categories.map((cat, index) =>
        index === 0 ? { ...cat, genres: [...cat.genres, selectedGenre] } : cat,
      );
      return { ...prev, categories: updatedCategories };
    });
  }, []);

  const removeGenre = useCallback((genreToRemove: string) => {
    setFormData((prev) => {
      const updatedCategories = prev.categories.map((cat, index) =>
        index === 0
          ? { ...cat, genres: cat.genres.filter((g) => g !== genreToRemove) }
          : cat,
      );
      return { ...prev, categories: updatedCategories };
    });
  }, []);

  const addCountry = useCallback((selected: string) => {
    setFormData((prev) => {
      if (!prev.countries.includes(selected)) {
        return { ...prev, countries: [...prev.countries, selected] };
      }
      return prev;
    });
  }, []);

  const removeCountry = useCallback((countryToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      countries: prev.countries.filter((c) => c !== countryToRemove),
    }));
  }, []);

  const addDirector = useCallback(() => {
    setFormData((prev) => {
      if (newDirector.trim() && !prev.directors.includes(newDirector.trim())) {
        return {
          ...prev,
          directors: [...prev.directors, newDirector.trim()],
        };
      }
      return prev;
    });
    setNewDirector('');
  }, [newDirector]);

  const removeDirector = useCallback((directorToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      directors: prev.directors.filter((d) => d !== directorToRemove),
    }));
  }, []);

  const addCast = useCallback(() => {
    if (newCast.castName.trim()) {
      setFormData((prev) => ({ ...prev, casts: [...prev.casts, newCast] }));
      setNewCast({ castName: '', castImageUrl: '' });
    }
  }, [newCast]);

  const removeCast = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      casts: prev.casts.filter((_, i) => i !== index),
    }));
  }, []);

  const addPlatform = useCallback(() => {
    if (newPlatform.platformType.trim() && newPlatform.watchUrl.trim()) {
      setFormData((prev) => ({
        ...prev,
        platforms: [...prev.platforms, newPlatform],
      }));
      setNewPlatform({ platformType: '', watchUrl: '' });
    }
  }, [newPlatform]);

  const removePlatform = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      platforms: prev.platforms.filter((_, i) => i !== index),
    }));
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="cursor-pointer">
            기본 정보
          </TabsTrigger>
          <TabsTrigger value="details" className="cursor-pointer">
            상세 정보
          </TabsTrigger>
          <TabsTrigger value="people" className="cursor-pointer">
            인물 정보
          </TabsTrigger>
          <TabsTrigger value="platforms" className="cursor-pointer">
            플랫폼
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
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
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="rating" className="mb-3">
                    관람등급
                  </Label>
                  <Select
                    value={formData.rating}
                    onValueChange={(value) =>
                      setFormData({ ...formData, rating: value })
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
                    setFormData({ ...formData, description: e.target.value })
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
                      setFormData({ ...formData, posterUrl: e.target.value })
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
                      setFormData({ ...formData, backdropUrl: e.target.value })
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
                    setFormData({ ...formData, trailerUrl: e.target.value })
                  }
                  className="mb-5"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
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
                    value={formData.openDate}
                    onChange={(e) =>
                      setFormData({ ...formData, openDate: e.target.value })
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
                    value={formData.runningTime}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        runningTime: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="episode" className="mb-3">
                    에피소드
                  </Label>
                  <Input
                    id="episode"
                    value={formData.episode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        episode: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="category" className="mb-3">
                  카테고리
                </Label>
                <Select
                  value={formData.categories[0]?.categoryType || ''}
                  onValueChange={(value) => {
                    const updatedCategories = [...formData.categories];
                    if (updatedCategories[0]) {
                      updatedCategories[0].categoryType = value;
                    } else {
                      updatedCategories[0] = {
                        categoryType: value,
                        genres: [],
                      };
                    }
                    setFormData({ ...formData, categories: updatedCategories });
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

              <div>
                <Label className="mb-3">장르</Label>
                <div className="flex flex-wrap gap-2 max-w-full">
                  {GENRES.map((genre) => {
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
        </TabsContent>

        <TabsContent value="people" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="mt-5">감독 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-3">
                <Input
                  value={newDirector}
                  onChange={(e) => setNewDirector(e.target.value)}
                  placeholder="감독 이름 입력"
                  onKeyDown={(e) =>
                    e.key === 'Enter' && (e.preventDefault(), addDirector())
                  }
                />
                <Button
                  type="button"
                  onClick={addDirector}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.directors.map((director) => (
                  <Badge
                    key={director}
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    {director}
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-4 w-4 p-0 cursor-pointer"
                      onClick={() => removeDirector(director)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

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
                {formData.casts.map((cast, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 border rounded"
                  >
                    <div className="flex items-center gap-2">
                      {cast.castImageUrl && (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                          <Image
                            src={cast.castImageUrl || '/placeholder.svg'}
                            alt={cast.castName || '출연진 이미지'}
                            fill
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
                      onClick={() => removeCast(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="mt-5">시청 플랫폼</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 mb-5">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <Input
                  value={newPlatform.platformType}
                  onChange={(e) =>
                    setNewPlatform({
                      ...newPlatform,
                      platformType: e.target.value,
                    })
                  }
                  placeholder="플랫폼 이름 (예: 넷플릭스)"
                />
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
