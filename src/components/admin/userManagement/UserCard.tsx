'use client';

import { Card, CardContent } from '@components/ui/card';
import { Button } from '@components/ui/button';
import { Mail, Calendar, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import { User } from '@type/admin/user';
import { Badge } from '../../ui/badge';
import { formatDateHour } from '@utils/admin/formatDate';

//개별 유저 정보 표시

interface UserCardProps {
  user: User;
  onView: (user: User) => void;
}

const getRoleBadge = (role: string) => {
  switch (role) {
    case 'ROLE_USER':
      return {
        label: '정회원',
        className: 'bg-green-100 text-green-700 hover:bg-green-100',
      };
    case 'ROLE_GUEST':
      return {
        label: '임시회원',
        className: 'bg-gray-200 text-gray-600 hover:bg-gray-200',
      };
    case 'ROLE_ADMIN':
      return {
        label: '관리자',
        className: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100',
      };
    default:
      return {
        label: '알 수 없음',
        className: 'bg-red-100 text-red-700 hover:bg-red-100',
      };
  }
};
export default function UserCard({ user, onView }: UserCardProps) {
  const { label, className } = getRoleBadge(user.userRole);
  return (
    <Card className="transition-all duration-200 border-gray-200 bg-white">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          {/* 프로필 이미지 */}
          <Avatar className="h-12 w-12">
            <AvatarImage
              src={user.profileImageUrl || '/images/default-profile.png'}
              alt={user.name}
            />
            <AvatarFallback className="bg-blue-100 text-blue-600 font-semibold">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          {/* 사용자 정보 */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-gray-900 truncate">
                {user.name}
              </h3>
              <Badge className={className}>{label}</Badge>
            </div>
            <div className="flex items-center text-sm text-gray-600 mb-1">
              <Mail className="h-4 w-4 mr-1 flex-shrink-0" />
              <span className="truncate">{user.email}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-1 flex-shrink-0" />
              <span>{formatDateHour(user.lastLoginAt)}</span>
            </div>
          </div>

          {/* 활동 통계 */}
          <div className="flex items-center space-x-6 text-sm">
            <div className="text-center">
              <div className="font-semibold text-green-600">
                {user.totalLikeCount}
              </div>
              <div className="text-gray-500">좋아요</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-red-600">
                {user.totalDislikeCount}
              </div>
              <div className="text-gray-500">싫어요</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-gray-600">
                {user.totalUninterestedCount}
              </div>
              <div className="text-gray-500">관심없음</div>
            </div>
          </div>

          {/* 수정 버튼 */}
          <div className="flex items-center">
            <Button
              onClick={() => onView(user)}
              size="sm"
              className="h-8 w-8 p-0 bg-transparent hover:bg-blue-100 cursor-pointer"
            >
              <Pencil className="h-4 w-4 text-blue-600" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
