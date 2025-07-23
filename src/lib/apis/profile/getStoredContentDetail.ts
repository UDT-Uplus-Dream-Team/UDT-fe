import { StoredContentDetail } from '@type/profile/StoredContentDetail';
import axiosInstance from '../axiosInstance';

export const getStoredContentDetail = async (
  contentId: number,
): Promise<StoredContentDetail> => {
  const { data } = await axiosInstance.get(`/api/contents/${contentId}`);
  return data;
};
