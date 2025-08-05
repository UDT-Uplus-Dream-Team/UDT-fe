'use client';

import { Button } from '@components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';
import type { ContentWithoutId } from '@type/admin/Content';

interface DirectorInfoProps {
  formData: ContentWithoutId;
  setIsDirectorSearchOpen: (open: boolean) => void;
  removeDirector: (directorIdToRemove: number) => void;
}

export default function DirectorInfo({
  formData,
  setIsDirectorSearchOpen,
  removeDirector,
}: DirectorInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="mt-5">감독 정보</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          type="button"
          onClick={() => setIsDirectorSearchOpen(true)}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          감독 검색 및 추가
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
                      src={director.directorImageUrl}
                      alt={director.directorName || '감독 이미지'}
                      fill
                      unoptimized
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </div>
                )}
                <span>{director.directorName}</span>
              </div>
              <Button
                type="button"
                className="cursor-pointer"
                size="sm"
                onClick={() => removeDirector(director.directorId)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
