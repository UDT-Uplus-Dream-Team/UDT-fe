'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@components/ui/card';
import UserCard from '@components/admin/userManagement/UserCard';
import { User } from '@type/admin/user';

//리스트 렌더링 + 무한 스크롤

interface Props {
  users: User[];
  onUserSelect: (user: User) => void;
  isLoading: boolean;
  hasNextPage: boolean;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
}

export default function UserList({
  users,
  onUserSelect,
  isLoading,
  hasNextPage,
  loadMoreRef,
}: Props) {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <div>
          <CardTitle className="text-xl font-semibold text-gray-900">
            등록된 회원 목록
          </CardTitle>
          <CardDescription className="text-gray-500">
            {/*나중에 count int로 주면 그때 타입 수정 및 아래 받는 값 수정 */}
            전체 {users.length}명의 회원
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {users
            .filter((user): user is User => user !== undefined && user !== null)
            .map((user) => (
              <UserCard key={user.id} user={user} onView={onUserSelect} />
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
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              불러오는 중...
            </div>
          </div>
        )}

        {!hasNextPage && users.length > 0 && (
          <div className="text-center py-8 text-gray-500 font-medium">
            더 이상 데이터가 없습니다.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
