'use client';

import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@components/ui/card';
import { Plus, X } from 'lucide-react';
import { PLATFORMS } from '@lib/platforms';
import type { ContentWithoutId, PlatformInfo } from '@type/admin/Content';

interface PlatformSectionProps {
  formData: ContentWithoutId;
  newPlatform: PlatformInfo;
  setNewPlatform: (platform: PlatformInfo) => void;
  addPlatform: () => void;
  removePlatform: (index: number) => void;
}

export default function PlatformSection({
  formData,
  newPlatform,
  setNewPlatform,
  addPlatform,
  removePlatform,
}: PlatformSectionProps) {
  return (
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
              key={`${platform.platformType}-${platform.watchUrl}`}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div>
                <div className="font-medium">{platform.platformType}</div>
                <div className="text-sm text-gray-500">{platform.watchUrl}</div>
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
  );
}
