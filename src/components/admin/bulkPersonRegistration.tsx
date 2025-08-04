'use client';

import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Badge } from '@components/ui/badge';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { X, Plus, Upload, Users, Loader2 } from 'lucide-react';
import { usePostUploadImages } from '@hooks/admin/usePostUploadImages';
import { usePostAdminCasts } from '@hooks/admin/usePostCasts';
import { usePostAdminDirectors } from '@hooks/admin/usePostDirectors';
import { Cast, Director } from '@type/admin/Content';

import Image from 'next/image';
import { showSimpleToast } from '@components/common/Toast';

interface PersonData {
  id: string;
  name: string;
  role: 'cast' | 'director';
  profileImageFile: File | null;
  profileImageUrl: string;
}

export default function BulkPersonRegistration() {
  const [persons, setPersons] = useState<PersonData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [nextId, setNextId] = useState(0);

  // blob URL cleanup
  useEffect(() => {
    return () => {
      persons.forEach((person) => {
        if (
          person.profileImageUrl &&
          person.profileImageUrl.startsWith('blob:')
        ) {
          URL.revokeObjectURL(person.profileImageUrl);
        }
      });
    };
  }, [persons]);

  // 훅들
  const uploadImagesMutation = usePostUploadImages();
  const postCastsMutation = usePostAdminCasts();
  const postDirectorsMutation = usePostAdminDirectors();

  const addNewPerson = () => {
    const newPerson: PersonData = {
      id: nextId.toString(),
      name: '',
      role: 'cast',
      profileImageFile: null,
      profileImageUrl: '',
    };
    setPersons([...persons, newPerson]);
    setNextId(nextId + 1);
  };

  const removePerson = (id: string) => {
    setPersons(persons.filter((person) => person.id !== id));
  };

  const updatePerson = (
    id: string,
    field: keyof PersonData,
    value: string | File | null,
  ) => {
    setPersons(
      persons.map((person) =>
        person.id === id
          ? {
              ...person,
              [field]: value,
            }
          : person,
      ),
    );
  };

  const handleImageUpload = (
    id: string,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      // 기존 blob URL 정리
      const currentPerson = persons.find((p) => p.id === id);
      if (
        currentPerson?.profileImageUrl &&
        currentPerson.profileImageUrl.startsWith('blob:')
      ) {
        URL.revokeObjectURL(currentPerson.profileImageUrl);
      }

      // 로컬 미리보기용 URL 생성
      const previewUrl = URL.createObjectURL(file);

      // 한 번에 모든 필드 업데이트
      setPersons(
        persons.map((person) =>
          person.id === id
            ? {
                ...person,
                profileImageFile: file,
                profileImageUrl: previewUrl,
              }
            : person,
        ),
      );
    }
  };

  const validatePersons = () => {
    const errors: string[] = [];
    persons.forEach((person, index) => {
      if (!person.name.trim()) {
        errors.push(`${index + 1}번째 인물의 이름이 필요합니다.`);
      }
    });
    return errors;
  };

  const handleBulkRegistration = async () => {
    const validationErrors = validatePersons();
    if (validationErrors.length > 0) {
      return;
    }

    setIsLoading(true);

    try {
      // 배우와 감독을 분리
      const casts = persons.filter((person) => person.role === 'cast');
      const directors = persons.filter((person) => person.role === 'director');

      // 이미지 업로드 처리 - id와 함께 관리
      const imageUploadMap = new Map<string, Promise<string>>();

      // 배우 이미지 업로드
      casts.forEach((cast) => {
        if (cast.profileImageFile) {
          const uploadPromise = uploadImagesMutation
            .mutateAsync([cast.profileImageFile])
            .then((response) => response.data.uploadedFileUrls[0]);
          imageUploadMap.set(cast.id, uploadPromise);
        } else {
          imageUploadMap.set(cast.id, Promise.resolve(cast.profileImageUrl));
        }
      });

      // 감독 이미지 업로드
      directors.forEach((director) => {
        if (director.profileImageFile) {
          const uploadPromise = uploadImagesMutation
            .mutateAsync([director.profileImageFile])
            .then((response) => response.data.uploadedFileUrls[0]);
          imageUploadMap.set(director.id, uploadPromise);
        } else {
          imageUploadMap.set(
            director.id,
            Promise.resolve(director.profileImageUrl),
          );
        }
      });

      // 모든 이미지 업로드 완료 대기
      const uploadedImageUrls = await Promise.all(imageUploadMap.values());
      const imageUrlMap = new Map<string, string>();

      // id와 업로드된 URL을 매핑
      const personIds = Array.from(imageUploadMap.keys());
      personIds.forEach((id, index) => {
        imageUrlMap.set(id, uploadedImageUrls[index]);
      });

      // 배우 등록
      if (casts.length > 0) {
        const castData = {
          casts: casts.map((cast) => {
            // 이미지 파일이 있는 경우에만 업로드된 URL 사용, 없으면 빈 문자열
            const imageUrl = cast.profileImageFile
              ? imageUrlMap.get(cast.id) || ''
              : '';
            return {
              castName: cast.name,
              castImageUrl: imageUrl,
            } as Omit<Cast, 'castId'>;
          }),
        };
        await postCastsMutation.mutateAsync(castData);
      }

      // 감독 등록
      if (directors.length > 0) {
        const directorData = {
          directors: directors.map((director) => {
            // 이미지 파일이 있는 경우에만 업로드된 URL 사용, 없으면 빈 문자열
            const imageUrl = director.profileImageFile
              ? imageUrlMap.get(director.id) || ''
              : '';
            return {
              directorName: director.name,
              directorImageUrl: imageUrl,
            } as Omit<Director, 'directorId'>;
          }),
        };
        await postDirectorsMutation.mutateAsync(directorData);
      }

      // 폼 초기화
      setPersons([]);

      showSimpleToast.success({ message: '인물 등록이 완료되었습니다.' });
    } catch {
      showSimpleToast.error({
        message: '인물 등록에 실패했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">인물 다량 등록</h3>
          <p className="text-sm text-gray-600">
            여러 명의 배우와 감독을 한 번에 등록할 수 있습니다.
          </p>
        </div>
        <Button type="button" onClick={addNewPerson} disabled={isLoading}>
          <Plus className="h-4 w-4 mr-2" />
          인물 추가
        </Button>
      </div>

      {/* 인물 목록 */}
      <div className="space-y-4">
        {persons.map((person, index) => (
          <Card key={person.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">
                  {index + 1}번째 인물
                  {person.name && (
                    <Badge variant="outline" className="ml-2">
                      {person.name}
                    </Badge>
                  )}
                  <Badge
                    variant={person.role === 'cast' ? 'default' : 'secondary'}
                    className="ml-2"
                  >
                    {person.role === 'cast' ? '배우' : '감독'}
                  </Badge>
                </CardTitle>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removePerson(person.id)}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>이름 *</Label>
                  <Input
                    value={person.name}
                    onChange={(e) =>
                      updatePerson(person.id, 'name', e.target.value)
                    }
                    placeholder="이름 입력"
                    disabled={isLoading}
                  />
                </div>
                <div className="space-y-2">
                  <Label>역할</Label>
                  <Select
                    value={person.role}
                    onValueChange={(value) =>
                      updatePerson(person.id, 'role', value)
                    }
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cast">배우</SelectItem>
                      <SelectItem value="director">감독</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>프로필 이미지</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(person.id, e)}
                      className="hidden"
                      id={`image-upload-${person.id}`}
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document
                          .getElementById(`image-upload-${person.id}`)
                          ?.click()
                      }
                      className="flex-1"
                      disabled={isLoading}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      이미지 업로드
                    </Button>
                  </div>
                  {person.profileImageUrl && (
                    <div className="mt-2 mb-2">
                      <Image
                        src={person.profileImageUrl || '/placeholder.svg'}
                        alt="미리보기"
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 등록 버튼 */}
      {persons.length > 0 && (
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => setPersons([])}
            disabled={isLoading}
          >
            전체 초기화
          </Button>
          <Button
            type="button"
            onClick={handleBulkRegistration}
            disabled={
              isLoading ||
              persons.length === 0 ||
              uploadImagesMutation.isPending ||
              postCastsMutation.isPending ||
              postDirectorsMutation.isPending
            }
          >
            {isLoading ||
            uploadImagesMutation.isPending ||
            postCastsMutation.isPending ||
            postDirectorsMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                등록 중...
              </>
            ) : (
              `${persons.length}명 일괄 등록`
            )}
          </Button>
        </div>
      )}

      {persons.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
          <p>등록할 인물을 추가해주세요.</p>
          <p className="text-sm">
            배우와 감독을 한 번에 여러 명 등록할 수 있습니다.
          </p>
        </div>
      )}
    </div>
  );
}
