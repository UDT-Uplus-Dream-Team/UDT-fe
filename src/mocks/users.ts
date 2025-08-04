import { User } from '@/types/admin/user';

export function generateMockUsers(): User[] {
  return [
    {
      id: 2,
      name: '홍길동',
      email: 'hi@gmail.com',
      userRole: 'USER', // 또는 'GUEST'
      profileImageUrl: '', // 또는 null/undefined 가능
      lastLoginAt: '2024-08-03T12:34:56.000Z',
      totalLikeCount: 38,
      totalDislikeCount: 22,
      totalUninterestedCount: 10,
    },
    {
      id: 3,
      name: '이순신',
      email: 'soonshin@example.com',
      userRole: 'GUEST',
      profileImageUrl: '',
      lastLoginAt: '2024-08-01T08:22:13.000Z',
      totalLikeCount: 5,
      totalDislikeCount: 2,
      totalUninterestedCount: 1,
    },
  ];
}
