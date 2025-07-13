// 회원 정보 타입
export interface UserInfo {
  name: string;
  email: string;
  genres: string[]; // 선호 장르
  platforms: string[]; // 선호 OTT
  profileImageUrl?: string; // 프로필 이미지 URL
}
