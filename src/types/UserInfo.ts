export interface UserInfo {
  name: string;
  email: string;
  platforms: string[]; // 예: ['넷플릭스', '왓챠']
  genres: string[];
  profileImageUrl?: string;
}
