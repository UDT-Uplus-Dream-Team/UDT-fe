'use client';

import type React from 'react';

import { useCallback, useState } from 'react';

import { Button } from '@components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import type {
  ContentWithoutId,
  ContentCreateUpdate,
  PlatformInfo,
} from '@type/admin/Content';
import { showSimpleToast } from '@components/common/Toast';
import { useErrorToastOnce } from '@hooks/useErrorToastOnce';
import { usePostUploadImages } from '@hooks/admin/usePostUploadImages';
import ActorSearchDialog from '@components/admin/dialogs/actorSearchDialog';
import DirectorSearchDialog from '@components/admin/dialogs/directorSearchDialog';

// 분리된 컴포넌트들 import
import BasicInfo from '@components/admin/ContentFormSections/BasicInfo';
import DetailedInfo from '@components/admin/ContentFormSections/DetailedInfo';
import DirectorInfo from '@components/admin/ContentFormSections/DirectorInfo';
import CastInfo from '@components/admin/ContentFormSections/CastInfo';
import PlatformSection from '@components/admin/ContentFormSections/PlatformInfo';
import BulkPersonRegistration from '@components/admin/bulkPersonRegistration';

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

  const [isActorSearchOpen, setIsActorSearchOpen] = useState(false);
  const [isDirectorSearchOpen, setIsDirectorSearchOpen] = useState(false);

  const [newPlatform, setNewPlatform] = useState<PlatformInfo>({
    platformType: '',
    watchUrl: '',
  });

  // 이미지 업로드 훅
  const uploadImagesMutation = usePostUploadImages();

  // 이미지 업로드 핸들러
  const handleImageUpload = async (
    files: FileList | null,
    imageType: 'poster' | 'backdrop',
  ) => {
    if (!files || files.length === 0) return;

    try {
      const fileArray = Array.from(files);
      const response = await uploadImagesMutation.mutateAsync(fileArray);

      if (response.data.uploadedFileUrls.length > 0) {
        const uploadedUrl = response.data.uploadedFileUrls[0];
        updateFormData((prev) => ({
          ...prev,
          [imageType === 'poster' ? 'posterUrl' : 'backdropUrl']: uploadedUrl,
        }));
      }
    } catch {
      showSimpleToast.error({ message: '이미지 업로드에 실패했습니다.' });
    }
  };

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

  const removeDirector = useCallback(
    (directorIdToRemove: number) => {
      updateFormData((prev) => ({
        ...prev,
        directors: prev.directors.filter(
          (d) => d.directorId !== directorIdToRemove,
        ),
      }));
    },
    [updateFormData],
  );

  const removeCast = useCallback(
    (castIdToRemove: number) => {
      updateFormData((prev) => ({
        ...prev,
        casts: prev.casts.filter((c) => c.castId !== castIdToRemove),
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
          <TabsTrigger value="personRegistration" className="cursor-pointer">
            인물 등록
          </TabsTrigger>
        </TabsList>

        <TabsContent value="contentInfo" className="space-y-6 mt-3">
          {/* 기본 정보 */}
          <BasicInfo
            formData={formData}
            updateFormData={updateFormData}
            handleImageUpload={handleImageUpload}
            uploadImagesMutation={uploadImagesMutation}
          />

          {/* 상세 정보 */}
          <DetailedInfo
            formData={formData}
            updateFormData={updateFormData}
            addGenre={addGenre}
            removeGenre={removeGenre}
            addCountry={addCountry}
            removeCountry={removeCountry}
          />

          {/* 감독 정보 */}
          <DirectorInfo
            formData={formData}
            setIsDirectorSearchOpen={setIsDirectorSearchOpen}
            removeDirector={removeDirector}
          />

          {/* 출연진 정보 */}
          <CastInfo
            formData={formData}
            setIsActorSearchOpen={setIsActorSearchOpen}
            removeCast={removeCast}
          />

          {/* 시청 플랫폼 */}
          <PlatformSection
            formData={formData}
            newPlatform={newPlatform}
            setNewPlatform={setNewPlatform}
            addPlatform={addPlatform}
            removePlatform={removePlatform}
          />

          {/* 배우 검색 다이얼로그 */}
          <ActorSearchDialog
            open={isActorSearchOpen}
            onOpenChange={setIsActorSearchOpen}
            onSelectCasts={(casts) => {
              setFormData({
                ...formData,
                casts: [...formData.casts, ...casts],
              });
            }}
            existingCasts={formData.casts}
          />

          {/* 감독 검색 다이얼로그 */}
          <DirectorSearchDialog
            open={isDirectorSearchOpen}
            onOpenChange={setIsDirectorSearchOpen}
            onSelectDirectors={(directors) => {
              setFormData({
                ...formData,
                directors: [...formData.directors, ...directors],
              });
            }}
            existingDirectors={formData.directors}
          />

          {/* 취소/수정 버튼 */}
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
        </TabsContent>

        <TabsContent value="personRegistration" className="space-y-6 mt-3">
          <BulkPersonRegistration />
        </TabsContent>
      </Tabs>
    </form>
  );
}
