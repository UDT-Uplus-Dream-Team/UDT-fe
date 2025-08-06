import { CursorPageResponse, User } from '@type/admin/user';
import axiosInstance from '../axiosInstance';

interface GetUserListParams {
  cursor?: string | null;
  keyword?: string;
  size?: number;
}

// [GET] /api/admin/users
export const getUserList = async ({
  cursor,
  keyword,
  size = 20,
}: GetUserListParams): Promise<CursorPageResponse<User>> => {
  const res = await axiosInstance.get('/api/admin/users', {
    params: {
      cursor,
      keyword,
      size,
    },
  });
  return res.data;
};
