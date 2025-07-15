export interface UserProfile {
  name: string;
  email: string;
  interest: string[];
}

export interface AuthResponse {
  user: UserProfile;
  accessToken: string;
  refreshToken: string;
}
