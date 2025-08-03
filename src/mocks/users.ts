import { User } from '@/types/admin/user';

export function generateMockUsers(): User[] {
  return [
    {
      id: 2,
      name: '홍길동',
      email: 'rysud0125@gmail.com',
      joinDate: '2024-01-01T00:00:00.000Z',
      likeCount: 38,
      dislikeCount: 22,
      uninterestedCount: 10,
      surveyCompleted: true,
    },
  ];
}
