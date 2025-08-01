'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import UserCard from '@/components/admin/UserCard';
import { UserListProps } from '@/types/admin/user';

export default function UserList({
  users,
  onUserSelect,
  sortBy,
  onSortChange,
  isLoading,
  hasNextPage,
  loadMoreRef,
}: UserListProps) {
  // 정렬된 유저 목록
  const sortedUsers = [...users].sort((a, b) => {
    switch (sortBy) {
      case '좋아요 많은 순':
        return b.likeCount - a.likeCount;
      case '싫어요 많은 순':
        return b.dislikeCount - a.dislikeCount;
      case '관심없음 많은 순':
        return b.uninterestedCount - a.uninterestedCount;
      default:
        return 0;
    }
  });

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-semibold text-gray-900">
              등록된 회원 목록
            </CardTitle>
            <CardDescription className="text-gray-500">
              전체 {sortedUsers.length}명의 회원
            </CardDescription>
          </div>
          <div className="flex items-center space-x-4">
            <Select value={sortBy} onValueChange={onSortChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체</SelectItem>
                <SelectItem value="좋아요 많은 순">좋아요 많은 순</SelectItem>
                <SelectItem value="싫어요 많은 순">싫어요 많은 순</SelectItem>
                <SelectItem value="관심없음 많은 순">
                  관심없음 많은 순
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {sortedUsers.map((user) => (
            <UserCard key={user.memberId} user={user} onView={onUserSelect} />
          ))}
          <div ref={loadMoreRef} style={{ height: 1 }} />
        </div>

        {isLoading && (
          <div className="text-center py-8">
            <div className="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white transition ease-in-out duration-150">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              불러오는 중...
            </div>
          </div>
        )}
        {!hasNextPage && sortedUsers.length > 0 && (
          <div className="text-center py-8 text-gray-500 font-medium">
            더 이상 데이터가 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
