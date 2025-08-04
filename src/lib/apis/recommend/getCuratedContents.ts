import axiosInstance from '@/lib/apis/axiosInstance';
import { TicketComponent } from '@type/recommend/TicketComponent';

export const getCuratedContents = async (): Promise<TicketComponent[]> => {
  const response = await axiosInstance.get<TicketComponent[]>(
    '/api/v1/contents/recommendations/curated',
  );
  return response.data;
};
