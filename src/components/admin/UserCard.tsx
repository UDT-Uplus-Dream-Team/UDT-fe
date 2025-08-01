'use client';

import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Edit, Mail, Calendar } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { User } from '@type/admin/user';

interface UserCardProps {
  user: User;
  onView: (user: User) => void;
}

export default function UserCard({ user, onView }: UserCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 border-gray-200 bg-white">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* 프로필 이미지 */}
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={user.profileImage || '/images/default-profile.png'}
              alt={user.name}
            />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* 사용자 정보 */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-gray-900 truncate mb-1">
              {user.name}
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{formatDate(user.joinDate)}</span>
            </div>
          </div>

          {/* 활동 통계 */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {user.likeCount}
              </div>
              <div className="text-gray-500">좋아요</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">
                {user.dislikeCount}
              </div>
              <div className="text-gray-500">싫어요</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-600">
                {user.uninterestedCount}
              </div>
              <div className="text-gray-500">관심없음</div>
            </div>
          </div>

          {/* 수정 버튼 */}
          <div className="flex items-center">
            <Button
              onClick={() => onView(user)}
              size="sm"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 font-medium"
            >
              <Edit className="h-4 w-4 mr-1" />
              수정
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
