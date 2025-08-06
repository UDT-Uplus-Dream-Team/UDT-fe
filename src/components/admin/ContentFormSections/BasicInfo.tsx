'use client';

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
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { RATING_OPTIONS } from '@/constants';
import Image from 'next/image';
import type { ContentWithoutId } from '@type/admin/Content';
import type { UseMutationResult } from '@tanstack/react-query';
import { useRef } from 'react';

interface BasicInfoProps {
  formData: ContentWithoutId;
  updateFormData: (
    updater: (prev: ContentWithoutId) => ContentWithoutId,
  ) => void;
  handleImageUpload: (
    files: FileList | null,
    imageType: 'poster' | 'backdrop',
  ) => Promise<void>;
  uploadImagesMutation: UseMutationResult<
    { data: { uploadedFileUrls: string[] } },
    Error,
    File[],
    unknown
  >;
}

export default function BasicInfo({
  formData,
  updateFormData,
  handleImageUpload,
  uploadImagesMutation,
}: BasicInfoProps) {
  const posterInputRef = useRef<HTMLInputElement>(null);
  const backdropInputRef = useRef<HTMLInputElement>(null);

  return (
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
                <SelectValue placeholder="관람등급 선택" />
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
            <Label htmlFor="posterUpload" className="mb-3">
              포스터 이미지
            </Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => posterInputRef.current?.click()}
                  disabled={uploadImagesMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {uploadImagesMutation.isPending
                    ? '업로드 중...'
                    : '이미지 선택'}
                </Button>
                {formData.posterUrl && (
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">업로드 완료</span>
                  </div>
                )}
              </div>
              <input
                ref={posterInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files, 'poster')}
                className="hidden"
              />
              {formData.posterUrl && (
                <div className="relative w-20 h-28 border rounded overflow-hidden">
                  <Image
                    src={formData.posterUrl}
                    alt="포스터 미리보기"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}
            </div>
          </div>
          <div>
            <Label htmlFor="backdropUpload" className="mb-3">
              배경 이미지
            </Label>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => backdropInputRef.current?.click()}
                  disabled={uploadImagesMutation.isPending}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {uploadImagesMutation.isPending
                    ? '업로드 중...'
                    : '이미지 선택'}
                </Button>
                {formData.backdropUrl && (
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">업로드 완료</span>
                  </div>
                )}
              </div>
              <input
                ref={backdropInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files, 'backdrop')}
                className="hidden"
              />
              {formData.backdropUrl && (
                <div className="relative w-32 h-20 border rounded overflow-hidden">
                  <Image
                    src={formData.backdropUrl}
                    alt="배경 이미지 미리보기"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>
              )}
            </div>
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
  );
}
