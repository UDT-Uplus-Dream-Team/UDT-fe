import axiosInstance from '@lib/apis/axiosInstance';
import { TicketComponent } from '@type/recommend/TicketComponent';

export const getRecommendationContents = async (
  limit: number = 10,
): Promise<TicketComponent[]> => {
  const response = await axiosInstance.get<TicketComponent[]>(
    `/api/v1/contents/recommendations`,
    {
      params: { limit },
    },
  );
  return response.data;
};
