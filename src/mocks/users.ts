import { User } from '@/types/admin/user';

export function generateMockUsers(count: number, startId: number): User[] {
  const names = [
    '김민수',
    '이지은',
    '박서준',
    '최유진',
    '정호석',
    '강소라',
    '윤도현',
    '임나영',
    '송지효',
    '김종국',
  ];
  const domains = ['gmail.com', 'naver.com', 'kakao.com', 'daum.net'];

  return Array.from({ length: count }, (_, index) => {
    const id = startId + index;
    const name = names[index % names.length];
    const domain = domains[index % domains.length];
    const joinDate = new Date(
      2024,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1,
    );

    return {
      memberId: id,
      name,
      email: `${name.toLowerCase()}${id}@${domain}`,
      joinDate: joinDate.toISOString(),
      likeCount: Math.floor(Math.random() * 50),
      dislikeCount: Math.floor(Math.random() * 20),
      uninterestedCount: Math.floor(Math.random() * 20),
      surveyCompleted: Math.round(Math.random()) === 1,
    };
  });
}
