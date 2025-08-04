'use client';

import { Badge } from '@components/ui/badge';
import { Button } from '@components/ui/button';
import { Eye, Pencil, Trash2 } from 'lucide-react';
import { getTypeIcon, getTypeBadgeColor } from '@utils/getContentUtils';
import type { ContentSummary } from '@type/admin/Content';
import Image from 'next/image';
import { memo, useMemo } from 'react';
import {
  showInteractiveToast,
  showSimpleToast,
} from '@components/common/Toast';

interface ContentCardProps {
  content: ContentSummary;
  onView: (contentId: number) => void;
  onEdit: (contentId: number) => void;
  onDelete: (contentId: number) => void;
}

function ContentCard({ content, onView, onEdit, onDelete }: ContentCardProps) {
  const TypeIcon = useMemo(
    () => getTypeIcon(content.categories?.[0] || ''),
    [content.categories],
  );
  const handleDelete = () => {
    showInteractiveToast.confirm({
      message: '정말로 이 콘텐츠를 삭제하시겠습니까?',
      confirmText: '삭제',
      cancelText: '취소',
      className: 'border',
      onConfirm: async () => {
        try {
          await onDelete(content.contentId);
          showSimpleToast.success({
            message: '콘텐츠가 삭제 배치 예정되었습니다.',
            position: 'top-center',
            className: 'border',
          });
        } catch {
          showSimpleToast.error({
            message: '삭제 중 문제가 발생했습니다. 다시 시도해주세요.',
            position: 'top-center',
            className: 'border',
          });
        }
      },
    });
  };

  return (
    <div className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          {content.posterUrl && (
            <div className="relative w-[64px] h-[100px]">
              <Image
                src={content.posterUrl}
                alt={content.title}
                unoptimized
                fill
                sizes="64px"
                className="object-cover rounded"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <TypeIcon className="h-4 w-4 text-black" />
              <h3 className="font-medium text-lg text-black">
                {content.title}
              </h3>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>{content.openDate?.split('T')[0] || ''}</span>
              <span>•</span>

              <Badge
                className={getTypeBadgeColor(content.categories?.[0] || '')}
              >
                {content.categories[0]}
              </Badge>
              <Badge className="bg-white border border-gray-300 text-black rounded-full px-3 py-1 font-bold">
                {content.rating}
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">플랫폼:</span>
              {content.platforms.slice(0, 3).map((platform, index) => (
                <Badge key={`${platform}-${index}`} className="text-xs">
                  {platform}
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
        <Button
          size="sm"
          onClick={() => onView(content.contentId)}
          className="h-8 w-8 p-0 bg-transparent hover:bg-green-100 cursor-pointer"
        >
          <Eye className="h-4 w-4 text-green-600" />
        </Button>
        <Button
          size="sm"
          onClick={() => onEdit(content.contentId)}
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
  );
}

export default memo(ContentCard);
