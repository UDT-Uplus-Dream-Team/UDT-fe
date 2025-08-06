import { UserDetail } from '@type/admin/user';
import axiosInstance from '../axiosInstance';

export const getUserDetail = async (userId: number): Promise<UserDetail> => {
  const res = await axiosInstance.get(`/api/admin/users/${userId}/metrics`);
  return res.data;
};
