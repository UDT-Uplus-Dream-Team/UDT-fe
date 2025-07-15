'use client';

import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { getTypeIcon, getTypeBadgeColor } from '@utils/content-utils';
import type { Content } from '@type/admin/Content';
import Image from 'next/image';
import { memo, useMemo } from 'react';

interface ContentCardProps {
  content: Content;
  onView: (content: Content) => void;
  onEdit: (content: Content) => void;
  onDelete: (contentId: number) => void;
}

function ContentCard({ content, onView, onEdit, onDelete }: ContentCardProps) {
  const TypeIcon = useMemo(
    () => getTypeIcon(content.categories[0]?.categoryType || ''),
    [content.categories],
  );

  const handleDelete = () => {
    if (confirm('정말로 이 콘텐츠를 삭제하시겠습니까?')) {
      onDelete(content.contentId);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {content.posterUrl && (
            <Image
              src={content.posterUrl}
              alt={content.title}
              width={64}
              height={80}
              className="object-cover rounded text-black"
            />
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <TypeIcon className="h-4 w-4 text-black" />
              <h3 className="font-medium text-lg text-black">
                {content.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>{content.openDate}</span>
              <span>•</span>

              <Badge
                className={getTypeBadgeColor(
                  content.categories[0]?.categoryType || '',
                )}
              >
                {content.categories[0]?.categoryType}
              </Badge>
              <Badge className="bg-white border border-gray-300 text-black rounded-full px-3 py-1 font-bold">
                {content.rating}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">플랫폼:</span>
              {content.platforms.slice(0, 3).map((platform) => (
                <Badge key={platform.platformType} className="text-xs">
                  {platform.platformType}
                </Badge>
              ))}
              {content.platforms.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{content.platforms.length - 3}개
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-1 ml-4">
          <Button
            size="sm"
            onClick={() => onView(content)}
            className="h-8 w-8 p-0 bg-transparent hover:bg-green-100 cursor-pointer"
          >
            <Eye className="h-4 w-4 text-green-600" />
          </Button>
          <Button
            size="sm"
            onClick={() => onEdit(content)}
            className="h-8 w-8 p-0 bg-transparent hover:bg-blue-100 cursor-pointer"
          >
            <Pencil className="h-4 w-4 text-blue-600" />
          </Button>
          <Button
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 bg-transparent hover:bg-red-100 cursor-pointer"
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default memo(ContentCard);
